import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaEditorComponent } from './schema-editor.component';

describe('SchemaEditorComponent', () => {
  let component: SchemaEditorComponent;
  let fixture: ComponentFixture<SchemaEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SchemaEditorComponent]
    });
    fixture = TestBed.createComponent(SchemaEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
