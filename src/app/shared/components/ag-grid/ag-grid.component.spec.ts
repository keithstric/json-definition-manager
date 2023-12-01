import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AgGridModule} from 'ag-grid-angular';
import {ColDef, RowNode} from 'ag-grid-community';

import {AgGridComponent} from './ag-grid.component';

describe('AgGridComponent', () => {
	let component: AgGridComponent;
	let fixture: ComponentFixture<AgGridComponent>;
	const colDefs: ColDef[] = [
		{
			headerName: '1',
			field: 'one'
		}, {
			headerName: '2',
			field: 'two'
		}, {
			headerName: '3',
			field: 'three'
		}
	];
	const gridData = [
		{one: 'foo', two: 'bar', three: 'baz', id: 1},
		{one: 'foo', two: 'bar', three: 'baz', id: 2},
		{one: 'foo', two: 'bar', three: 'baz', id: 3},
		{one: 'foo', two: 'bar', three: 'baz', id: 4}
	];

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				AgGridModule.withComponents()
			],
			declarations: [AgGridComponent]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(AgGridComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should provide the grid api and fire gridReadyEvt event', (done) => {
		component.gridReadyEvt.subscribe((params) => {
			expect(component.gridApi).toBeTruthy();
			done();
		});
	});

	it('should set row initialSchema', (done) => {
		component.columnDefs = colDefs;
		component.rowData = gridData;
		fixture.detectChanges();
		component.gridReadyEvt.subscribe((params) => {
			expect(component.gridApi.getDisplayedRowCount()).toBe(4);
			done();
		});
	});

	it('should add rows to the grid', (done) => {
		component.columnDefs = colDefs;
		component.rowData = gridData;
		component.dataIdProperty = 'id';
		fixture.detectChanges();
		component.gridReadyEvt.subscribe((params) => {
			const newRow = [{one: 'foo', two: 'bar', three: 'baz', id: 5}];
			const transaction = component.addRows(4, newRow);
			expect(transaction).toBeTruthy();
			expect(component.gridApi.getDisplayedRowCount()).toBe(5);
			done();
		});
	});

	it('should update rows in the grid', (done) => {
		component.columnDefs = colDefs;
		component.rowData = gridData;
		component.dataIdProperty = 'id';
		fixture.detectChanges();
		component.gridReadyEvt.subscribe((params) => {
			const updatedRow = {one: 'baz', two: 'bam', three: 'boom', id: 4};
			const rowNode = component.updateRow('4', updatedRow);
			expect(rowNode).toBeTruthy();
			expect((rowNode as RowNode).data.one).toEqual('baz');
			const error = component.updateRow('5', {...updatedRow, id: 5});
			expect((error as Error).message).toBeTruthy();
			done();
		});
	});

	it('should delete rows in the grid', (done) => {
		component.columnDefs = colDefs;
		component.rowData = gridData;
		component.dataIdProperty = 'id';
		fixture.detectChanges();
		component.gridReadyEvt.subscribe((params) => {
			const removeItems = gridData.slice(2);
			const trans = component.deleteRows(removeItems);
			expect(trans).toBeTruthy();
			expect(component.gridApi.getDisplayedRowCount()).toBe(2);
			done();
		});
	});

	it('should get initialSchema from the grid', (done) => {
		component.columnDefs = colDefs;
		component.rowData = gridData;
		fixture.detectChanges();
		component.gridReadyEvt.subscribe((params) => {
			const data = component.getData('all');
			expect(data.length).toBe(4);
			done();
		});
	});

	it('should get the initialSchema id from a row', (done) => {
		component.columnDefs = colDefs;
		component.rowData = gridData;
		component.dataIdProperty = 'id';
		fixture.detectChanges();
		component.gridReadyEvt.subscribe((params) => {
			const id = component.getRowNodeId(gridData[0]);
			expect(id).toEqual(1);
			done();
		});
	});

});
