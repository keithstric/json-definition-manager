import {Component, OnDestroy, OnInit, inject} from '@angular/core';
import {collection, collectionData, Firestore} from '@angular/fire/firestore';
import {HttpService} from '@core/services/http/http.service';
import {LayoutService} from '@layout/services/layout/layout.service';
import {ISchema} from '@shared/interfaces/map.interface';
import {Observable} from 'rxjs';
import users from '../users.json';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
	origHeaderComponent: any;
	firestore: Firestore = inject(Firestore);
	schemas$: Observable<ISchema[]>;

	constructor(
		private _http: HttpService,
		private _layout: LayoutService
	) {
		const schemasColl = collection(this.firestore, 'schemas');
		this.schemas$ = collectionData(schemasColl) as unknown as Observable<ISchema[]>;
	}

	ngOnInit(): void {
		this.origHeaderComponent = this._layout.headerSource.value;
	}

	ngOnDestroy() {
		this._layout.setHeader(this.origHeaderComponent);
	}

	getUserEmail(userId: string) {
		const user = users.find(user => user.id === userId);
		return user.emailAddress;
	}
}
