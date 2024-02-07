import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaDefinitionEditorComponent } from './schema-definition-editor.component';

describe('SchemaDefinitionEditorComponent', () => {
  let component: SchemaDefinitionEditorComponent;
  let fixture: ComponentFixture<SchemaDefinitionEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SchemaDefinitionEditorComponent]
    });
    fixture = TestBed.createComponent(SchemaDefinitionEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
