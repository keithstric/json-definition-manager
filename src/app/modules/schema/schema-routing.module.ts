import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SchemaComponent} from '@modules/schema/schema.component';
import {SnackBarRef} from '@shared/components/snack-bar/snack-bar.ref';

export const schemaRoutes: Routes = [
	{
		path: '',
		component: SchemaComponent
	},{
		path: ':schemaId',
		component: SchemaComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(schemaRoutes)],
	exports: [RouterModule],
})
export class SchemaRoutingModule { }
