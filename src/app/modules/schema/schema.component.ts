import {Component, OnDestroy, OnInit} from '@angular/core';
import {FirestoreService} from '@core/services/firestore/firestore.service';
import users from '@modules/users.json';
import {IMap, ISchema} from '@shared/interfaces/map.interface';

@Component({
  selector: 'app-schema',
  templateUrl: './schema.component.html',
  styleUrls: ['./schema.component.scss']
})
export class SchemaComponent implements OnInit, OnDestroy {
	schemas: ISchema[];

	constructor(
		private firestore: FirestoreService,
	) {}

	async ngOnInit() {
		const schemas = await this.firestore.getAllDocuments<ISchema>('schemas');
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
	}

	ngOnDestroy() {}

	getUserEmail(userId: string) {
		const user = users.find(user => user.id === userId);
		return user.emailAddress;
	}
}
