import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MappingComponent} from '@modules/mapping/mapping.component';
import {EditMappingComponent} from '@modules/mapping/pages/edit-mapping/edit-mapping.component';

export const mappingRoutes: Routes = [
	{
		path: '',
		component: MappingComponent
	}, {
		path: ':mappingId',
		component: EditMappingComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(mappingRoutes)],
  exports: [RouterModule]
})
export class MappingRoutingModule { }
