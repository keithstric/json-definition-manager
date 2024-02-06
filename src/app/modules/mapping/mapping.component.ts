import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FirestoreService} from '@core/services/firestore/firestore.service';
import {IMap, IPropertyDefinition, ISchema} from '@shared/interfaces/map.interface';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.scss']
})
export class MappingComponent implements OnInit, OnDestroy {
	mappingDoc: IMap;
	currentMapping: IMap;
	sourceSchema: ISchema;
	targetSchema: ISchema;
	sourceDefinition: IPropertyDefinition[];
	targetDefinition: IPropertyDefinition[];
	routeSub: Subscription;
	docId: string;

	constructor(
		private _route: ActivatedRoute,
		private firestore: FirestoreService,
	) {}

	async ngOnInit() {
		this.routeSub = this._route.params.subscribe(async (params) => {
			this.docId = params.mappingId;
			this.mappingDoc = await this.firestore.getDocumentById<IMap>('mappings', this.docId);
			if (this.mappingDoc) {
				this.currentMapping = this.mappingDoc;
				this.sourceSchema = await this.firestore.getDocumentById<ISchema>('schemas', this.mappingDoc.sourceSchemaId);
				this.targetSchema = await this.firestore.getDocumentById<ISchema>('schemas', this.mappingDoc.targetSchemaId);
				this.sourceDefinition = this.sourceSchema.definition;
				this.targetDefinition = this.targetSchema.definition;
			}
		});
	}

	ngOnDestroy() {
		this.routeSub.unsubscribe();
	}

	async saveMapping() {}

	revertChanges() {}

	updateCurrentMapping() {}

	createPropertyMapping(sourceProperty: string, targetProperty: string) {}

	deletePropertyMapping(propertyMappingId: string) {}

	updatePropertyMapping(sourceProperty: string, targetProperty: string) {}
}
