import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {SharedModule} from '@shared/shared.module';
import {NgJsonEditorModule} from 'ang-jsoneditor';
import {HomeComponent} from './home.component';
import { HomeHeaderComponent } from './components/home-header/home-header.component';

/**
 * The HomeModule
 */
@NgModule({
	declarations: [
		HomeComponent,
  	HomeHeaderComponent
	],
	imports: [
		CommonModule,
		SharedModule,
		RouterModule.forChild([
			{
				path: '',
				component: HomeComponent
			}
		]),
		NgJsonEditorModule
	]
})
export class HomeModule { }
