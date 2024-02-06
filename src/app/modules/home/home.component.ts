import {Component, OnDestroy, OnInit} from '@angular/core';
import {WhereQuery} from '@core/interfaces/firestore.interface';
import {FirestoreService} from '@core/services/firestore/firestore.service';
import {HttpService} from '@core/services/http/http.service';
import {LayoutService} from '@layout/services/layout/layout.service';
import {IMap, ISchema} from '@shared/interfaces/map.interface';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
	origHeaderComponent: any;
	schemas: ISchema[];
	mappings: IMap[];

	constructor(
		private _http: HttpService,
		private _layout: LayoutService,
		private _firestore: FirestoreService,
	) {}

	async ngOnInit(): Promise<void> {
		this.origHeaderComponent = this._layout.headerSource.value;
		const schemasQuery: WhereQuery = {
			orderBy: 'createdDate',
			sortDirection: 'desc',
			sortBy: 'createdDate',
			limit: 15
		};
		const schemas = await this._firestore.getDocumentsByQuery('schemas', schemasQuery);
		this.schemas = schemas.map((schema: any) => {
				if(schema.createdDate && typeof schema.createdDate === 'object') {
					schema.createdDate = this._firestore.getDateFromTimestamp(schema.createdDate).toISOString();
				}
				if (schema.updatedDate && typeof schema.updatedDate === 'object') {
					schema.updatedDate = this._firestore.getDateFromTimestamp(schema.updatedDate).toISOString();
				}
				return schema;
			});

		const mappingsQuery: WhereQuery = {
			orderBy: 'createdDate',
			sortDirection: 'desc',
			sortBy: 'createdDate',
			limit: 15
		}
		const mappings = await this._firestore.getDocumentsByQuery('mappings', mappingsQuery);
		this.mappings = mappings
			.map((mapping: any) => {
				if(mapping.createdDate && typeof mapping.createdDate === 'object') {
					mapping.createdDate = this._firestore.getDateFromTimestamp(mapping.createdDate).toISOString();
				}
				if (mapping.updatedDate && typeof mapping.updatedDate === 'object') {
					mapping.updatedDate = this._firestore.getDateFromTimestamp(mapping.updatedDate).toISOString();
				}
				return mapping;
			})
	}

	ngOnDestroy() {
		this._layout.setHeader(this.origHeaderComponent);
	}
}
