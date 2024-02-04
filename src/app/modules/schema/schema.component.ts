import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FirestoreService} from '@core/services/firestore/firestore.service';
import {NotificationService} from '@core/services/notification/notification.service';
import {DefinitionDataTypes, DefinitionItem,} from '@modules/schema/interfaces/schema.interface';
import {SnackbarMessageTypes} from '@shared/components/snack-bar/snack-bar.interface';
import {ISchema} from '@shared/interfaces/map.interface';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-schema',
  templateUrl: './schema.component.html',
  styleUrls: ['./schema.component.scss']
})
export class SchemaComponent implements OnInit, OnDestroy {
	schemaDoc: ISchema;
	schemaName: string;
	schemaDesc: string;
	/**
	 * This is NOT the schema document but is the schema property inside the schema document
	 */
	schema: any;
	/**
	 * Current value of the editor, needed to prevent endless loop in the schema-editor component
	 */
	currentSchema: any;
	definition: DefinitionItem[] = [{path: null, description: null, type: null, schema: null, required: false, comments: null}];
	currentDefinition: DefinitionItem[] = [];
	routeSub: Subscription;
	docId: string;

	constructor(
		private _route: ActivatedRoute,
		private firestore: FirestoreService,
	) {}

	async ngOnInit() {
		this.routeSub = this._route.params.subscribe(async (params) => {
			this.docId = params.schemaId;
			this.schemaDoc = await this.firestore.getDocument<ISchema>('schemas', this.docId);
			if (this.schemaDoc) {
				this.schema = this.schemaDoc.schema;
				this.currentSchema = this.schemaDoc.schema;
				this.schemaName = this.schemaDoc.name;
				this.schemaDesc = this.schemaDoc.description;
				this.definition = this.schemaDoc.definition;
				this.currentDefinition = this.schemaDoc.definition;
			}
		});
	}

	ngOnDestroy() {
		this.routeSub?.unsubscribe();
	}

	/**
	 * Save the current schema
	 */
	async saveSchema() {
		const workingDoc = this.docId !== 'new'
			? {...this.schemaDoc, schema: this.currentSchema, definition: this.currentDefinition}
			: {
				name: this.schemaName,
				description: this.schemaDesc,
				schema: this.currentSchema,
				definition: this.currentDefinition,
			};
		try {
			const resultDoc = this.docId === 'new'
				? await this.firestore.addDocument('schemas', workingDoc)
				: await this.firestore.updateDocument('schemas', this.docId, workingDoc);
			NotificationService.showSnackbar({
				message: `Successfully ${this.docId === 'new' ? 'created' : 'updated'} the ${resultDoc.name} schema.`,
				messageType: SnackbarMessageTypes.SUCCESS
			});
		}catch (e) {
			throw e;
		}
	}

	/**
	 * Set the editor value to the initial value
	 */
	revertChanges() {
		this.schema = Object.assign({}, this.schema);
		this.definition = Object.assign({}, this.definition);
	}

	/**
	 * Update the currentSchema value to match the editor
	 * @param newValue
	 */
	updateCurrentSchema(newValue: any) {
		this.currentSchema = newValue;
		this.convertSchemaToDefinition();
	}

	updateCurrentDefinition(newValue: any) {
		this.currentDefinition = newValue;
	}

	/**
	 * parse the content from the schema editor into the definition
	 * @param obj
	 * @param parentPath
	 */
	convertSchemaToDefinition(obj?: any, parentPath?: string) {
		obj = obj || this.currentSchema;
		let returnVal = [];
		Object.keys(obj).forEach(key => {
			const returnItem: DefinitionItem = {
				path: null,
				description: null,
				type: null,
				schema: null,
				required: false,
				comments: null
			};
			if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
				returnItem.path = parentPath ? `${parentPath}.${key}` : key;
				returnItem.type = this._getDefinitionDataType(obj[key]);
				returnVal.push(returnItem);
				const childItems = this.convertSchemaToDefinition(obj[key], key);
				returnVal = [...returnVal, ...childItems];
			}else{
				returnItem.path = parentPath ? `${parentPath}.${key}` : key;
				returnItem.type = this._getDefinitionDataType(obj[key]);
				returnVal.push(returnItem);
			}
		});
		this.definition = returnVal;
		return returnVal;
	}

	/**
	 * Get the definition data type from the passed in value
	 * @param value
	 * @private
	 */
	private _getDefinitionDataType(value: any): DefinitionDataTypes {
		const validDataTypes = ['array', 'boolean', 'number', 'string', 'object'];
		let returnVal = 'string'
		if (Array.isArray(value)) {
			returnVal = 'array';
		}else {
			returnVal = typeof value;
		}
		return <"array" | "boolean" | "number" | "object" | "string">returnVal;
	}
}
