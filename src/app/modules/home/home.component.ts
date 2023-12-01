import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HttpService} from '@core/services/http/http.service';
import {LayoutService} from '@layout/services/layout/layout.service';
import {JsonEditorComponent, JsonEditorOptions} from 'ang-jsoneditor';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
	origHeaderComponent: any;

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
}
