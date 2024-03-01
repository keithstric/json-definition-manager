import {IFieldMappingProperty} from '@shared/interfaces/map.interface';

export interface LeaderLineItem {
	sourceId: string;
	sourceEl: HTMLElement;
	sourceField?: IFieldMappingProperty;
	sourceParentId?: string;
	targetId: string;
	targetEl: HTMLElement;
	targetField?: IFieldMappingProperty;
	targetParentId?: string;
	line?: any;
}
