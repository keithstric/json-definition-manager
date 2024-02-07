import {
	Component,
	ElementRef,
	EventEmitter,
	Input,
	OnChanges,
	OnInit,
	Output,
	SimpleChanges,
	ViewChild
} from '@angular/core';
import {GridSchemaEditorComponent} from '@modules/schema/components/grid-schema-editor/grid-schema-editor.component';
import {AgGridAngular} from 'ag-grid-angular';
import {ColDef, GridApi, GridReadyEvent, IRowNode, RowEditingStartedEvent, RowEditingStoppedEvent} from 'ag-grid-community';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-schema-definition',
  templateUrl: './schema-definition.component.html',
  styleUrls: ['./schema-definition.component.scss']
})
export class SchemaDefinitionComponent {
	@Input() definition: any[] = [];
	@Output() dataChanged: EventEmitter<any> = new EventEmitter<any>();
	gridStyle: string;
	gridApi: GridApi;
	gridIsReady: boolean = false;

	@ViewChild(AgGridAngular) grid: AgGridAngular;
	@ViewChild('gridContainer') gridContainer: ElementRef;

	_onGridReady(evt: GridReadyEvent) {
		this.gridApi = evt.api;
		const gridContainerHeight = this.gridContainer.nativeElement.clientHeight;
		this.gridStyle = `width: 100%; height: ${gridContainerHeight < 50 ? 500 : gridContainerHeight}px;`;
		this._setupGrid();
	}

	private _setupGrid() {
		const colDefs: ColDef[] = this._getColumnDefs();
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
		this.definition = JSON.parse(JSON.stringify(this.gridApi.getGridOption('rowData')));
		this.dataChanged.emit(this.gridApi.getGridOption('rowData'));
	}
}
