import {
	AfterViewInit,
	Component,
	EventEmitter,
	Input, OnChanges,
	Output, SimpleChanges,
	ViewChild
} from '@angular/core';
import {JsonEditorComponent, JsonEditorOptions} from 'ang-jsoneditor';

@Component({
  selector: 'app-schema-editor',
  templateUrl: './schema-editor.component.html',
  styleUrls: ['./schema-editor.component.scss']
})
export class SchemaEditorComponent implements AfterViewInit, OnChanges {
	@Input() schema: any;
	@Output() dataChanged: EventEmitter<any> = new EventEmitter<any>();

	@ViewChild('treeEditor', { static: false }) treeEditor: JsonEditorComponent;
	@ViewChild('codeEditor', { static: false }) codeEditor: JsonEditorComponent;

	ngAfterViewInit(): void {
		this.treeEditor.expandAll();
	}

	ngOnChanges(changes: SimpleChanges) {
		console.log('ngOnChanges, changes=', changes.schema);
		if (changes.schema?.currentValue && !changes.schema?.isFirstChange()) {
			this.treeEditor.set(changes.schema.currentValue);
			this.codeEditor.set(changes.schema.currentValue);
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
		options.enableSort = true;
		// @ts-ignore
		options.onChangeText = ['tree', 'view', 'form'].includes(mode) ? this.onChangeText.bind(this) : undefined;
		return options;
	}

	/**
	 * Update the "other" editor and notify the parent of the change
	 * @param evt
	 * @param editor
	 */
	onChange(evt: any, editor: JsonEditorComponent) {
		if (evt instanceof Event) {
			const newValue = editor.get();
			this.treeEditor.set(newValue);
			this.treeEditor.expandAll();
			this.dataChanged.emit(this.treeEditor.get());
		}
	}

	onChangeText(newValue: any) {
		this.codeEditor.set(this.treeEditor.get());
		this.dataChanged.emit(this.treeEditor.get());
	}
}
