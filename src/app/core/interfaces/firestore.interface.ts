export interface WhereQuery {
	fieldName?: string;
	condition?: '==' | '!=' | '>' | '>=' | '<' | '<=' | 'in' | 'not-in' | 'array-contains' | 'array-contains-any';
	value?: string | number | boolean;
	arrayValue?: string[] | number[] | boolean[];
	orderBy?: string | string[];
	limit?: number;
	sortBy?: string;
	sortDirection?: 'asc' | 'desc';
}
