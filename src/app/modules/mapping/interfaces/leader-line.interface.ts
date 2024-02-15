import {IFieldMappingProperty} from '@shared/interfaces/map.interface';

export interface LeaderLineItem {
	sourceId: string;
	sourceEl: HTMLElement;
	sourceField?: IFieldMappingProperty;
	targetId: string;
	targetEl: HTMLElement;
	targetField?: IFieldMappingProperty;
	line?: any;
}
