export interface IDbDoc {
	id?: string;
	createdBy?: string;
	createdDate?: string;
	updatedBy?: string;
	updatedDate?: string;
}
export interface IMap extends IDbDoc {
	name: string;
	targetSchema: ISchema;
	sourceSchema: ISchema;
	definition: IPropertyDefinition[];
	collaborators: string[];
}
export interface ISchema extends IDbDoc {
	name: string;
	schema: any;
}
export interface IPropertyDefinition extends IDbDoc {
	path: string;
	description: string;
	type: string;
	childSchema?: string;
	required: boolean;
	comments: string;
}
