import {Component, OnDestroy, OnInit} from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
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
		const schemas = await this._firestore.getAllDocuments<ISchema>('schemas');
		this.schemas = schemas
			.map((schema: any) => {
				if(schema.createdDate && typeof schema.createdDate === 'object') {
					schema.createdDate = new Date(schema.createdDate.seconds*1000).toISOString();
				}
				if (schema.updatedDate && typeof schema.updatedDate === 'object') {
					schema.updatedDate = new Date(schema.updatedDate.seconds*1000).toISOString();
				}
				return schema;
			})
			.sort((a,b) => {
				const aName = new Date(a.createdDate);
				const bName = new Date(b.createdDate);
				return aName > bName ? -1 : aName < bName ? 1 : 0;
			});

		const mappings = await this._firestore.getAllDocuments<IMap>('mappings');
		this.mappings = mappings
			.map((mapping: any) => {
				if(mapping.createdDate && typeof mapping.createdDate === 'object') {
					mapping.createdDate = new Date(mapping.createdDate.seconds*1000).toISOString();
				}
				if (mapping.updatedDate && typeof mapping.updatedDate === 'object') {
					mapping.updatedDate = new Date(mapping.updatedDate.seconds*1000).toISOString();
				}
				return mapping;
			})
			.sort((a,b) => {
				const aCreated = new Date(a.createdDate);
				const bCreated = new Date(b.createdDate);
				return aCreated > bCreated ? -1 : aCreated < bCreated ? 1 : 0;
			});
	}

	ngOnDestroy() {
		this._layout.setHeader(this.origHeaderComponent);
	}
}
