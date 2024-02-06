import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EditSchemaComponent} from '@modules/schema/pages/edit-schema/edit-schema.component';
import {SchemaComponent} from '@modules/schema/schema.component';

export const schemaRoutes: Routes = [
	{
		path: '',
		component: SchemaComponent
	}, {
		path: ':schemaId',
		component: EditSchemaComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(schemaRoutes)],
	exports: [RouterModule],
})
export class SchemaRoutingModule { }
