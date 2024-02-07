import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {GridSchemaEditorComponent} from '@modules/schema/components/grid-schema-editor/grid-schema-editor.component';
import {DefinitionDataTypes, DefinitionItem} from '@modules/schema/interfaces/schema.interface';
import {AgGridAngular} from 'ag-grid-angular';
import {ColDef, GridApi, GridReadyEvent, RowEditingStoppedEvent} from 'ag-grid-community';
import {JsonEditorComponent, JsonEditorOptions} from 'ang-jsoneditor';
import _ from 'lodash';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';

@Component({
  selector: 'app-schema-definition-editor',
  templateUrl: './schema-definition-editor.component.html',
  styleUrls: ['./schema-definition-editor.component.scss']
})
export class SchemaDefinitionEditorComponent implements OnInit {
	@Input() schema: any;
	@Input() definition: DefinitionItem[] = [];
	@Output() dataChanged: EventEmitter<any> = new EventEmitter<any>();
	colDefs: ColDef[] = [];
	gridStyle: string;
	gridApi: GridApi;
	gridIsReady: boolean = false;
	onTextChangeSubj = new Subject<any>();

	@ViewChild('treeEditor', { static: false }) treeEditor: JsonEditorComponent;
	@ViewChild('codeEditor', { static: false }) codeEditor: JsonEditorComponent;
	@ViewChild(AgGridAngular) grid: AgGridAngular;
	@ViewChild('gridContainer') gridContainer: ElementRef;

	ngOnInit() {
		this.onTextChangeSubj.pipe(
			debounceTime(1200),
			distinctUntilChanged()
		).subscribe(newSchema => {
			try {
				const newValue = this.treeEditor.get();
				this.codeEditor.set(newValue);
				const newDefinition = this._convertSchemaToDefinition();
				this.onChange(newValue, newDefinition);
			}catch (e) {
				console.error(e);
			}
		});
	}

	/****** CODE EDITOR ******/
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
	onChangeCode(evt: any, editor: JsonEditorComponent) {
		if (evt instanceof Event) {
			const newValue = this.codeEditor.get();
			this.treeEditor.set(newValue);
			const newDefinition = this._convertSchemaToDefinition();
			this.onChange(newValue, newDefinition);
		}
	}

	onChangeText() {
		this.onTextChangeSubj.next(this.treeEditor.get());
	}

	onChange(newSchema: any, newDefinition: DefinitionItem[]) {
		this.schema = newSchema;
		this.definition = newDefinition;
		this.treeEditor.expandAll();
		this.dataChanged.emit({schema: newSchema, definition: newDefinition});
	}

	/**
	 * parse the content from the schema editor into the definition
	 * @param obj
	 * @param parentPath
	 */
	private _convertSchemaToDefinition(obj?: any, parentPath?: string) {
		obj = obj || this.codeEditor.get();
		let returnVal = [];
		Object.keys(obj).forEach(key => {
			const returnItem: DefinitionItem = {
				path: null,
				description: null,
				type: null,
				schema: null,
				required: false,
				comments: null
			};
			if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
				returnItem.path = parentPath ? `${parentPath}.${key}` : key;
				returnItem.type = this._getDefinitionDataType(obj[key]);
				returnVal.push(returnItem);
				const childItems = this._convertSchemaToDefinition(obj[key], key);
				returnVal = [...returnVal, ...childItems];
			}else{
				returnItem.path = parentPath ? `${parentPath}.${key}` : key;
				returnItem.type = this._getDefinitionDataType(obj[key]);
				returnVal.push(returnItem);
			}
		});
		return returnVal;
	}

	/**
	 * Get the definition data type from the passed in value
	 * @param value
	 * @private
	 */
	private _getDefinitionDataType(value: any): DefinitionDataTypes {
		const validDataTypes = ['array', 'boolean', 'number', 'string', 'object'];
		let returnVal = 'string'
		if (Array.isArray(value)) {
			returnVal = 'array';
		}else {
			returnVal = typeof value;
		}
		return <"array" | "boolean" | "number" | "object" | "string">returnVal;
	}

	/****** GRID FUNCTIONS ******/
	_onGridReady(evt: GridReadyEvent) {
		this.gridApi = evt.api;
		const gridContainerHeight = this.gridContainer.nativeElement.clientHeight;
		this.gridStyle = `width: 100%; height: ${gridContainerHeight < 50 ? 500 : gridContainerHeight}px;`;
		this._setupGrid();
	}

	private _setupGrid() {
		const colDefs = this._getColumnDefs();
		this.gridApi.setGridOption('columnDefs', colDefs);
		this.gridApi.setGridOption('defaultColDef', {editable: true});
		this.gridApi.setGridOption('editType', 'fullRow');
		this.gridIsReady = true;
	}

	private _getColumnDefs() {
		const keys = ['path', 'description', 'type', 'schema', 'required', 'comments'];
		return keys.map(key => {
			let colDef = {
				field: key.toLowerCase(),
				sortable: key === 'path',
				cellEditor: undefined,
				cellEditorParams: undefined,
			};
			switch (key) {
				case 'type':
					colDef.cellEditor = 'agSelectCellEditor';
					colDef.cellEditorParams = this._getTypeEditorVals();
					break;
				case 'schema':
					colDef.cellEditor = GridSchemaEditorComponent;
					colDef.cellEditorParams = {key};
					break;
			}
			return colDef;
		});
	}

	private _getTypeEditorVals () {
		return {values: [
				'array',
				'boolean',
				'boolean[]',
				'custom',
				'custom[]',
				'date',
				'date[]',
				'number',
				'number[]',
				'object',
				'object[]',
				'string',
				'string[]'
			]};
	}

	_addRow() {
		if (this.gridApi.getGridOption('rowData')?.length) {
			let newFgObj = {};
			Object.keys(this.gridApi.getGridOption('rowData')[0]).forEach(key => {
				newFgObj[key] = key === 'required' ? false : null;
			});
			const newRowDataValue = [...JSON.parse(JSON.stringify(this.gridApi.getGridOption('rowData'))), newFgObj];
			this.gridApi.setGridOption('rowData', newRowDataValue);
			this.definition = this.gridApi.getGridOption('rowData');
		}
	}

	_onRowEditingStopped(evt: RowEditingStoppedEvent) {
		// this.definition = JSON.parse(JSON.stringify(this.gridApi.getGridOption('rowData')));
		const newDefinition = JSON.parse(JSON.stringify(this.gridApi.getGridOption('rowData')));
		const newSchema = this._convertDefinitionToSchema();
		this.onChange(newSchema, newDefinition);
	}

	private _convertDefinitionToSchema() {
		const definition = this.definition;
		let updatedSchema = Object.assign(this.schema, {}) || {};
		definition.forEach(property => {
			const {path, type} = property;
			const currentVal = _.get(updatedSchema, path);
			if (!currentVal) {
				_.set(updatedSchema, path, this._getTypeValue(type));
			}
		});
		return updatedSchema;
	}

	private _getTypeValue(type: DefinitionDataTypes) {
		switch(type) {
			case 'array':
				return [];
			case 'boolean':
				return true;
			case 'boolean[]':
				return [true, false];
			case 'date':
				return new Date().toISOString();
			case 'date[]':
				return [new Date().toISOString(), new Date().toISOString()];
			case 'number':
				return 50;
			case 'number[]':
				return [25, 50, 75, 100];
			case 'object':
				return {};
			case 'object[]':
				return [{}, {}];
			case 'string':
				return 'string';
			case 'string[]':
				return ['string1', 'string2'];
			case 'custom':
				return {};
			case 'custom[]':
				return [{}, {}];
		}
	}
}
