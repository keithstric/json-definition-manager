import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridSchemaEditorComponent } from './grid-schema-editor.component';

describe('GridSchemaEditorComponent', () => {
  let component: GridSchemaEditorComponent;
  let fixture: ComponentFixture<GridSchemaEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GridSchemaEditorComponent]
    });
    fixture = TestBed.createComponent(GridSchemaEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
