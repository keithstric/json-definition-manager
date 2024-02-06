import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSchemaComponent } from './edit-schema.component';

describe('EditSchemaComponent', () => {
  let component: EditSchemaComponent;
  let fixture: ComponentFixture<EditSchemaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditSchemaComponent]
    });
    fixture = TestBed.createComponent(EditSchemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
