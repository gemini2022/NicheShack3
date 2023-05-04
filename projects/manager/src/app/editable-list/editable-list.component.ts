import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ListComponent } from '../list/list.component';
import { EditableListItem } from '../editable-list-item';
import { EditableListOptions } from '../editable-list-options';

@Component({
  selector: 'editable-list',
  templateUrl: './editable-list.component.html',
  styleUrls: ['./editable-list.component.scss']
})
export class EditableListComponent extends ListComponent{
  // Inputs
  @Input() public options: EditableListOptions = new EditableListOptions();

  // Events
  @Output() public unselectedListEvent: EventEmitter<void> = new EventEmitter();
  @Output() public pressedEscapeKeyEvent: EventEmitter<void> = new EventEmitter();
  @Output() public addedItemEvent: EventEmitter<EditableListItem> = new EventEmitter();
  @Output() public editedItemEvent: EventEmitter<EditableListItem> = new EventEmitter();
  @Output() public rightClickedItemEvent: EventEmitter<EditableListItem> = new EventEmitter();
  @Output() public pastedListEvent: EventEmitter<Array<EditableListItem>> = new EventEmitter();
  @Output() public deletedItemsEvent: EventEmitter<Array<EditableListItem>> = new EventEmitter();
  @Output() public requestedItemCaseTypeEvent: EventEmitter<EditableListItem> = new EventEmitter();
  @Output() public pressedDeleteKeyEvent: EventEmitter<Array<EditableListItem>> = new EventEmitter();
}