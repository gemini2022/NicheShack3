import { Color } from '../color';
import { ListItem } from '../list-item';
import { PageLoad } from '../page-load';
import { ListOptions } from '../list-options';
import { CaseType, ItemSelectType } from '../enums';
import { Component, ElementRef, EventEmitter, Input, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';

@Component({
  selector: 'list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {
  // Private
  private newScrollTop = 0;
  private isNewItem!: boolean;
  private pivotItem!: ListItem;
  private ctrlKeyDown!: boolean;
  private shiftKeyDown!: boolean;
  private _editedItem!: ListItem;
  private _selectedItem!: ListItem;
  private _unselectedItem!: ListItem;
  private eventListenersAdded!: boolean;
  private loadedPages: Array<number> = [0];
  private htmlItemTextSelection!: Selection;
  private stopMouseDownPropagation!: boolean;

  // Public
  public Color = Color;
  public SelectType = ItemSelectType;
  public get editedItem(): ListItem { return this._editedItem; }
  public get selectedItem(): ListItem { return this._selectedItem; }
  public get unselectedItem(): ListItem { return this._unselectedItem; }

  // Events
  @Output() public addedItemEvent: EventEmitter<ListItem> = new EventEmitter();
  @Output() public editedItemEvent: EventEmitter<ListItem> = new EventEmitter();
  @Output() public unselectedListEvent: EventEmitter<void> = new EventEmitter();
  @Output() public pressedEnterKeyEvent: EventEmitter<ListItem> = new EventEmitter();
  @Output() public rightClickedItemEvent: EventEmitter<ListItem> = new EventEmitter();
  @Output() public requestedPageLoadEvent: EventEmitter<PageLoad> = new EventEmitter();
  @Output() public pastedItemsEvent: EventEmitter<Array<ListItem>> = new EventEmitter();
  @Output() public deletedItemsEvent: EventEmitter<Array<ListItem>> = new EventEmitter();
  @Output() public selectedItemsEvent: EventEmitter<Array<ListItem>> = new EventEmitter();
  @Output() public requestedItemCaseTypeEvent: EventEmitter<ListItem> = new EventEmitter();
  @Output() public pressedDeleteKeyEvent: EventEmitter<Array<ListItem>> = new EventEmitter();

  // View Children
  @ViewChildren('htmlItem') private htmlItems!: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('htmlItemText') private htmlItemTexts!: QueryList<ElementRef<HTMLElement>>;

  // Inputs
  @Input() public list!: Array<ListItem>;
  @Input() public options: ListOptions = new ListOptions();



  
  private ngOnChanges(changes: SimpleChanges) {
    // If any of the default options have been changed
    if (changes.options) this.options = new ListOptions(changes.options.currentValue);
  }



  private ngOnInit() {
    if (this.options.loadListOnInit) this.LoadPage(1);
  }


  public LoadPage(pageNumber: number) {
    this.loadedPages[pageNumber] = pageNumber;
    this.requestedPageLoadEvent.emit(new PageLoad(pageNumber, this.options.itemsPerPage!));
  }




  public onItemSelect(item: ListItem, e?: MouseEvent): void {
    this.stopMouseDownPropagation = true;

    // As long as the item that just received this mouse down is (NOT) currently being edited
    if (this._editedItem != item) {

      // If another item is being edited, remove it from edit mode
      if (this._editedItem) this.exitItemEdit(null!, true);

      // If this item is being selected from a right mouse down
      if (e && e.button == 2) {
        this.rightClickedItemEvent.emit(item);
      }

      // As long as the list is selectable and the item itself is selectable
      if (this.options.selectable && (item.selectable == null || item.selectable)) {

        // As long as we're (NOT) right clicking on an item that's already selected
        if (!(e != null && e.button == 2 && item.selected)) {

          // And as long as the list allows the selection to be shown
          // and the item itself allows the selection to be shown
          if (this.options.showSelection && (item.showSelection == null || item.showSelection)) {
            // Set the selection for the item
            this.setItemSelection(item);
          }
        }

        // If the list is (NOT) selectable and the item itself is (NOT) selectable
      } else {

        // Then reinitialize the list
        this.reinitializeList();
      }
    }
  }





  private setItemSelection(item: ListItem): void {
    this._selectedItem = item;
    this._unselectedItem = null!;

    // Add the event listeners (if not already)
    this.addEventListeners();
    // Define what items are selected
    this.setSelectedItems();

    this.emitItemsSelected();
  }




  private emitItemsSelected() {
    const selectedItems = this.list.filter(x => x.selected == true);
    this.selectedItemsEvent.emit(selectedItems);
  }




  private setSelectedItems(): void {
    // If the [Shift] key is down
    if (this.shiftKeyDown) {
      this.setSelectedItemsShiftKey();

      // If the [CTRL] key is down 
    } else if (this.ctrlKeyDown) {
      this.setSelectedItemsCtrlKey();

      // If (NO) modifier key is down
    } else {
      this.setSelectedItemsNoModifierKey();
    }

    // Now define what the selection type is for each item
    this.setSecondarySelectionType();
  }




  private setSelectedItemsShiftKey(): void {
    // Clear the selection for all items
    this.list.forEach(x => {
      x.selected = false;
      x.selectType = null!;
    });

    const indexOfPivotItem = this.list.indexOf(this.pivotItem);
    const indexOfSelectedItem = this.list.indexOf(this._selectedItem);

    if (indexOfPivotItem == -1 || indexOfSelectedItem == -1) return;

    // If the selection is after the pivot
    if (indexOfSelectedItem > indexOfPivotItem) {

      // Select all the items from the pivot down to the selection
      for (let i = indexOfPivotItem; i <= indexOfSelectedItem; i++) {
        this.list[i].selected = true;
      }

      // If the selection is before the pivot 
    } else {

      // Select all the items from the pivot up to the selection
      for (let i = indexOfPivotItem; i >= indexOfSelectedItem; i--) {
        this.list[i].selected = true;
      }
    }
  }




  private setSelectedItemsCtrlKey(): void {
    // If the item we are pressing down on is already selected
    if (this._selectedItem.selected) {

      // Set that item as unselected
      if (this.options.unselectable) {
        this._selectedItem.selected = false;
        this._selectedItem.selectType = null!;
        this._unselectedItem = this._selectedItem;
        this._selectedItem = null!;
        this.pivotItem = this._unselectedItem;
      }

      // If the item we are pressing down on is NOT yet selected
    } else {

      // Select that item
      this._unselectedItem = null!;
      this._selectedItem.selected = true;
      this.pivotItem = this._selectedItem;
    }
  }



  private setSelectedItemsNoModifierKey(): void {
    // Clear the selection for all items
    this.list.forEach(x => {
      x.selected = false;
      x.selectType = null!;
    });
    // Set the selected
    this._selectedItem.selected = true;
    // Define the pivot item
    this.pivotItem = this._selectedItem;
  }







  private setSecondarySelectionType(): void {
    // As long as there is more than one item in the list
    if (this.list.length != 1) {


      // If the first item in the list (HAS) a secondary selection
      // And does (NOT) have the primary selection
      if (this.list[0].selected && this.list[0] != this._selectedItem) {


        // Item after (IS) selected or item after (IS) unselected
        if (this.list[1].selected || this.list[1] == this._unselectedItem) {
          this.list[0].selectType = ItemSelectType.Top;
        }


        // Item after (NOT) selected and item after (NOT) unselected
        if (!this.list[1].selected && this.list[1] != this._unselectedItem) {
          this.list[0].selectType = ItemSelectType.All;
        }
      }




      // Every item in between
      for (let i = 1; i < this.list.length - 1; i++) {


        // If the current item in the list (HAS) a secondary selection
        // And does (NOT) have the primary selection
        if (this.list[i].selected && this.list[i] != this._selectedItem) {




          // Item before (NOT) selected and item after (IS) selected
          if (!this.list[i - 1].selected && this.list[i + 1].selected) {

            // Item before (IS) unselected
            if (this.list[i - 1] == this._unselectedItem) {
              this.list[i].selectType = ItemSelectType.Middle;
              continue;

              // Item before (NOT) unselected
            } else {
              this.list[i].selectType = ItemSelectType.Top;
              continue;
            }
          }




          // Item before (IS) selected and item after (NOT) selected
          if (this.list[i - 1].selected && !this.list[i + 1].selected) {

            // Item after (IS) unselected
            if (this.list[i + 1] == this._unselectedItem) {
              this.list[i].selectType = ItemSelectType.Middle;
              continue;

              // Item after (NOT) unselected
            } else {
              this.list[i].selectType = ItemSelectType.Bottom;
              continue;
            }
          }




          // Item before (NOT) selected and item after (NOT) selected
          if (!this.list[i - 1].selected && !this.list[i + 1].selected) {

            // Item before (IS) unselected
            if (this.list[i - 1] == this._unselectedItem) {
              this.list[i].selectType = ItemSelectType.Bottom;
              continue;

              // Item after (IS) unselected
            } else if (this.list[i + 1] == this._unselectedItem) {
              this.list[i].selectType = ItemSelectType.Top;
              continue;

              // Item before and item after (NOT) unselected
            } else {
              this.list[i].selectType = ItemSelectType.All;
              continue;
            }
          }




          // Item before (IS) selected and item after (IS) selected
          if (this.list[i - 1].selected && this.list[i + 1].selected) {
            this.list[i].selectType = ItemSelectType.Middle;
          }
        }
      }





      // If the last item in the list (HAS) a secondary selection
      // And does (NOT) have the primary selection
      if (this.list[this.list.length - 1].selected && this.list[this.list.length - 1] != this._selectedItem) {


        // Item before (IS) selected or item before (IS) unselected
        if (this.list[this.list.length - 2].selected || this.list[this.list.length - 2] == this._unselectedItem) {
          this.list[this.list.length - 1].selectType = ItemSelectType.Bottom;
        }


        // Item before (NOT) selected and item before (NOT) unselected
        if (!this.list[this.list.length - 2].selected && this.list[this.list.length - 2] != this._unselectedItem) {
          this.list[this.list.length - 1].selectType = ItemSelectType.All;
        }
      }
    }
  }




  private addEventListeners(): void {
    if (!this.eventListenersAdded) {
      this.eventListenersAdded = true;
      window.addEventListener('keyup', this.onKeyUp);
      window.addEventListener('paste', this.onPaste);
      window.addEventListener('keydown', this.onKeyDown);
      window.addEventListener('mousedown', this.onMouseDown);
    }
  }


  private onMouseDown = (): void => {
    // As long as a mouse down on an item did (NOT) just occur
    if (!this.stopMouseDownPropagation) {

      // If an item is being edited or added
      if (this._editedItem) {

        // Evaluate the state of the edit and then act accordingly
        this.exitItemEdit(null!, true);

        // If an item is (NOT) being edited
      } else {

        // Then reinitialize the list
        this.reinitializeList();
      }

      // If a mouse-down on an item did just occur
    } else {
      this.stopMouseDownPropagation = false;
    }
  }




  public onListContainerMouseDown(e: MouseEvent, listContainer: HTMLElement) {
    if (e.clientX > listContainer.clientWidth) {
      this.stopMouseDownPropagation = true;
    }
  }




  private onKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'Enter') {
      this.onEnter(e);
      return
    }
    if (e.key === 'Escape') {
      this.onEscape();
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
    if (e.key === 'Delete') {
      this.emitPressedDeleteKey();
      return
    }

    if (this.options.multiselectable) {
      if (e.key === 'Shift') {
        this.shiftKeyDown = true;
        return
      }
      if (e.key === 'Control') {
        this.ctrlKeyDown = true;
        return
      }
    }
  }




  private onKeyUp = (e: KeyboardEvent): void => {
    if (this.options.multiselectable) {
      if (e.key === 'Control') {
        this.ctrlKeyDown = false;
        return
      }
      if (e.key === 'Shift') {
        this.shiftKeyDown = false;
        return
      }
    }
  }



  private onEnter(e: KeyboardEvent): void {
    e.preventDefault();

    if (this._editedItem) {
      this.exitItemEdit();

    } else {
      this.setItemSelection(this._selectedItem);
      this.pressedEnterKeyEvent.emit(this._selectedItem)
    }
  }





  private onEscape(): void {
    if (this._editedItem) {
      this.exitItemEdit(true);

    } else {
      this.reinitializeList();
    }
  }




  private onArrowDown(e: KeyboardEvent): void {
    // As long as an item is (NOT) being edited
    if (!this._editedItem) {
      e.preventDefault();

      // First, find where the selection currently resides (if an item is selected)
      let index: number = this._selectedItem ? this.list.indexOf(this._selectedItem) : this._unselectedItem ? this.list.indexOf(this._unselectedItem) : -1;
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


      // If the list is set to have the items get selected on arrow key navigation
      if (!this.options.noSelectOnArrowKey) {
        // Select the next item in the list
        this.setItemSelection(this.list[index]);

        // But if the list is set to (NOT) have the items get selected on arrow key navigation
      } else {

        // Don't select the next item in the list but instead surround it with the primary selection border
        this._unselectedItem = null!;
        this._selectedItem = this.list[index];
        this.setSecondarySelectionType();
      }

      // Set focus to the item so the scrollbar can follow it
      this.getHtmlItem(this.list[index])!.focus();
    }
  }





  private onArrowUp(e: KeyboardEvent): void {
    // As long as an item is (NOT) being edited
    if (!this._editedItem) {
      e.preventDefault();

      // First, find where the selection currently resides (if an item is selected)
      let index: number = this._selectedItem ? this.list.indexOf(this._selectedItem) : this._unselectedItem ? this.list.indexOf(this._unselectedItem) : this.list.length;
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


      // If the list is set to have the items get selected on arrow key navigation
      if (!this.options.noSelectOnArrowKey) {
        // Select the next item in the list
        this.setItemSelection(this.list[index]);

        // But if the list is set to (NOT) have the items get selected on arrow key navigation
      } else {

        // Don't select the next item in the list but instead surround it with the primary selection border
        this._unselectedItem = null!;
        this._selectedItem = this.list[index];
        this.setSecondarySelectionType();
      }

      // Set focus to the item so the scrollbar can follow it
      this.getHtmlItem(this.list[index])!.focus();
    }
  }




  public addItem(id?: string, text?: string): void {
    this.addEventListeners();

    this.list.forEach(x => {
      x.selected = false;
      x.selectType = null!;
    })
    this._unselectedItem = null!;

    // If the list (IS) editable
    if (this.options.editable) {

      // Add the new item to the top of the list
      this.list.unshift({ id: '', text: '' });

      this.isNewItem = true;
      this._selectedItem = null!;
      this._editedItem = this.list[0];

      // Wait a frame to allow the html item to be rendered
      window.setTimeout(() => {
        this.getHtmlItemText(this._editedItem).focus();
      });

      // If the list is (NOT) Editable
    } else {

      // Add the new item to the bottom of the list
      this.list.push({ id: id!, text: text! });
      // Define it as the new item
      const newItem = this.list[this.list.length - 1];

      newItem.selected = true;
      this._editedItem = null!;
      this._selectedItem = newItem;

      // As long as the list is set to be sortable
      if (this.options.sortable) {
        // Sort the list
        this.sort();
      }
      this.getHtmlItem(this._selectedItem)!.focus();
      this.getHtmlItemText(this._selectedItem).innerText = this.getHtmlItemText(this._selectedItem).innerText.trim();
      this.emitItemsSelected();
    }
  }



  public onItemDoubleClick(): void {
    // As long as an item is (NOT) being edited and the [shift] key and the [CTRL] key is (NOT) being pressed
    if (!this._editedItem && !this.shiftKeyDown && !this.ctrlKeyDown) {
      // And as long as the item itself is editable
      if (this._selectedItem.editable == null || this._selectedItem.editable) {
        this.editItem();
      }
    }
  }



  public editItem(): void {
    if (this._selectedItem) {
      this._editedItem = this._selectedItem;
      this._selectedItem = null!;
      this.addEventListeners();

      this.list.forEach(x => {
        x.selected = false;
        x.selectType = null!;
      })
      this.getHtmlItemText(this._editedItem).innerText = this.getHtmlItemText(this._editedItem).innerText.trim();
      const range = document.createRange();
      range.selectNodeContents(this.getHtmlItemText(this._editedItem));
      const sel = window.getSelection();
      sel!.removeAllRanges();
      sel!.addRange(range);
    }
  }




  private exitItemEdit(isEscape?: boolean, isBlur?: boolean): void {
    // If the edited item has text written in it
    if (this.getHtmlItemText(this._editedItem).innerText.trim().length > 0) {

      // If we pressed the [ESCAPE] key
      if (isEscape) {
        // Cancel the edit
        this.cancelItemEdit();

        // If we did (NOT) press the [ESCAPE] key
        // But the [ENTER] key was pressed or the item was {BLURRED}
      } else {

        // If the edited item does (NOT) have a case type assigned and there are obsservers accepting requests for case type assignments
        if (!this._editedItem.caseType && this.requestedItemCaseTypeEvent.observers.length > 0) {
          // Send it off to get its case type assigned
          this.requestedItemCaseTypeEvent.emit(this._editedItem);

          // Wait a frame to allow the item to get its case type assigned
          window.setTimeout(() => {
            this.completeItemEdit();
          })

        } else {
          this.completeItemEdit();
        }
      }

      // But if the item is empty
    } else {

      // If we pressed the [ESCAPE] key or the item was {BLURRED}
      if (isEscape || isBlur) {
        // Cancel the edit
        this.cancelItemEdit();
      }
    }
  }




  private cancelItemEdit() {
    // If we're adding a new item 
    if (this.isNewItem) {

      // Remove the item
      this.list.splice(this.list.indexOf(this._editedItem), 1);
      this.reinitializeList();

      // If we were (NOT) adding a new item
    } else {

      // Reset the item back to the way it was before the edit
      this.getHtmlItemText(this._editedItem).innerText = this._editedItem.text!.trim()!;
      this.reselectItem(this._editedItem);
    }
  }



  private reselectItem(item: ListItem): void {
    this.isNewItem = false;
    if (this.options.selectable && (item.selectable == null || item.selectable)) {
      this._selectedItem = item;
      this._selectedItem.selected = true;
      this.getHtmlItem(this._selectedItem)!.focus();
      this.emitItemsSelected();
    }
    this._editedItem = null!;
  }





  private completeItemEdit() {
    const oldText = this._editedItem.text;
    this._editedItem.text = this.getCaseType(this._editedItem);
    this.getHtmlItemText(this._editedItem).innerText = this.getHtmlItemText(this._editedItem).innerText.trim();

    // As long as the edited text is different from what it was before the edit
    if (this._editedItem.text!.trim() != oldText) {
      if (this.options.sortable) this.sort();
      if (this.isNewItem) {
        this.addedItemEvent.emit(this._editedItem);
      } {
        this.editedItemEvent.emit(this._editedItem);
      }
      this.reselectItem(this._editedItem);


      // If the text is (NOT) different from what it was before the edit
    } else {
      // Just reselect the item
      this.reselectItem(this._editedItem);
    }
  }




  private completePastedItems() {
    const pastedItems = this.list.filter(x => !x.id);
    pastedItems.forEach(x => x.text = this.getCaseType(x));
    if (this.options.sortable) this.sort();
    this._editedItem = null!;
    this.pastedItemsEvent.emit(pastedItems);
  }



  private getCaseType(item: ListItem): string {
    let text: string;

    switch (item.caseType) {

      // Capitalized Case
      case CaseType.CapitalizedCase:
        // const capCase = new CapitalizedCase();
        // text = capCase.getCase(this.getHtmlItemText(item).innerText.trim());
        text = this.getHtmlItemText(item).innerText.trim(); // ****** Temporary ****** \\
        break;

      // Title Case
      case CaseType.TitleCase:
        // const titleCase = new TitleCase();
        // text = titleCase.getCase(this.getHtmlItemText(item).innerText.trim());
        text = this.getHtmlItemText(item).innerText.trim(); // ****** Temporary ****** \\
        break;

      // Lower Case
      case CaseType.LowerCase:
        text = this.getHtmlItemText(item).innerText.trim().toLowerCase();
        break;

      // No Case
      default:
        text = this.getHtmlItemText(item).innerText.trim();
        break;
    }
    return text;
  }



  public deleteItem() {
    const deletedItems = this.list.filter(x => x.selected == true);
    this.deletedItemsEvent.emit(deletedItems);
    const nextSelectedItem = this.getNextSelectedItemAfterDelete();
    this.list = this.list.filter(x => !x.selected);

    if (nextSelectedItem) {
      this.reselectItem(nextSelectedItem);

    } else {

      if (!this._unselectedItem) {
        this.pivotItem = null!;
        this._selectedItem = null!;
        this.reinitializeList();
      }
    }
  }



  private getNextSelectedItemAfterDelete(): ListItem {
    let nextSelectedItem!: ListItem;

    if (this._selectedItem) {
      const selectedItemIndex = this.list.indexOf(this._selectedItem);

      // Loop through the list of items starting with the item that follows the selected item
      for (let i = selectedItemIndex + 1; i < this.list.length; i++) {
        // If we come across an item that is (NOT) selected
        if (!this.list[i].selected) {
          // Make a copy of that item so that it can be used as the newly selected item when all the other items are deleted
          nextSelectedItem = this.list[i];
          break;
        }
      }
    }
    return nextSelectedItem;
  }



  private emitPressedDeleteKey() {
    if (!this._editedItem && this.options.deletable) {
      const itemsToBeDeleted = this.list.filter(x => x.selected == true);
      this.pressedDeleteKeyEvent.emit(itemsToBeDeleted);
    }
  }



  public onScroll(listContainer: HTMLElement) {
    const scrollPosition = listContainer.scrollTop + listContainer.clientHeight;
    const scrollDirection = Math.max(-1, Math.min(1, (listContainer.scrollTop - this.newScrollTop)));

    // Iterate through all the pages
    for (let i = 1; i < this.loadedPages.length; i++) {
      // Find the page the scroll is currently on
      if (scrollPosition >= this.pageStart(i) && scrollPosition < this.pageEnd(i)) {
        // If the page that's (after or before) the page we're on does (NOT) exist
        if (i + scrollDirection > 0 && !this.loadedPages[i + scrollDirection]) {
          // Then load it
          // this.LoadPage(i + scrollDirection);
        }
        break;
      }
    }
    // Record the new position of the scroll top (Used for determining the direction the scrollbar is moving)
    this.newScrollTop = listContainer.scrollTop;
  }


  private pageStart(i: number): number {
    return (this.options.itemsPerPage! * this.options.itemHeight!) * (i - 1);
  }


  private pageEnd(i: number): number {
    return (this.options.itemsPerPage! * this.options.itemHeight!) * i;
  }







  private onPaste = (e: Event): void => {
    if (this._editedItem) {
      e.preventDefault();

      // Record the clipboard data
      const clipboardData = (e as ClipboardEvent).clipboardData!.getData('text/plain').trim();

      // As long as there is clipboard data (and not an empty string)
      if (clipboardData) {

        // If text was pasted into a (NEW) item
        if (this.isNewItem) {

          // Convert the clipboard data into an array anywhere there is a newline detected (if any)
          const clipboardDataList = clipboardData.split("\n");

          // If the array has more than one element (that would mean a list was pasted in)
          if (clipboardDataList.length > 1) {
            this.pasteClipboardDataList(clipboardDataList);

            // But if the array has only one element (that would mean a list was (NOT) pasted in)
          } else {
            this.pasteClipboardData(clipboardData);
          }
          // If text was pasted into an edited item
        } else {
          this.pasteClipboardData(clipboardData);
        }
      }
    }
  }



  private pasteClipboardDataList(clipboardDataList: Array<string>) {
    const index = this.list.indexOf(this._editedItem);
    this._editedItem = null!;

    // Wait a frame to allow the new item to exit edit mode
    window.setTimeout(() => {
      this.isNewItem = false;

      // Remove \r anywhere it is found (if any)
      clipboardDataList.forEach((x, i, arry) => {
        arry[i] = x.replace('\r', '');
      })

      // Remove the duplicate items (if any)
      let uniqueClipboardDataList = [...new Set(clipboardDataList)];

      // Add the first pasted item to the list (this is using the new item that was just created)
      this.list[index].text = uniqueClipboardDataList[0];

      // Then add the rest of the pasted items to the list
      for (let i = index + 1; i < uniqueClipboardDataList.length; i++) {
        this.list.splice(i, 0, new ListItem(uniqueClipboardDataList[i]));
      }
      if (this.options.sortable) this.sort();

      // Wait a frame to allow all the pasted items to be rendered into the html
      window.setTimeout(() => {

        // If any obsservers are accepting requests for case type assignment
        if (this.requestedItemCaseTypeEvent.observers.length > 0) {
          // Once every pasted item has been renered into the html
          for (let i = index; i < uniqueClipboardDataList.length; i++) {
            // Send them off to get their case type assigned
            this.requestedItemCaseTypeEvent.emit(this.list[i]);
          }

          // Wait a frame to allow all the pasted items to get their case type assigned
          window.setTimeout(() => {
            const pastedItems = this.list.filter(x => !x.id);
            pastedItems.forEach(x => x.text = this.getCaseType(x));
            this.pastedItemsEvent.emit(pastedItems);
          })
        }
      });
    })
  }



  private pasteClipboardData(clipboardData: string) {
    const sel = window.getSelection();
    const range = document.createRange();
    const textBeforeCaret = this.getHtmlItemText(this._editedItem).innerText.substring(0, this.htmlItemTextSelection.anchorOffset);
    const textAfterCaret = this.getHtmlItemText(this._editedItem).innerText.substring(this.htmlItemTextSelection.focusOffset);

    // Insert the clipboard data into the text
    this.getHtmlItemText(this._editedItem).innerText = textBeforeCaret + clipboardData + textAfterCaret;

    // Reposition the caret to reside after the clipboard data
    range.setStart(this.getHtmlItemText(this._editedItem).childNodes[0], (textBeforeCaret + clipboardData).length)
    sel!.removeAllRanges();
    sel!.addRange(range);
  }



  private getHtmlItem(item: ListItem) {
    const index = this.list.indexOf(item);
    return this.htmlItems.get(index)?.nativeElement;
  }



  private getHtmlItemText(item: ListItem): HTMLElement {
    const index = this.list.indexOf(item);
    return this.htmlItemTexts.get(index)?.nativeElement!;
  }


  public getHtmlItemTextSelection() {
    if (this._editedItem) {
      window.setTimeout(() => {
        this.htmlItemTextSelection = window.getSelection()!;
      })
    }
  }


  private sort(): void {
    this.list.sort((a, b) => (a.text! > b.text!) ? 1 : -1);
  }








  private reinitializeList(): void {
    this.isNewItem = false;
    this._editedItem = null!;

    if (this.options.unselectable) {
      this.pivotItem = null!;
      this.ctrlKeyDown = false;
      this._selectedItem = null!;
      this.shiftKeyDown = false;
      this._unselectedItem = null!;
      this.eventListenersAdded = false;

      this.list.forEach(x => {
        x.selected = false;
        x.selectType = null!;
      });

      this.unselectedListEvent.emit();
      window.removeEventListener('keyup', this.onKeyUp);
      window.removeEventListener('paste', this.onPaste);
      window.removeEventListener('keydown', this.onKeyDown);
      window.removeEventListener('mousedown', this.onMouseDown);
    }
  }
}