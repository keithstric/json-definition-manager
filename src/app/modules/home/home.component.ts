import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HttpService} from '@core/services/http/http.service';
import {LayoutService} from '@layout/services/layout/layout.service';
import schemas from '../schemas.json';
import users from '../users.json';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
	origHeaderComponent: any;
	protected readonly schemas = schemas;

	constructor(
		private _http: HttpService,
		private _layout: LayoutService
	) { }

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
