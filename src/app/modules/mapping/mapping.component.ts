import {Component, OnInit} from '@angular/core';
import {FirestoreService} from '@core/services/firestore/firestore.service';
import {IMap} from '@shared/interfaces/map.interface';

@Component({
  selector: 'app-mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.scss']
})
export class MappingComponent implements OnInit {
	mappings: IMap[] = [];

	constructor(private firestore: FirestoreService) {}

	async ngOnInit() {
		const mappings = await this.firestore.getAllDocuments<IMap>('mappings');
		this.mappings = mappings
			.map((mapping: any) => {
				if(mapping.createdDate && typeof mapping.createdDate === 'object') {
					mapping.createdDate = new Date(mapping.createdDate.seconds*1000).toISOString();
				}
				if (mapping.updatedDate && typeof mapping.updatedDate === 'object') {
					mapping.updatedDate = new Date(mapping.updatedDate.seconds*1000).toISOString();
				}
				return mapping;
			})
			.sort((a,b) => {
				const aDate = new Date(a.createdDate);
				const bDate = new Date(b.createdDate);
				return aDate > bDate ? -1 : aDate < bDate ? 1 : 0;
			});
	}
}
