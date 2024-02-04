import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {PageNotFoundComponent} from '@layout/components/page-not-found/page-not-found.component';

/**
 * This defines the application's routes. All base routes should be lazy loaded.
 * @type {Routes}
 */
export const appRoutes: Routes = [
	{path: '', loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule)},
	{path: 'schema', loadChildren: () => import('./modules/schema/schema.module').then(m => m.SchemaModule)},
	{path: 'mapping', loadChildren: () => import('./modules/mapping/mapping.module').then(m => m.MappingModule)},
	{path: '**', component: PageNotFoundComponent}
];

@NgModule({
	imports: [RouterModule.forRoot(appRoutes, {})],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
