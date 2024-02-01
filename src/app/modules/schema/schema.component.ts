import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {collection, doc, Firestore, setDoc} from '@angular/fire/firestore';
import {ActivatedRoute} from '@angular/router';
import {
	DefinitionDataTypes,
	DefinitionItem,
} from '@modules/schema/interfaces/schema.interface';
import {ISchema} from '@shared/interfaces/map.interface';
import {Subscription} from 'rxjs';
import {v4 as uuid} from 'uuid';

@Component({
  selector: 'app-schema',
  templateUrl: './schema.component.html',
  styleUrls: ['./schema.component.scss']
})
export class SchemaComponent implements OnInit, OnDestroy {
	sourceSchema: any;
	targetSchema: any;
	currentSchema: any;
	initialDefinition: DefinitionItem[] = [{path: null, description: null, type: null, schema: null, required: false, comments: null}];
	currentDefinition: DefinitionItem[] = [];
	routeSub: Subscription;
	firestore: Firestore = inject(Firestore);

	constructor(
		private _route: ActivatedRoute,
	) {}

	ngOnInit() {
		/*this.routeSub = this._route.params.subscribe(params => {
			// todo: Should be a fetch once we have a backend
			const schema = schemas.find(schema => schema.id === params.schemaId);
			this.sourceSchema = schema.schema;
			this.currentSchema = this.sourceSchema;
			this.initialDefinition = schema.definition;
		});*/
	};

	ngOnDestroy() {}

	/**
	 * Save the current schema
	 */
	async saveSchema() {
		console.log('saveSchema, currentSchema', this.currentSchema);
		try {
			const schemasColl = collection(this.firestore, 'schemas');
			const newDoc: ISchema = {
				name: 'New Doc',
				id: uuid(),
				schema: this.currentSchema,
				createdBy: 'keithstric@gmail.com',
				createdDate: new Date().toISOString()
			};
			const docRef = doc(schemasColl, newDoc.id);
			const newDocRef = await setDoc(docRef, newDoc);
			console.log('newDocRef=', newDocRef);
		}catch(e) {
			console.error(e);
		}
	}

	/**
	 * Set the editor value to the initial value
	 */
	revertToOriginalSchema() {
		this.sourceSchema = Object.assign({}, this.sourceSchema);
	}

	/**
	 * Update the currentSchema value to match the editor
	 * @param newValue
	 */
	updateCurrentSchema(newValue: any) {
		this.currentSchema = newValue;
	}

	/**
	 * parse the content from the schema editor into the definition
	 * @param obj
	 * @param parentPath
	 */
	copyToDefinition(obj?: any, parentPath?: string) {
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
				const childItems = this.copyToDefinition(obj[key], key);
				returnVal = [...returnVal, ...childItems];
			}else{
				returnItem.path = parentPath ? `${parentPath}.${key}` : key;
				returnItem.type = this._getDefinitionDataType(obj[key]);
				returnVal.push(returnItem);
			}
		});
		this.initialDefinition = returnVal;
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

	saveDefinition() {
		console.log('saveDefinition, currentDefinition', this.currentDefinition);
	}

	revertToOriginalDefinition() {
		this.initialDefinition = this.initialDefinition.slice();
	}

	updateCurrentDefinition(newValue: any) {
		this.currentDefinition = newValue;
	}
}
