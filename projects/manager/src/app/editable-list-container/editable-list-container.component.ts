import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ListContainerComponent } from '../list-container/list-container.component';
import { EditableListOptions } from '../editable-list-options';

@Component({
  selector: 'editable-list-container',
  templateUrl: './editable-list-container.component.html',
  styleUrls: ['../list-container/list-container.component.scss', './editable-list-container.component.scss']
})
export class EditableListContainerComponent extends ListContainerComponent {
  // Inputs
  @Input() public options!: EditableListOptions;

  // Outputs
  @Output() public itemDblClick: EventEmitter<number> = new EventEmitter();
  @Output() public listContainerMouseDown: EventEmitter<any> = new EventEmitter();
  

  protected ngAfterViewInit() {
    super.ngAfterViewInit()
    if (this.options.usingDblClick) this.listContainer.nativeElement.addEventListener('dblclick', this.onListContainerDblClick);
  }


  private onListContainerDblClick = (e: MouseEvent): void => {
    if (e.clientX - this.listContainer.nativeElement.getBoundingClientRect().left < this.listContainer.nativeElement.clientWidth) {
      this.itemDblClick.emit(this.getItemIndex(e));
    }
  }


  protected onListContainerMouseDown = (e: MouseEvent): void => {
    if (e.clientX - this.listContainer.nativeElement.getBoundingClientRect().left < this.listContainer.nativeElement.clientWidth) {
      this.itemMouseDown.emit({itemIndex: this.getItemIndex(e), mouseEvent: e});
    }
    this.listContainerMouseDown.emit({ wheelEvent: e, listContainer: this.listContainer.nativeElement });
  }
}