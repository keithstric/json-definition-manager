export interface SchemaDefinition {
	name: string;
	id?: string;
	schema?: string;
	collaborators?: string[];
	createdBy?: string;
	createdOn?: Date;
	updatedBy?: string;
	updatedOn?: Date;
}
