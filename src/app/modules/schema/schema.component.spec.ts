import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaComponent } from 'src/app/modules/schema/schema.component';

describe('SchemaComponent', () => {
  let component: SchemaComponent;
  let fixture: ComponentFixture<SchemaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SchemaComponent]
    });
    fixture = TestBed.createComponent(SchemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
