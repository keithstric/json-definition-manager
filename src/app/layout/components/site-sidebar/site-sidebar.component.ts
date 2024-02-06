import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-site-sidebar',
  templateUrl: './site-sidebar.component.html',
  styleUrls: ['./site-sidebar.component.scss']
})
export class SiteSidebarComponent implements OnInit, OnDestroy {
	routeSub: Subscription;
	currentRoutePath: string;

	constructor(private route: Router) {}

	ngOnInit() {
		this.routeSub = this.route.events.subscribe((event) => {
			if (event instanceof NavigationEnd) {
				if (event.url.startsWith('/schemas')) {
					this.currentRoutePath = 'schema';
				}else if (event.url.startsWith('/mappings')) {
					this.currentRoutePath = 'mapping';
				}else if (event.url === '/') {
					this.currentRoutePath = 'home';
				}
			}
		})
	}

	ngOnDestroy() {
		this.routeSub?.unsubscribe();
	}
}
