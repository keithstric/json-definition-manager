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
import {AgGridAngular} from 'ag-grid-angular';
import {ColDef, GridApi, GridReadyEvent, IRowNode, RowEditingStartedEvent, RowEditingStoppedEvent} from 'ag-grid-community';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-schema-definition',
  templateUrl: './schema-definition.component.html',
  styleUrls: ['./schema-definition.component.scss']
})
export class SchemaDefinitionComponent implements OnInit, OnChanges {
	@Input() initialDefinition: any[] = [];
	@Output() dataChanged: EventEmitter<any> = new EventEmitter<any>();
	currentDefinition: any[];
	gridStyle: string;
	gridApi: GridApi;
	gridIsReady: boolean = false;

	@ViewChild(AgGridAngular) grid: AgGridAngular;
	@ViewChild('gridContainer') gridContainer: ElementRef;

	ngOnInit() {
		// Gotta use the JSON.parse(JSON.stringify) trick to ensure currentDefinition isn't an instance of definition
		this.currentDefinition = JSON.parse(JSON.stringify(this.initialDefinition));
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.initialDefinition && !changes.initialDefinition.firstChange && this.gridIsReady) {
			this.gridApi.setGridOption('rowData', changes.initialDefinition.currentValue);
			this.dataChanged.emit(this.gridApi.getGridOption('rowData'));
		}
	}

	_onGridReady(evt: GridReadyEvent) {
		this.gridApi = evt.api;
		const gridContainerHeight = this.gridContainer.nativeElement.clientHeight;
		this.gridStyle = `width: 100%; height: ${gridContainerHeight < 50 ? 500 : gridContainerHeight}px;`;
		this._setupGrid();
	}

	private _setupGrid() {
		const firstItem = this.currentDefinition?.length ? this.currentDefinition[0] : null;
		let colDefs: ColDef[] = [];
		if (firstItem) {
			colDefs = Object.keys(firstItem).map(key => {
				return {
					field: key.toLowerCase(),
					sortable: key === 'path',
					cellEditor: key === 'type' ? 'agSelectCellEditor' : undefined,
					cellEditorParams: key === 'type'
						? {values: [
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
						]}
						: undefined
				};
			});
		}
		this.gridApi.setGridOption('rowData', this.currentDefinition.slice());
		this.gridApi.setGridOption('columnDefs', colDefs);
		this.gridApi.setGridOption('defaultColDef', {editable: true});
		this.gridApi.setGridOption('editType', 'fullRow');
		this.gridIsReady = true;
	}

	_addRow() {
		if (this.gridApi.getGridOption('rowData')?.length) {
			let newFgObj = {};
			Object.keys(this.gridApi.getGridOption('rowData')[0]).forEach(key => {
				newFgObj[key] = key === 'required' ? false : null;
			});
			const newRowDataValue = [...JSON.parse(JSON.stringify(this.gridApi.getGridOption('rowData'))), newFgObj];
			this.gridApi.setGridOption('rowData', newRowDataValue);
			this.currentDefinition = this.gridApi.getGridOption('rowData');
			this.dataChanged.emit(newRowDataValue);
		}
	}

	_onRowEditingStopped(evt: RowEditingStoppedEvent) {
		this.currentDefinition = JSON.parse(JSON.stringify(this.gridApi.getGridOption('rowData')));
		this.dataChanged.emit(this.gridApi.getGridOption('rowData'));
	}
}
