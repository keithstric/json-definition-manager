import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {LocalStorageService} from '@core/services/local-storage/local-storage.service';
import {PROJECT_NAME} from 'src/environments/environment';

/**
 * The default header
 * Use the @link {LayoutService} to set the header
 *
 * @example
 *
 * ```
 * constructor(private _layout: LayoutService){}
 *
 * setHeader() {
 *   this._layout.setHeader(SomeHeaderComponent);
 * }
 * ```
 */
@Component({
	selector: 'app-header',
	templateUrl: './site-header.component.html',
	styleUrls: ['./site-header.component.scss']
})
export class SiteHeaderComponent implements OnInit, OnDestroy {
	title: string = PROJECT_NAME;
	user: any;
	subscriptions: Subscription = new Subscription();
	active: 'about' | 'features';

	constructor(
		private _storage: LocalStorageService,
		private _router: Router,
	) {	}

	ngOnInit(): void {
		this.listenToRoute();
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}

	/**
	 * Listen to route changes and if about or features is the active route
	 * set the active property
	 * @private
	 */
	private listenToRoute() {
		this.subscriptions.add(this._router.events.subscribe((val) => {
			if (val instanceof NavigationEnd) {
				if (this._router.isActive('/features', true)) {
					this.active = 'features';
				} else if (this._router.isActive('/about', true)) {
					this.active = 'about';
				} else {
					this.active = undefined;
				}
			}
		}));
	}
}
