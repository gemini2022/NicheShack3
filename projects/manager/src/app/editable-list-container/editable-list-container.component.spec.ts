import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditableListContainerComponent } from './editable-list-container.component';

describe('EditableListContainerComponent', () => {
  let component: EditableListContainerComponent;
  let fixture: ComponentFixture<EditableListContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditableListContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditableListContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
