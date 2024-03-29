import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LayoutModule} from '@layout/layout.module';
import {SchemaRoutingModule} from '@modules/schema/schema-routing.module';
import {SharedModule} from '@shared/shared.module';
import {AgGridModule} from 'ag-grid-angular';
import {NgJsonEditorModule} from 'ang-jsoneditor';
import { SchemaComponent } from 'src/app/modules/schema/schema.component';
import { EditSchemaComponent } from './pages/edit-schema/edit-schema.component';
import { SchemaDefinitionEditorComponent } from './components/schema-definition-editor/schema-definition-editor.component';



@NgModule({
  declarations: [
    EditSchemaComponent,
    SchemaComponent,
    SchemaDefinitionEditorComponent,
  ],
	imports: [
		AgGridModule,
		CommonModule,
		LayoutModule,
		NgJsonEditorModule,
		SchemaRoutingModule,
		SharedModule,
	]
})
export class SchemaModule { }
