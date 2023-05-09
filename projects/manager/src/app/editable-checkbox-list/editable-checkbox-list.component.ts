import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { EditableListComponent } from '../editable-list/editable-list.component';
import { EditableCheckboxListItem } from '../editable-checkbox-list-item';
import { EditableCheckboxListOptions } from '../editable-checkbox-list-options';

@Component({
  selector: 'editable-checkbox-list',
  templateUrl: './editable-checkbox-list.component.html',
  styleUrls: ['./editable-checkbox-list.component.scss']
})
export class EditableCheckboxListComponent extends EditableListComponent{
  // Inputs
  // @Input() public list!: Array<EditableCheckboxListItem>;
  @Input() public options: EditableCheckboxListOptions = new EditableCheckboxListOptions();

  // Events
  @Output() public itemCheckboxChangedEvent: EventEmitter<EditableCheckboxListItem> = new EventEmitter();

  
  protected ngOnChanges(changes: SimpleChanges): void {
    // If any of the default options have been changed
    if (changes.options) this.options = new EditableCheckboxListOptions(changes.options.currentValue);
  }
}