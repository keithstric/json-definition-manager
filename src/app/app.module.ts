import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {Injector, NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CoreModule} from '@core/core.module';
import {ServiceLocator} from '@core/services/service-locator';
import {LayoutModule} from '@layout/layout.module';
import {SnackBarRef} from '@shared/components/snack-bar/snack-bar.ref';
import {SharedModule} from '@shared/shared.module';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';

/**
 * The AppModule
 */
@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		AppRoutingModule,
		BrowserAnimationsModule,
		BrowserModule,
		CommonModule,
		CoreModule,
		LayoutModule,
		ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
		SharedModule
	],
	providers: [SnackBarRef],
	bootstrap: [AppComponent]
})

export class AppModule {
	/**
	 * Update the ServiceLocator to provide the injector to static methods, properties and pojo items
	 * @param _injector
	 */
	constructor(private _injector: Injector) {
		const injectorListener = ServiceLocator.observableInjector.subscribe((injector) => {
			ServiceLocator.injector = injector;
			if (ServiceLocator.injector) {
				injectorListener.unsubscribe();
			}
		});
		ServiceLocator.observableInjector.next(_injector);
	}
}
