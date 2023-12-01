import {
	AfterContentInit,
	Component,
	EventEmitter,
	Input,
	OnDestroy,
	OnInit,
	Output,
	ViewEncapsulation
} from '@angular/core';
import {GridRowType} from '@shared/components/ag-grid/ag-grid.interface';
import {
	CellClickedEvent,
	CellEditingStartedEvent,
	CellEditingStoppedEvent,
	CellMouseOutEvent,
	CellMouseOverEvent,
	CellValueChangedEvent,
	ColDef, ColGroupDef,
	Column, FilterChangedEvent, FilterModifiedEvent,
	GridApi, GridOptions,
	GridReadyEvent,
	PasteEndEvent,
	PasteStartEvent,
	RowClassParams,
	RowDataTransaction,
	RowDataUpdatedEvent,
	RowNode,
	RowNodeTransaction,
	RowSelectedEvent,
	RowValueChangedEvent,
	SelectionChangedEvent, SortChangedEvent
} from 'ag-grid-community';

@Component({
	selector: 'app-ag-grid',
	templateUrl: './ag-grid.component.html',
	styleUrls: ['./ag-grid.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class AgGridComponent implements OnInit, OnDestroy, AfterContentInit {
	/**
	 * The rows of the grid. This will be your initialSchema to present in the grid
	 */
	@Input() rowData: any[];
	/**
	 * Array of column definitions
	 */
	@Input() columnDefs: ColDef[] = [];

	@Input() getRowClassHandler: (params: RowClassParams) => string;
	/**
	 * The height and width of the grid. These must be provided in order
	 * for the grid to be visible.
	 */
	@Input() style: string = 'width: 100%; height: 100%;';
	/**
	 * The ag-grid theme to use
	 */
	@Input() theme: string = 'ag-theme-quartz';
	/**
	 * Components the grid should use instead of it's default components (i.e. Column Header, Cell Renderer, etc.)
	 */
	@Input() frameworkComponents: any;
	/**
	 * The context of the grid. Include form groups, and properties from the parent component you want
	 * included in the grid components
	 */
	@Input() context: any;
	@Input() gridOptions: GridOptions = {
		animateRows: true,
		isExternalFilterPresent: () => false,
		doesExternalFilterPass: (node: RowNode) => false
	};
	@Input() dataIdProperty: string;

	@Input() rowSelection: 'single' | 'multiple' = 'multiple';
	@Input() suppressKeyboardEvent: boolean = false;
	@Input() suppressRowClickSelection: boolean = true;
	@Input() tabToNextCell: any;
	@Output() gridReadyEvt: EventEmitter<GridReadyEvent> = new EventEmitter<GridReadyEvent>();

	/* Cell editing events */
	@Output() cellEditingStartedEvt: EventEmitter<CellEditingStartedEvent> = new EventEmitter<CellEditingStartedEvent>();
	@Output() cellEditingStoppedEvt: EventEmitter<CellEditingStoppedEvent> = new EventEmitter<CellEditingStoppedEvent>();
	@Output() cellClickedEvt: EventEmitter<CellClickedEvent> = new EventEmitter<CellClickedEvent>();
	@Output() cellValueChangedEvt: EventEmitter<CellValueChangedEvent> = new EventEmitter<CellValueChangedEvent>();
	@Output() pasteStartEvt: EventEmitter<PasteStartEvent> = new EventEmitter<PasteStartEvent>();
	@Output() pasteEndEvt: EventEmitter<PasteEndEvent> = new EventEmitter<PasteEndEvent>();
	@Output() rowValueChangedEvt: EventEmitter<RowValueChangedEvent> = new EventEmitter<RowValueChangedEvent>();
	@Output() rowDataUpdatedEvt: EventEmitter<RowDataUpdatedEvent> = new EventEmitter<RowDataUpdatedEvent>();

	/* Selection events */
	@Output() rowSelectedEvt: EventEmitter<RowSelectedEvent> = new EventEmitter<RowSelectedEvent>();
	@Output() selectionChanged: EventEmitter<SelectionChangedEvent> = new EventEmitter<SelectionChangedEvent>();
	@Output() cellMouseOverEvt: EventEmitter<CellMouseOverEvent> = new EventEmitter<CellMouseOverEvent>();
	@Output() cellMouseOutEvt: EventEmitter<CellMouseOutEvent> = new EventEmitter<CellMouseOutEvent>();

	/* Filter events */
	@Output() filterChangedEvt: EventEmitter<FilterChangedEvent> = new EventEmitter<FilterChangedEvent>();
	@Output() filterModifiedEvt: EventEmitter<FilterModifiedEvent> = new EventEmitter<FilterModifiedEvent>();

	/* Sort events */
	@Output() sortChangedEvt: EventEmitter<SortChangedEvent> = new EventEmitter<SortChangedEvent>();

	gridApi: GridApi;
	columns: Column[] = [];

	constructor() {}

	ngOnInit() {}

	ngOnDestroy() {
		this.gridApi?.destroy();
	}

	ngAfterContentInit() {
		// console.log('AgGridComponent afterContentInit');
	}

	/**
	 * Once the grid is ready
	 * @param params
	 */
	onGridReady(params: GridReadyEvent) {
		// console.log('AgGridComponent, onGridReady', params);
		this.gridApi = params.api;
		this.columns = params.columnApi.getColumns();
		this.gridReadyEvt.emit(params);
	}

	/**
	 * Get a custom style class for the rows
	 * @param params
	 */
	getRowClass(params: RowClassParams) {
		if (this.getRowClassHandler) {
			return this.getRowClassHandler(params);
		}
		return;
	}

	/**
	 * Determine the row Id (not the id of the initialSchema item)
	 * @param data
	 */
	getRowNodeId(data) {
		if (this.dataIdProperty) {
			return data[this.dataIdProperty];
		}
		return;
	}

	/**
	 * Add a row to the grid with the newRowData as it's value. Returns the added rowNode
	 * @param rowIdx index to put new initialSchema
	 * @param newRowData a single object or array of objects
	 * @param transactionOptions
	 * @returns Node
	 */
	addRows(rowIdx: number, newRowData: any[], transactionOptions: RowDataTransaction = {}) {
		// console.log('AgGridComponent.addRows', newRowData);
		if (newRowData) {
			const rowDataTrans: RowDataTransaction = {
				...transactionOptions,
				add: newRowData,
				addIndex: rowIdx
			};
			const trans: RowNodeTransaction = this.gridApi.applyTransaction(rowDataTrans);
			// console.log('AgGrid.addRows, trans=', trans);
			return trans.add;
		}
		return [];
	}

	/**
	 * Update the value of the provided rowNode to newRowData
	 * @param rowNode
	 * @param newRowData
	 */
	updateRowNode(rowNode: RowNode, newRowData: any): RowNode {
		if (rowNode && newRowData) {
			rowNode.setData(newRowData);
		}
		return rowNode;
	}

	/**
	 * update the value of the row with the provided id to the newRowData
	 * @param id
	 * @param newRowData
	 */
	/*updateRow(id: string, newRowData: any): RowNode<any> | Error {
		let rowNode = this.gridApi.getRowNode(id);
		if (rowNode) {
			this.updateRowNode(rowNode, newRowData);
			rowNode = this.gridApi.getRowNode(id);
		}
		return rowNode || new Error(`Row with id ${id} not found`);
	}*/

	/**
	 * Delete the provided row IDs from the grid, may not work
	 * if there is no id for rows
	 * @param removeItems the initialSchema items to delete
	 */
	deleteRows(removeItems: any) {
		if (removeItems?.length) {
			const rowDataTrans: RowDataTransaction = {
				remove: removeItems
			};
			const trans: RowNodeTransaction = this.gridApi.applyTransaction(rowDataTrans);
			return trans.remove;
		}
		return [];
	}

	/**
	 * Set the defined cell as focused
	 * @param rowIdx
	 * @param fieldName
	 */
	/*setFocusedCell(rowIdx: number, fieldName: string): RowNode {
		if (rowIdx !== null && rowIdx !== undefined && fieldName) {
			this.gridApi.setFocusedCell(rowIdx, fieldName);
			return this.gridApi.getRenderedNodes()[rowIdx];
		}
		return null;
	}*/

	/**
	 * Will focus the defined cell and set that cell's mode to edit
	 * @param rowIdx
	 * @param fieldName
	 */
	/*startEditingCell(rowIdx: number, fieldName: string) {
		if (rowIdx !== null && rowIdx !== undefined && fieldName) {
			this.setFocusedCell(rowIdx, fieldName);
			this.gridApi.startEditingCell({rowIndex: rowIdx, colKey: fieldName});
		}
	}*/

	/**
	 * Will return the rendered row nodes. Will not include rows which have been
	 * filtered out of the grid
	 */
	/*getRenderedRowNodes(): RowNode[] {
		return this.gridApi.getRenderedNodes();
	}*/

	/**
	 * Will return the number of rendered rows. Will not include rows which have been
	 * filtered out of the grid
	 */
	getRowCount(): number {
		return this.gridApi.getDisplayedRowCount();
	}

	/**
	 * Get the initialSchema from the grid
	 * @param rowType defaults to 'all'
	 */
	getData(rowType: GridRowType = 'all'): any[] {
		if (rowType === 'displayed') {
			return this.gridApi.getRenderedNodes().map((node) => {
				return node.data;
			});
		}else if (rowType === 'filtered') {
			const filteredRows: any[] = [];
			this.gridApi.forEachNodeAfterFilter((node) => {
				filteredRows.push(node.data);
			});
			return filteredRows;
		}else if (rowType === 'sorted') {
			const sortedRows: any[] = [];
			this.gridApi.forEachNodeAfterFilterAndSort((node) => {
				sortedRows.push(node.data);
			});
			return sortedRows;
		}else{
			const allRows: any[] = [];
			this.gridApi.forEachNode((node) => {
				allRows.push(node.data);
			});
			return allRows;
		}
	}

	/**
	 * Will return the selected row nodes
	 */
	getSelectedRowData(): any[] {
		return this.gridApi.getSelectedRows();
	}

	updateColumnDef(field: string, newValue: ColDef) {
		const colDefs = this.gridApi.getColumnDefs();
		let updateColIdx = -1;
		colDefs.find((colDef: ColDef, idx, arr) => {
			if (colDef.field === field) {
				updateColIdx = idx;
				return true;
			}
			return false;
		});
		colDefs.splice(updateColIdx, 1, newValue);
		this.gridApi.setColumnDefs(colDefs);
	}

}
