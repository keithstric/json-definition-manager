import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LayoutModule} from '@layout/layout.module';
import {MappingRoutingModule} from '@modules/mapping/mapping-routing.module';
import {SharedModule} from '@shared/shared.module';
import { MappingComponent } from './mapping.component';

@NgModule({
  declarations: [
    MappingComponent
  ],
  imports: [
    CommonModule,
		LayoutModule,
		MappingRoutingModule,
		SharedModule,
  ]
})
export class MappingModule { }
