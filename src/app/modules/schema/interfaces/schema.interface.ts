export interface SchemaDefinitionDocument {
	name: string;
	id?: string;
	schema?: string;
	definition: string[];
	collaborators?: string[];
	createdBy?: string;
	createdOn?: string;
	updatedBy?: string;
	updatedOn?: string;
}

export type DefinitionDataTypes = 'array' | 'boolean' | 'boolean[]' | 'custom' | 'custom[]' | 'date' | 'date[]' | 'number' | 'number[]' | 'object' | 'object[]' | 'string' | 'string[]';

export interface DefinitionItem {
	path: string;
	description: string;
	type: DefinitionDataTypes;
	schema: string;
	required: boolean;
	comments: string;
}
