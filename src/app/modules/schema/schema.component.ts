import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {
	DefinitionDataTypes,
	DefinitionItem,
	SchemaDefinitionDocument
} from '@modules/schema/interfaces/schema.interface';
import {Subscription} from 'rxjs';
import schemas from '../schemas.json';

@Component({
  selector: 'app-schema',
  templateUrl: './schema.component.html',
  styleUrls: ['./schema.component.scss']
})
export class SchemaComponent implements OnInit, OnDestroy {
	editorIsCollapsed: boolean = false;
	definitionIsCollapsed: boolean = true;
	initialSchema: any;
	currentSchema: any;
	initialDefinition: DefinitionItem[] = [{path: null, description: null, type: null, schema: null, required: false, comments: null}];
	currentDefinition: DefinitionItem[] = [];
	routeSub: Subscription;

	constructor(private _route: ActivatedRoute) {}

	ngOnInit() {
		this.routeSub = this._route.params.subscribe(params => {
			// todo: Should be a fetch once we have a backend
			const schema = schemas.find(schema => schema.id === params.schemaId);
			this.initialSchema = schema.schema;
			this.currentSchema = this.initialSchema;
			this.initialDefinition = schema.definition;
		});
	};

	ngOnDestroy() {
		this.routeSub.unsubscribe();
	}

	/**
	 * Toggle the appropriate collapse element open/closed
	 * @param collapse
	 */
	toggleCollapse(collapse: 'editor' | 'definition') {
		if (collapse === 'editor') {
			this.editorIsCollapsed = !this.editorIsCollapsed;
		}else{
			this.definitionIsCollapsed = !this.definitionIsCollapsed;
		}
	}

	/**
	 * Save the current schema
	 */
	saveSchema() {
		console.log('saveSchema, currentSchema', this.currentSchema);
	}

	/**
	 * Set the editor value to the initial value
	 */
	revertToOriginalSchema() {
		this.initialSchema = Object.assign({}, this.initialSchema);
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
