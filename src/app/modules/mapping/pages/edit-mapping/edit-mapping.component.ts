import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FirestoreService} from '@core/services/firestore/firestore.service';
import {NotificationService} from '@core/services/notification/notification.service';
import {LeaderLineItem} from '@modules/mapping/interfaces/leader-line.interface';
import {IFieldMappingProperty, IMap, IPropertyDefinition, ISchema} from '@shared/interfaces/map.interface';
import LeaderLine from 'leader-line-new';
import _ from 'lodash';
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
	sourceSchemaId: string = undefined;
	sourceSchemaDoc: ISchema;
	sourceSchema: any;
	sourceMappingFields: IFieldMappingProperty[] = [];
	sourceFieldMappings: IFieldMappingProperty[] = [];
	targetSchemaId: string = undefined;
	targetSchemaDoc: ISchema;
	targetSchema: any;
	targetMappingFields: IFieldMappingProperty[] = [];
	targetFieldMappings: IFieldMappingProperty[] = [];
	sourceDefinition: IPropertyDefinition[];
	targetDefinition: IPropertyDefinition[];
	routeSub: Subscription;
	docId: string;
	leaderLines: LeaderLineItem[] = [];

	constructor(
		private firestore: FirestoreService,
		private _route: ActivatedRoute
		) {}

	async ngOnInit() {
		await this.fetchSchemas();
		this.routeSub = this._route.params.subscribe(async (params) => {
			this.docId = params.mappingId;
			if (this.docId !== 'new') {
				this.mappingDoc = await this.firestore.getDocumentById<IMap>('mappings', this.docId);
				if (this.mappingDoc) {
					this.currentMapping = this.mappingDoc;
					this.sourceSchema = await this.firestore.getDocumentById<ISchema>('schemas', this.mappingDoc.sourceSchemaId);
					this.targetSchema = await this.firestore.getDocumentById<ISchema>('schemas', this.mappingDoc.targetSchemaId);
					this.sourceDefinition = this.sourceSchema.definition;
					this.targetDefinition = this.targetSchema.definition;
				}
			}
		});
	}

	ngOnDestroy(): void {
		this.routeSub.unsubscribe();
	}

	async fetchSchemas() {
		if (!this.schemas?.length) {
			const schemas = await this.firestore.getAllDocuments<ISchema>('schemas');
			if (schemas?.length) {
				const sortedSchemas = schemas.sort((a, b) => {
					const aName = a.name.toLowerCase();
					const bName = b.name.toLowerCase();
					return aName < bName ? -1 : aName > bName ? 1 : 0;
				});
				this.schemas = sortedSchemas;
			}
		}
	}

	/**
	 * Called from the dropdown at the top of the respective schema panel. Sets the displayed schema
	 * @param evt
	 * @param type
	 */
	_onSchemaSelect(evt: Event, type: 'source' | 'target') {
		const evtTarget = evt.target as HTMLSelectElement;
		const selectedId = evtTarget.value === 'undefined' || evtTarget.value === 'null' ? undefined : evtTarget.value;
		if (!selectedId) {
			if (type === 'source') {
				this.sourceSchemaDoc = undefined;
				this.sourceSchema = undefined;
				this.sourceMappingFields = [];
			}else if (type === 'target') {
				this.targetSchemaDoc = undefined;
				this.targetSchema = undefined;
				this.targetMappingFields = [];
			}
			return;
		}
		const compareId = type === 'source' ? this.targetSchemaId : this.sourceSchemaId;
		if (selectedId && compareId && selectedId === compareId) {
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
		if (schemaDoc) {
			const mappingFields = this._buildFields(schemaDoc.definition);
			if (type === 'source') {
				this.sourceSchemaDoc = schemaDoc;
				this.sourceSchemaDoc.definition = this.sourceSchemaDoc.definition.sort((a, b) => {
					const aPath = a.path;
					const bPath = b.path;
					return aPath > bPath ? 1 : aPath < bPath ? -1 : 0;
				});
				this.sourceSchema = schemaDoc.schema;
				this.sourceMappingFields = mappingFields;
			} else {
				this.targetSchemaDoc = schemaDoc;
				this.targetSchemaDoc.definition = this.targetSchemaDoc.definition.sort((a, b) => {
					const aPath = a.path;
					const bPath = b.path;
					return aPath > bPath ? 1 : aPath < bPath ? -1 : 0;
				});
				this.targetSchema = schemaDoc.schema;
				this.targetMappingFields = mappingFields;
			}
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
			const expanded = false;
			const id = `${path}-${fieldType}`;
			const name = property.path.split('.').pop();
			const descendantDefs = definition.filter(item => item.path.startsWith(`${path}.`));
			let children = descendantDefs?.length ? this._buildFields(descendantDefs, path) : undefined;
			const shouldReturn = rootItems.filter(item => item.path === path).length > 0;
			if (shouldReturn) {
				mappingFields.push({
					path,
					name,
					fieldType,
					expanded,
					id,
					children
				});
			}
		}
		return mappingFields;
	}

	/**
	 * Called from the list item that has children. Expands/Collapses the clicked property
	 * @param evt
	 * @param field
	 */
	_expandCollapse(evt: Event, field: IFieldMappingProperty) {
		evt.stopPropagation();
		if (field.children) {
			field.expanded = !field.expanded;
			if (this.leaderLines?.length) {
				this.leaderLines.forEach(line => {
					line.line.position();
				});
			}
		}
	}

	/**
	 * Called from the button next to the field in the respective schema panel
	 * @param field
	 * @param schemaType
	 */
	_createFieldMapping(field: IFieldMappingProperty, schemaType: 'source' | 'target') {
		field.mapped = true;
		field.id = `${field.path}-${field.fieldType}`;
		const fieldMappings = schemaType === 'source' ? this.sourceFieldMappings : schemaType === 'target' ? this.targetFieldMappings : undefined;
		if (fieldMappings) {
			fieldMappings.push(field);
		}
		if (this.sourceFieldMappings?.length && this.targetFieldMappings?.length) {
			this._setLeaderLine(this.sourceFieldMappings[0], this.targetFieldMappings[0]);
		}
	}

	/**
	 * Called from the dropdown in the field mapping panel of the respective type (source or target)
	 * @param evt
	 * @param schemaType
	 */
	_addFieldMapping(evt: Event, schemaType: 'source' | 'target') {
		const el: HTMLSelectElement = evt.target as HTMLSelectElement;
		const selectedValue = el.value;
		const mappingFields = schemaType === 'source' ? this.sourceMappingFields : this.targetMappingFields;
		const fieldMappings = schemaType === 'source' ? this.sourceFieldMappings : this.targetFieldMappings;
		const mappingField = this._findMappingField(mappingFields, selectedValue);
		if (mappingField) {
			mappingField.mapped = true;
			mappingField.id = `${mappingField.path}-${mappingField.fieldType}`;
			fieldMappings.push(mappingField);
		}
		if (this.leaderLines?.length) {
			const idFieldName = schemaType === 'source' ? 'targetId' : 'sourceId';
			const otherFieldMappings = schemaType === 'source' ? this.targetFieldMappings : this.sourceFieldMappings;
			const leaderLine = this.leaderLines.find(leaderLine => leaderLine[idFieldName] === otherFieldMappings[0].id);
			if (schemaType === 'source') {
				this._setLeaderLine(mappingField, leaderLine.targetField);
			}else{
				this._setLeaderLine(leaderLine.sourceField, mappingField);
			}
		}
	}

	/**
	 * Called from the delete button next to the field in the mapping panel
	 * @param idx
	 * @param schemaType
	 */
	_deleteFieldMapping(idx: number, schemaType: 'source' | 'target') {
		const fieldMappings = schemaType === 'source' ? this.sourceFieldMappings : this.targetFieldMappings;
		const fieldMapping = fieldMappings[idx];
		const mappingFields = schemaType === 'source' ? this.sourceMappingFields : this.targetMappingFields;
		const mappingField = this._findMappingField(mappingFields, fieldMapping.path);
		mappingField.mapped = false;
		fieldMappings.splice(idx, 1);
		const leaderLineLookupId = schemaType === 'source' ? 'sourceId' : 'targetId';
		this.leaderLines.forEach((leaderLineItem, idx) => {
			if (leaderLineItem[leaderLineLookupId] === fieldMapping.id) {
				leaderLineItem.line.remove();
				this.leaderLines.splice(idx, 1);
			}
		});
	}

	_setLeaderLine(sourceField: IFieldMappingProperty, targetField: IFieldMappingProperty) {
		const sourceId = sourceField.id;
		const targetId = targetField.id;
		const sourceEl = document.getElementById(sourceId);
		const targetEl = document.getElementById(targetId);
		const leaderLineItem: LeaderLineItem = {
			sourceId,
			sourceEl,
			sourceField,
			targetId,
			targetEl,
			targetField,
			line: new LeaderLine(sourceEl, targetEl, {size: 2})
		};
		this.leaderLines.push(leaderLineItem);
		return leaderLineItem;
	}

	private _findMappingField(mappingFields: IFieldMappingProperty[], path: string) {
		const pathArr = path.split('.');
		let rootFieldsIdx: number;
		let currentMappingField = mappingFields.find((item, idx) => {
			if (item.path === pathArr[0]) {
				rootFieldsIdx = idx;
				return true;
			}
			return false
		});
		if (pathArr.length > 1) {
			let nextPath = `${pathArr[0]}`;
			let fieldPath = `${rootFieldsIdx}.children`;
			let pathIdx = 1;
			while (pathIdx < pathArr.length) {
				nextPath = `${nextPath}.${pathArr[pathIdx]}`
				currentMappingField = currentMappingField.children.find((item, childIdx) => {
					if (item.path === nextPath) {
						if (pathIdx < pathArr.length - 1) {
							fieldPath = `${fieldPath}.${childIdx}.children`;
						}else{
							fieldPath = `${fieldPath}.${childIdx}`;
							return false;
						}
						return true;
					}
					return false;
				});
				pathIdx++;
			}
			return _.get(mappingFields, fieldPath);
		} else {
			return currentMappingField;
		}
	}

	_showMapping(field: IFieldMappingProperty, schemaType: 'source' | 'target') {
		console.log('_showMapping, field=', field);
	}

	async saveMapping() {}

	revertChanges() {}

	updateCurrentMapping() {}

	createPropertyMapping(sourceProperty: string, targetProperty: string) {}

	deletePropertyMapping(propertyMappingId: string) {}

	updatePropertyMapping(sourceProperty: string, targetProperty: string) {}
}
