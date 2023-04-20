import { ListItem } from '../list-item';
import { PageLoad } from '../page-load';
import { ListOptions } from '../list-options';
import { Component, ContentChild, ElementRef, EventEmitter, Input, Output, QueryList, SimpleChanges, TemplateRef, ViewChildren } from '@angular/core';

@Component({
  selector: 'list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {
  // Private
  protected _selectedItem!: ListItem;
  protected eventListenersAdded!: boolean;
  protected loadedPages: Array<number> = [0];

  // Public
  public get selectedItem(): ListItem { return this._selectedItem; }

  // Inputs
  @Input() public list!: Array<ListItem>;
  @Input() public options: ListOptions = new ListOptions();

  // Events
  @Output() public pressedEnterKeyEvent: EventEmitter<ListItem> = new EventEmitter();
  @Output() public requestedPageLoadEvent: EventEmitter<PageLoad> = new EventEmitter();
  @Output() public selectedItemsEvent: EventEmitter<Array<ListItem>> = new EventEmitter();

  // View Children
  @ViewChildren('htmlItem') private htmlItems!: QueryList<ElementRef<HTMLElement>>;


  private ngOnChanges(changes: SimpleChanges): void {
    // If any of the default options have been changed
    if (changes.options) this.options = new ListOptions(changes.options.currentValue);
  }



  private ngOnInit(): void {
    if (this.options.loadListOnInit) this.LoadPage(1);
  }



  public LoadPage(pageNumber: number) {
    this.loadedPages[pageNumber] = pageNumber;
    this.requestedPageLoadEvent.emit(new PageLoad(pageNumber, this.options.itemsPerPage!));
  }




  public onItemSelect(item: ListItem, mouseEvent: MouseEvent): void {
    this._selectedItem = item;
    this.addEventListeners();
    this.selectedItemsEvent.emit([this._selectedItem]);
  }




  protected addEventListeners(): void {
    if (!this.eventListenersAdded) {
      this.eventListenersAdded = true;
      window.addEventListener('keydown', this.onKeyDown);
    }
  }


  




  private onKeyDown = (e: KeyboardEvent): void => {
    this.setKeyDown(e);
  }



  protected setKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      this.onEnter(e);
      return
    }
    if (e.key === 'ArrowUp') {
      this.onArrowUp(e);
      return
    }
    if (e.key === 'ArrowDown') {
      this.onArrowDown(e);
      return
    }
  }




  protected onEnter(e: KeyboardEvent): void {
    e.preventDefault();

    if (this._selectedItem) {
      this.pressedEnterKeyEvent.emit(this._selectedItem);
    }
  }





  protected onArrowDown(e: KeyboardEvent): void {
    e.preventDefault();

    // First, find where the selection currently resides
    let index: number = this.list.indexOf(this._selectedItem);
    // Then move its position down one
    index++;


    // If the selection goes beyond the bottom of the list
    if (index > this.list.length - 1) {

      // If loop selection is enabled
      if (this.options.loopSelection) {
        // Send it back up to the top
        index = 0;

        // If loop selection is (NOT) enabled
      } else {
        // Keep it at the bottom
        index = this.list.length - 1;
      }
    }
    this._selectedItem = this.list[index];

    // Set focus to the item so the scrollbar can follow it
    this.getHtmlItem(this.list[index])!.focus();
  }





  protected onArrowUp(e: KeyboardEvent): void {
    e.preventDefault();

    // First, find where the selection currently resides (if an item is selected)
    let index: number = this.list.indexOf(this._selectedItem);
    // Then move its position up one
    index--;


    // If the selection goes beyond the top of the list
    if (index < 0) {

      // If loop selection is enabled
      if (this.options.loopSelection) {
        // Send it back down to the bottom
        index = this.list.length - 1;

        // If loop selection is (NOT) enabled
      } else {
        // Keep it at the top
        index = 0;
      }
    }
    this._selectedItem = this.list[index];

    // Set focus to the item so the scrollbar can follow it
    this.getHtmlItem(this.list[index])!.focus();
  }






  public onMouseWheel(e: WheelEvent, listContainer: HTMLElement): void {
    if (this.options.scrollSnapping) {
      e.preventDefault();

      const delta = Math.max(-1, Math.min(1, (e.deltaY || -e.detail)));
      listContainer.scrollTop += (delta * (this.options.itemHeight! * 2));
    }
  }



  public onScroll(listContainer: HTMLElement): void {
    // Implement scroll snapping if enabled
    if (this.options.scrollSnapping) listContainer.scrollTop = Math.round(listContainer.scrollTop / (this.options.itemHeight! * 2)) * (this.options.itemHeight! * 2);
  }



  protected getHtmlItem(item: ListItem): HTMLElement {
    const index = this.list.indexOf(item);
    return this.htmlItems.get(index)?.nativeElement!;
  }





  protected removeEventListeners(): void {
    window.removeEventListener('keydown', this.onKeyDown);
  }


  protected ngOnDestroy() {
    this.removeEventListeners();
  }
}