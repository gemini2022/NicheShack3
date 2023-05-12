import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ListOptions } from '../list-options';

@Component({
  selector: 'list-container',
  templateUrl: './list-container.component.html',
  styleUrls: ['./list-container.component.scss']
})
export class ListContainerComponent {
  // Private
  private mouseLeftItemIndex!: number;

  // Inputs
  @Input() public options!: ListOptions;

  // Outputs
  @Output() public itemClick: EventEmitter<number> = new EventEmitter();
  @Output() public itemMouseDown: EventEmitter<any> = new EventEmitter();
  @Output() public itemMouseEnter: EventEmitter<number> = new EventEmitter();
  @Output() public itemMouseLeave: EventEmitter<number> = new EventEmitter();
  @Output() public listContainerWheel: EventEmitter<any> = new EventEmitter();
  @Output() public listContainerScroll: EventEmitter<HTMLElement> = new EventEmitter();

  // View Child
  @ViewChild('listContainer') public listContainer!: ElementRef<HTMLElement>;




  protected ngAfterViewInit() {
    if (this.options.usingClick) this.listContainer.nativeElement.addEventListener('click', this.onListContainerClick);
    if (this.options.usingWheel) this.listContainer.nativeElement.addEventListener('wheel', this.onListContainerWheel);
    if (this.options.usingScroll) this.listContainer.nativeElement.addEventListener('scroll', this.onListContainerScroll);
    if (this.options.usingMouseDown) this.listContainer.nativeElement.addEventListener('mousedown', this.onListContainerMouseDown);
    if (this.options.usingMouseLeave) this.listContainer.nativeElement.addEventListener('mouseleave', this.onListContainerMouseLeave);
    if (this.options.usingMouseEnter || this.options.usingMouseLeave) this.listContainer.nativeElement.addEventListener('mousemove', this.onListContainerMouseMove);
  }



  protected getItemIndex(e: MouseEvent): number {
    const mousePosition = e.clientY + this.listContainer.nativeElement.scrollTop;
    const listContainerTop = this.listContainer.nativeElement.getBoundingClientRect().top;
    const itemPosition = (mousePosition - listContainerTop) / this.options.itemHeight!;
    const itemIndex = Math.floor(itemPosition);
    return itemIndex;
  }



  private onListContainerClick = (e: MouseEvent): void => {
    if (e.clientX - this.listContainer.nativeElement.getBoundingClientRect().left < this.listContainer.nativeElement.clientWidth) {
      this.itemClick.emit(this.getItemIndex(e));
    }
  }


  private onListContainerWheel = (e: WheelEvent): void => {
    this.listContainerWheel.emit({ wheelEvent: e, listContainer: this.listContainer.nativeElement });
  }


  private onListContainerScroll = (): void => {
    this.listContainerScroll.emit(this.listContainer.nativeElement);
  }





  protected onListContainerMouseDown = (e: MouseEvent): void => {
    if (e.clientX - this.listContainer.nativeElement.getBoundingClientRect().left < this.listContainer.nativeElement.clientWidth) {
      this.itemMouseDown.emit({ itemIndex: this.getItemIndex(e), mouseEvent: e });
    }
  }


  private onListContainerMouseLeave = (): void => {
    if (this.mouseLeftItemIndex != null) {
      this.itemMouseLeave.emit(this.mouseLeftItemIndex);
      this.mouseLeftItemIndex = null!;
    }
  }


  private onListContainerMouseMove = (e: MouseEvent): void => {
    const mouseEnteredItemIndex = this.getItemIndex(e);

    if (mouseEnteredItemIndex != this.mouseLeftItemIndex) {
      if (this.options.usingMouseLeave && this.mouseLeftItemIndex != null) this.itemMouseLeave.emit(this.mouseLeftItemIndex);
      if (this.options.usingMouseEnter) this.itemMouseEnter.emit(mouseEnteredItemIndex);
    }

    if (this.options.usingMouseLeave && e.clientX - this.listContainer.nativeElement.getBoundingClientRect().left >= this.listContainer.nativeElement.clientWidth) {
      this.onListContainerMouseLeave();
      return
    }
    this.mouseLeftItemIndex = mouseEnteredItemIndex;
  }
}