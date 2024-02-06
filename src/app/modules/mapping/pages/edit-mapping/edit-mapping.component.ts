import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FirestoreService} from '@core/services/firestore/firestore.service';
import {IMap, IPropertyDefinition, ISchema} from '@shared/interfaces/map.interface';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-edit-mapping',
  templateUrl: './edit-mapping.component.html',
  styleUrls: ['./edit-mapping.component.scss']
})
export class EditMappingComponent implements OnInit, OnDestroy {
	mappingDoc: IMap;
	currentMapping: IMap;
	sourceSchema: ISchema;
	targetSchema: ISchema;
	sourceDefinition: IPropertyDefinition[];
	targetDefinition: IPropertyDefinition[];
	routeSub: Subscription;
	docId: string;

	constructor(
		private firestore: FirestoreService,
		private _route: ActivatedRoute
		) {}

	ngOnInit(): void {
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

	ngOnDestroy(): void {
		this.routeSub.unsubscribe();
	}

	async saveMapping() {}

	revertChanges() {}

	updateCurrentMapping() {}

	createPropertyMapping(sourceProperty: string, targetProperty: string) {}

	deletePropertyMapping(propertyMappingId: string) {}

	updatePropertyMapping(sourceProperty: string, targetProperty: string) {}
}
