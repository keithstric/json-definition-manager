import {NgForOf} from '@angular/common';
import {Component, ViewChild, ViewContainerRef} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {WhereQuery} from '@core/interfaces/firestore.interface';
import {FirestoreService} from '@core/services/firestore/firestore.service';
import {ISchema} from '@shared/interfaces/map.interface';
import { ICellEditorParams } from 'ag-grid-community';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';

export type GridSchemaEditorItem = {value: string, label: string};

@Component({
	standalone: true,
	imports: [FormsModule, NgForOf, BsDropdownModule],
  selector: 'app-grid-schema-editor',
  templateUrl: './grid-schema-editor.component.html',
  styleUrls: ['./grid-schema-editor.component.scss']
})
export class GridSchemaEditorComponent {
	params: ICellEditorParams;
	selectItems: GridSchemaEditorItem[] = [];
	value: string;
	searchValue: string;

	@ViewChild('select', {read: ViewContainerRef})
	public select: ViewContainerRef;

	constructor(private firestore: FirestoreService) {}

	async agInit(params: ICellEditorParams) {
		console.log('agInit, params=', params);
		this.params = params;
	}

	async searchSchemas(evt: InputEvent) {
		console.log('searchSchemas, evt=', evt);
		const whereQuery: WhereQuery = {
			fieldName: 'name',
			condition: '==',
			value: (evt.target as any).value
		};
		const results = await this.firestore.getDocumentsByQuery<ISchema>('schemas', whereQuery);
		console.log('results=', results);
		this.selectItems = results.map(doc => {
			return {value: doc.id, label: doc.name};
		});
	}

	selectSchema(item: GridSchemaEditorItem) {
		this.value = item.value;
		console.log('this.value=', this.value);
	}
}
