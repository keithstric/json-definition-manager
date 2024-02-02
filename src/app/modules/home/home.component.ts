import {Component, OnDestroy, OnInit} from '@angular/core';
import {FirestoreService} from '@core/services/firestore/firestore.service';
import {HttpService} from '@core/services/http/http.service';
import {LayoutService} from '@layout/services/layout/layout.service';
import {ISchema} from '@shared/interfaces/map.interface';
import users from '../users.json';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
	origHeaderComponent: any;
	schemas: ISchema[];

	constructor(
		private _http: HttpService,
		private _layout: LayoutService,
		private _firestore: FirestoreService,
	) {}

	async ngOnInit(): Promise<void> {
		this.origHeaderComponent = this._layout.headerSource.value;
		const result = await this._firestore.getAllDocuments<ISchema>('schemas');
		this.schemas = result.sort((a,b) => {
			const aName = a.name;
			const bName = b.name;
			return aName > bName ? 1 : aName < bName ? -1 : 0;
		});
	}

	ngOnDestroy() {
		this._layout.setHeader(this.origHeaderComponent);
	}

	getUserEmail(userId: string) {
		const user = users.find(user => user.id === userId);
		return user.emailAddress;
	}
}
