import {
	AfterViewInit,
	Component,
	EventEmitter,
	Input,
	OnChanges,
	OnInit,
	Output,
	SimpleChanges,
	ViewChild
} from '@angular/core';
import {JsonEditorComponent, JsonEditorOptions} from 'ang-jsoneditor';

@Component({
  selector: 'app-schema-editor',
  templateUrl: './schema-editor.component.html',
  styleUrls: ['./schema-editor.component.scss']
})
export class SchemaEditorComponent implements AfterViewInit, OnChanges {
	@Input() initialSchema: any;
	@Output() dataChanged: EventEmitter<any> = new EventEmitter<any>();

	@ViewChild('treeEditor', { static: false }) treeEditor: JsonEditorComponent;
	@ViewChild('codeEditor', { static: false }) codeEditor: JsonEditorComponent;

	ngAfterViewInit(): void {
		this.treeEditor.set(this.initialSchema);
		this.codeEditor.set(this.initialSchema);
		this.treeEditor.expandAll();
	}

	/**
	 * Support reverting back to original value
	 * @param changes
	 */
	ngOnChanges(changes: SimpleChanges) {
		if (changes.initialSchema && !changes.initialSchema.firstChange) {
			this.codeEditor.set(changes.initialSchema.currentValue);
			this.treeEditor.set(changes.initialSchema.currentValue);
			this.treeEditor.expandAll();
			this.dataChanged.emit(this.treeEditor.get());
		}
	}

	/**
	 * Get the editor options based on the provided mode
	 * @param mode
	 */
	getEditorOptions(mode: 'code' | 'text' | 'tree' | 'view' | 'form') {
		const options = new JsonEditorOptions();
		options.modes = ['code', 'text', 'tree', 'view', 'form'];
		options.mode = mode;
		options.expandAll = ['tree', 'view', 'form'].includes(mode);
		options.mainMenuBar = true;
		// options.onCreateMenu = this.onCreateMenu.bind(this);
		return options;
	}

	/**
	 * Adds a "Add Comment" item to the context menu. Fires when context menu is clicked
	 * @param items
	 * @param node
	 */
	onCreateMenu(items: any[], node: any) {
		const commentPropertyPath = node.path.join('.');
		items.unshift({
			text: 'Add Comment',
			title: `Add a comment to the ${commentPropertyPath} property`,
			click: this.onAddComment.bind(this, [node])
		});
		return items;
	}

	onAddComment(node: any) {
		console.log('onAddComment, node=', node);
	}

	/**
	 * Update the "other" editor and notify the parent of the change
	 * @param newValue
	 * @param editor
	 */
	onChange(newValue: any, editor: JsonEditorComponent) {
		if (!(newValue instanceof Event)) {
			if (editor === this.treeEditor) {
				this.codeEditor.set(this.treeEditor.get());
			} else if (editor === this.codeEditor) {
				this.treeEditor.set(this.codeEditor.get());
				this.treeEditor.expandAll();
			}
			this.dataChanged.emit(this.treeEditor.get());
		}
	}
}
