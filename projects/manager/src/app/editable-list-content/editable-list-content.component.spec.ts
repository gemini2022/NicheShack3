import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditableListContentComponent } from './editable-list-content.component';

describe('EditableListContentComponent', () => {
  let component: EditableListContentComponent;
  let fixture: ComponentFixture<EditableListContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditableListContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditableListContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
