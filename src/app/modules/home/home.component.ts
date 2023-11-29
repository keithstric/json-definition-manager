import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HttpService} from '@core/services/http/http.service';
import {LayoutService} from '@layout/services/layout/layout.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
	origHeaderComponent: any;
	editor: any;
	editorContent: any = {
		text: undefined,
		json: {
			"greeting": "Hello World"
		}
	};

	constructor(
		private _http: HttpService,
		private _layout: LayoutService
	) {}

	@ViewChild("jsonEditor") el: ElementRef<HTMLElement>;

	ngOnInit(): void {
		this.origHeaderComponent = this._layout.headerSource.value;
	}

	ngOnDestroy() {
		this._layout.setHeader(this.origHeaderComponent);
	}
}
