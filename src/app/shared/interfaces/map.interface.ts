export interface IDbDoc {
	id?: string;
	createdBy?: string;
	createdDate?: string;
	updatedBy?: string;
	updatedDate?: string;
}
export interface IMap extends IDbDoc {
	name: string;
	targetSchemaId: string;
	sourceSchemaId: string;
	collaborators: string[];
	mapping: IFieldMapping[];
}
export interface IFieldMapping {
	 sourceField: IFieldMappingProperty;
	 targetField: IFieldMappingProperty;
}
export interface ISchema extends IDbDoc {
	name: string;
	description: string;
	schema: any;
	definition: IPropertyDefinition[];
}
export interface IPropertyDefinition {
	path: string;
	description: string;
	type: string;
	childSchema?: string;
	required: boolean;
	comments: string;
}
export interface IFieldMappingProperty {
	path: string;
	name: string;
	fieldType: string;
	mapped?: boolean;
	id?: string;
	children?: IFieldMappingProperty[];
}
