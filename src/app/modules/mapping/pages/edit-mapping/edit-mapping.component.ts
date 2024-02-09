import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FirestoreService} from '@core/services/firestore/firestore.service';
import {NotificationService} from '@core/services/notification/notification.service';
import {IFieldMappingProperty, IMap, IPropertyDefinition, ISchema} from '@shared/interfaces/map.interface';
import {JsonEditorOptions} from 'ang-jsoneditor';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-edit-mapping',
  templateUrl: './edit-mapping.component.html',
  styleUrls: ['./edit-mapping.component.scss']
})
export class EditMappingComponent implements OnInit, OnDestroy {
	mappingDoc: IMap;
	currentMapping: IMap;
	mappingName: string;
	mappingDesc: string;
	schemas: ISchema[] = [];
	sourceSchemaId: string;
	sourceSchemaDoc: ISchema;
	sourceSchema: any;
	sourceMappingFields: IFieldMappingProperty[] = [];
	targetSchemaId: string;
	targetSchemaDoc: ISchema;
	targetSchema: any;
	targetMappingFields: IFieldMappingProperty[] = [];
	sourceDefinition: IPropertyDefinition[];
	targetDefinition: IPropertyDefinition[];
	routeSub: Subscription;
	docId: string;
	expandedItems: string[] = [];

	constructor(
		private firestore: FirestoreService,
		private _route: ActivatedRoute
		) {}

	async ngOnInit() {
		await this.fetchSchemas();
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

	async fetchSchemas() {
		this.schemas = await this.firestore.getAllDocuments<ISchema>('schemas');
	}

	_onSchemaSelect(evt: Event, type: 'source' | 'target') {
		const evtTarget = evt.target as HTMLSelectElement;
		const selectedId = evtTarget.value;
		const compareId = type === 'source' ? this.targetSchemaId : this.sourceSchemaId
		if (compareId && selectedId === compareId) {
			NotificationService.showConfirmDialog({
				modalHeaderText: 'Schema and Target must be different',
				confirmButtonLabel: 'OK',
				hideCancelButton: true,
				modalTextContent: 'Please select two different schemas.',
				confirmHandler(data?: any) {
					evtTarget.value = undefined;
				},
				ngModalOptions: {
					ignoreBackdropClick: true,
					keyboard: false
				}
			});
			return;
		}
		const schemaDoc = this.schemas.find(schema => schema.id === selectedId);
		const mappingFields = this._buildFields(schemaDoc.definition);
		if (type === 'source') {
			this.sourceSchemaDoc = schemaDoc;
			this.sourceSchema = schemaDoc.schema;
			this.sourceMappingFields = mappingFields;
		}else{
			this.targetSchemaDoc = schemaDoc;
			this.targetSchema = schemaDoc.schema;
			this.targetMappingFields = mappingFields;
		}
	}

	private _buildFields(definition: IPropertyDefinition[], parentPath?: string) {
		const mappingFields = [];
		const parentPathLen = parentPath ? parentPath.split('.').length : 0;
		const rootItems = definition.filter(item => item.path.split('.').length === (parentPathLen + 1));
		for (let i = 0; i < rootItems.length; i++) {
			const property = rootItems[i];
			const path = property.path;
			const pathArr = property.path.split('.');
			const currentPathLength = pathArr.length;
			const fieldType = property.type;
			const name = property.path.split('.').pop();
			const descendantDefs = definition.filter(item => item.path.startsWith(`${path}.`));
			let children = descendantDefs?.length ? this._buildFields(descendantDefs, path) : undefined;
			const shouldReturn = rootItems.filter(item => item.path === path).length > 0;
			if (shouldReturn) {
				mappingFields.push({
					path,
					name,
					fieldType,
					children
				});
			}
		}
		return mappingFields;
	}

	_expandCollapse(evt: Event, field: IFieldMappingProperty) {
		evt.stopPropagation();
		if (field.children) {
			const fieldPath = field.path;
			console.log('_expandCollapse, evt=', evt, fieldPath);
			const el = document.getElementById(fieldPath);
			if (el.classList.contains('collapse')) {
				el.classList.remove('collapse');
				this.expandedItems.push(fieldPath);
			} else {
				const idx = this.expandedItems.indexOf(fieldPath);
				if (idx > -1) {
					this.expandedItems.splice(idx, 1);
				}
				el.classList.add('collapse');
			}
			console.log('_expandCollapse, expandedItems=', this.expandedItems);
		}
	}

	async saveMapping() {}

	revertChanges() {}

	updateCurrentMapping() {}

	createPropertyMapping(sourceProperty: string, targetProperty: string) {}

	deletePropertyMapping(propertyMappingId: string) {}

	updatePropertyMapping(sourceProperty: string, targetProperty: string) {}
}
