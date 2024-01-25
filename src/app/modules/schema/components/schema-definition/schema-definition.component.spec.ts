import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaDefinitionComponent } from './schema-definition.component';

describe('SchemaDefinitionComponent', () => {
  let component: SchemaDefinitionComponent;
  let fixture: ComponentFixture<SchemaDefinitionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SchemaDefinitionComponent]
    });
    fixture = TestBed.createComponent(SchemaDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
