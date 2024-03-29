import { Component, ElementRef, EventEmitter, Input, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { ListContentComponent } from '../list-content/list-content.component';
import { EditableListItem } from '../editable-list-item';
import { EditableListOptions } from '../editable-list-options';
import { ItemSelectType, CaseType } from '../enums';

@Component({
  selector: 'editable-list-content',
  templateUrl: './editable-list-content.component.html',
  styleUrls: ['../list-content/list-content.component.scss', './editable-list-content.component.scss']
})
export class EditableListContentComponent extends ListContentComponent{
  // Private
  protected _selectedItem!: EditableListItem;
  private isNewItem!: boolean;
  private pivotItem!: EditableListItem;
  private ctrlKeyDown!: boolean;
  private shiftKeyDown!: boolean;
  private _editedItem!: EditableListItem;
  private _unselectedItem!: EditableListItem;
  private textCaretPosition!: Selection;
  private _itemSelectType = ItemSelectType;
  private lastScrollTopPosition: number = 0;
  private stopMouseDownPropagation!: boolean;

  // Inputs
  @Input() public list!: Array<EditableListItem>;
  @Input() public options: EditableListOptions = new EditableListOptions();

  // Public
  public stopItemSelectionPropagation!: boolean;
  public get selectedItem(): EditableListItem { return this._selectedItem; }
  public get ItemSelectType(): typeof ItemSelectType { return this._itemSelectType; }
  public get editedItem(): EditableListItem { return this._editedItem; }
  public get unselectedItem(): EditableListItem { return this._unselectedItem; }

  // Events
  @Output() public addedItemEvent: EventEmitter<EditableListItem> = new EventEmitter();
  @Output() public editedItemEvent: EventEmitter<EditableListItem> = new EventEmitter();
  @Output() public unselectedListEvent: EventEmitter<void> = new EventEmitter();
  @Output() public pressedEscapeKeyEvent: EventEmitter<void> = new EventEmitter();
  @Output() public rightClickedItemEvent: EventEmitter<EditableListItem> = new EventEmitter();
  @Output() public pastedListEvent: EventEmitter<Array<EditableListItem>> = new EventEmitter();
  @Output() public deletedItemsEvent: EventEmitter<Array<EditableListItem>> = new EventEmitter();
  @Output() public requestedItemCaseTypeEvent: EventEmitter<EditableListItem> = new EventEmitter();
  @Output() public pressedDeleteKeyEvent: EventEmitter<Array<EditableListItem>> = new EventEmitter();

  // View Children
  @ViewChildren('htmlItemText') private htmlItemTexts!: QueryList<ElementRef<HTMLElement>>;



  protected ngOnChanges(changes: SimpleChanges): void {
    // If any of the default options have been changed
    if (changes.options) this.options = new EditableListOptions(changes.options.currentValue);
  }


  public onItemSelect(item: EditableListItem, mouseEvent?: MouseEvent): void {
    if (this.stopItemSelectionPropagation) {
      this.stopItemSelectionPropagation = false;
      this.stopMouseDownPropagation = true;
      
    } else {
      const rightButton = 2;
      this.stopMouseDownPropagation = true;

      // As long as the item that just received this mouse down is (NOT) currently being edited
      if (this._editedItem != item) {

        // If another item is being edited, remove it from edit mode
        if (this._editedItem) this.exitItemEdit(undefined, true);


        // As long as the list (IS) selectable and the item itself (IS) selectable
        if ((this.options.selectable && item.selectable != false) ||
          // Or if the list is (NOT) selectable but the item itself (IS) selectable
          (!this.options.selectable && item.selectable)) {


          // If this item is being selected from a right mouse down
          if (mouseEvent && mouseEvent.button == rightButton) {
            this.rightClickedItemEvent.emit(item);
          }

          // And as long as we're (NOT) right clicking on an item that's already selected
          if (!(mouseEvent && mouseEvent.button == rightButton && item.selected)) {

            // Set the selection for the item
            this.setItemSelection(item);
          }

          // If the list is (NOT) selectable and the item itself is (NOT) selectable
        } else {

          // Then reinitialize the list
          this.reinitializeList();
        }
      }
    }



  }





  protected setItemSelection(item: EditableListItem): void {
    this._selectedItem = item;
    this._unselectedItem = null!;

    // Add the event listeners (if not already)
    this.addEventListeners();
    // Define what items are selected
    this.setSelectedItems();
  }




  protected setSelectedItems(): void {
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

    // Now define what the secondary selection type is for each item (if any)
    this.setSecondarySelectionType();
  }




  private setSelectedItemsShiftKey(): void {
    const selectedItems: Array<EditableListItem> = new Array<EditableListItem>();

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
        if (this.list[i].selectable != false) selectedItems.push(this.list[i]);

        if (this.list[i].selectable != false && ((this.options.showSelection && this.list[i].showSelection != false) ||
          (!this.options.showSelection && this.list[i].showSelection))) {
          this.list[i].selected = true;
        }
      }

      // If the selection is before the pivot 
    } else {

      // Select all the items from the pivot up to the selection
      for (let i = indexOfPivotItem; i >= indexOfSelectedItem; i--) {
        if (this.list[i].selectable != false) selectedItems.push(this.list[i]);

        if (this.list[i].selectable != false && ((this.options.showSelection && this.list[i].showSelection != false) ||
          (!this.options.showSelection && this.list[i].showSelection))) {
          this.list[i].selected = true;
        }
      }
    }
    this.selectedItemsEvent.emit(selectedItems);
  }




  private setSelectedItemsCtrlKey(): void {
    // If the item we are pressing down on is already selected
    if (this._selectedItem.selected) {

      // As long as the list (IS) unselectable and the item itself (IS) unselectable
      if ((this.options.unselectable && this._selectedItem.unselectable != false) ||
        // Or if the list is (NOT) unselectable but the item itself (IS) unselectable
        (!this.options.unselectable && this._selectedItem.unselectable)) {

        // Set that item as unselected
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

      // As long as the list (IS) allowed to show the selection and the item itself (IS) allowed to show its selection
      if ((this.options.showSelection && this._selectedItem.showSelection != false) ||
        // Or if the list is (NOT) allowed to show the selection but the item itself (IS) allowed to show its selection
        (!this.options.showSelection && this._selectedItem.showSelection)) {
        this._selectedItem.selected = true;
      }

      this.pivotItem = this._selectedItem;
      this.selectedItemsEvent.emit([this._selectedItem]);
    }
  }



  protected setSelectedItemsNoModifierKey(): void {
    // Clear the selection for all items
    this.list.forEach(x => {
      x.selected = false;
      x.selectType = null!;
    });
    // Set the selected
    this._selectedItem.selected = true;
    // Define the pivot item
    this.pivotItem = this._selectedItem;
    this.selectedItemsEvent.emit([this._selectedItem]);
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

          // Item after (NOT) selected and item after (NOT) unselected
        } else if (!this.list[1].selected && this.list[1] != this._unselectedItem) {
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

          // Item before (NOT) selected and item before (NOT) unselected
        } else if (!this.list[this.list.length - 2].selected && this.list[this.list.length - 2] != this._unselectedItem) {
          this.list[this.list.length - 1].selectType = ItemSelectType.All;
        }
      }
    }
  }




  protected addEventListeners(): void {
    if (!this.eventListenersAdded) {
      super.addEventListeners();
      window.addEventListener('keyup', this.onKeyUp);
      window.addEventListener('paste', this.onPaste);
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

      // If a mouse-down on an item (DID) just occur
    } else {
      this.stopMouseDownPropagation = false;
    }
  }



  public onListContainerMouseDown(e: MouseEvent, listContainer: HTMLElement): void {
    if (e.clientX - listContainer.getBoundingClientRect().left >= listContainer.clientWidth) {
      this.stopMouseDownPropagation = true;
    }
  }



  protected setKeyDown(e: KeyboardEvent) {
    super.setKeyDown(e);

    if (e.key === 'Escape') {
      this.onEscape();
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
      this.selectedItemsEvent.emit([this._selectedItem]);
    }
  }



  public onItemDoubleClick(): void {
    // As long as an item is (NOT) already being edited
    if (!this._editedItem &&
      // And as long as the list (IS) editable and the item itself (IS) editable
      ((this.options.editable && (this._selectedItem && this._selectedItem.editable != false)) ||
        // Or if the list is (NOT) editable but the item itself (IS) editable
        (!this.options.editable && (this._selectedItem && this._selectedItem.editable)))) {

      this.editItem();
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




  private cancelItemEdit(): void {
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



  private reselectItem(item: EditableListItem): void {
    this.isNewItem = false;

    // As long as the list (IS) selectable and the item itself (IS) selectable
    if ((this.options.selectable && item.selectable != false) ||
      // Or if the list is (NOT) selectable but the item itself (IS) selectable
      (!this.options.selectable && item.selectable)) {
      this._selectedItem = item;
      this._selectedItem.selected = true;
      this.getHtmlItem(this._selectedItem)!.focus();
      this.selectedItemsEvent.emit([this._selectedItem]);
    }
    this._editedItem = null!;
  }





  private completeItemEdit(): void {
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




  private getCaseType(item: EditableListItem): string {
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



  private getDeletedItems(): Array<EditableListItem> {
    let itemsToBeDeleted: EditableListItem[] = [];
    const selectedItems = this.list.filter(x => x.selected);

    selectedItems.forEach(x => {
      // If the list (IS) deletable and the item itself (IS) deletable
      if ((this.options.deletable && x.deletable != false) ||
        // Or if the list is (NOT) deletable but the item itself (IS) deletable
        (!this.options.deletable && x.deletable)) {
        itemsToBeDeleted.push(x);
      }
    })
    return itemsToBeDeleted;
  }



  private emitPressedDeleteKey(): void {
    // As long as an item is (NOT) being edited
    if (!this._editedItem) {
      const itemsToBeDeleted = this.getDeletedItems();

      // As long as there is items to be deleted
      if (itemsToBeDeleted.length > 0) {
        this.pressedDeleteKeyEvent.emit(itemsToBeDeleted);
      }
    }
  }




  public deleteItem(deletedItems?: Array<EditableListItem>): void {
    // As long as an item is (NOT) being edited
    if (!this._editedItem) {
      const itemsToBeDeleted = deletedItems ? deletedItems : this.getDeletedItems();

      if (itemsToBeDeleted.length > 0) {
        this.deletedItemsEvent.emit(itemsToBeDeleted);
        const nextSelectedItem = this.getNextSelectedItemAfterDelete();

        // Filter the list of the items that are (NOT) being deleted
        this.list = this.list.filter(x => {
          let keepInList: boolean = true;

          // If an item is a deleted item then do (NOT) keep it in the list
          for (let i = 0; i < itemsToBeDeleted.length; i++) {
            if (x == itemsToBeDeleted[i]) {
              keepInList = false;
              break;
            }
          }
          return keepInList;
        });

        if (nextSelectedItem) {

          // If the list is set to have the items get selected on arrow key navigation
          if (!this.options.noSelectOnArrowKey) {
            // Select the next item in the list
            this.setItemSelection(nextSelectedItem);

            // But if the list is set to (NOT) have the items get selected on arrow key navigation
          } else {
            this._unselectedItem = null!;
            this._selectedItem = nextSelectedItem;
            this.setSecondarySelectionType();
            this.getHtmlItem(this._selectedItem)!.focus();
          }

        } else {

          if (!this._unselectedItem) {
            this.pivotItem = null!;
            this._selectedItem = null!;
            this.reinitializeList();
          }
        }
      }
    }
  }



  private getNextSelectedItemAfterDelete(): EditableListItem {
    let nextSelectedItem!: EditableListItem;

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









  protected onEnter(e: KeyboardEvent): void {
    e.preventDefault();

    if (this._editedItem) {
      this.exitItemEdit();

    } else {
      if (this._selectedItem) {
        this.setItemSelection(this._selectedItem);
        this.pressedEnterKeyEvent.emit(this._selectedItem);
      }
    }
  }





  private onEscape(): void {
    if (this._editedItem) {
      this.exitItemEdit(true);

    } else {
      this.reinitializeList();
    }
    this.pressedEscapeKeyEvent.emit();
  }




  protected onArrowDown(e: KeyboardEvent): void {
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





  protected onArrowUp(e: KeyboardEvent): void {
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






  public onScroll(listContainer: HTMLElement): void {
    const scrollPosition = listContainer.scrollTop + listContainer.clientHeight;
    const scrollDirection = Math.max(-1, Math.min(1, (listContainer.scrollTop - this.lastScrollTopPosition)));

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
    // Record the position of the scroll top (Used for determining the direction the scrollbar is moving)
    this.lastScrollTopPosition = listContainer.scrollTop;

    // Implement scroll snapping if enabled
    if (this.options.scrollSnapping) listContainer.scrollTop = Math.round(listContainer.scrollTop / (this.options.itemHeight! * 2)) * (this.options.itemHeight! * 2);
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



  private pasteClipboardDataList(clipboardDataList: Array<string>): void {
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
        this.list.splice(i, 0, new EditableListItem(uniqueClipboardDataList[i]));
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
            this.pastedListEvent.emit(pastedItems);
          })
        }
      });
    })
  }



  private pasteClipboardData(clipboardData: string): void {
    const sel = window.getSelection();
    const range = document.createRange();
    const textBeforeCaret = this.getHtmlItemText(this._editedItem).innerText.substring(0, this.textCaretPosition.anchorOffset);
    const textAfterCaret = this.getHtmlItemText(this._editedItem).innerText.substring(this.textCaretPosition.focusOffset);

    // Insert the clipboard data into the text
    this.getHtmlItemText(this._editedItem).innerText = textBeforeCaret + clipboardData + textAfterCaret;

    // Reposition the caret to reside after the clipboard data
    range.setStart(this.getHtmlItemText(this._editedItem).childNodes[0], (textBeforeCaret + clipboardData).length)
    sel!.removeAllRanges();
    sel!.addRange(range);
  }



  private getHtmlItemText(item: EditableListItem): HTMLElement {
    const index = this.list.indexOf(item);
    return this.htmlItemTexts.get(index)?.nativeElement!;
  }


  public getTextCaretPosition(): void {
    if (this._editedItem) {
      window.setTimeout(() => {
        this.textCaretPosition = window.getSelection()!;
      })
    }
  }


  private sort(): void {
    this.list.sort((a, b) => (a.text! > b.text!) ? 1 : -1);
  }








  protected reinitializeList(): void {
    this.isNewItem = false;
    this._editedItem = null!;

    // If the list is unselectable
    if (this.options.unselectable) {
      let itemsNotToBeUnselected!: boolean;
      this.ctrlKeyDown = false;
      this.shiftKeyDown = false;
      this._unselectedItem = null!;
      this.eventListenersAdded = false;
      // If an item is marked as the pivot item and as long as it is unselectable, remove it from being the pivot item
      if (this.pivotItem && this.pivotItem.unselectable != false) this.pivotItem = null!;
      // If an item is marked as the selected item and as long as it is unselectable, remove it from being the selected item
      if (this._selectedItem && this._selectedItem.unselectable != false) this._selectedItem = null!;

      // Loop through each item of the list
      this.list.forEach(x => {
        // If the item can be unselected
        if (x.unselectable != false) {
          x.selected = false;
          x.selectType = null!;

          // But if the item can (NOT) be unselected and it's currently selected
        } else {
          if (x.selected) itemsNotToBeUnselected = true;
        }
      });

      // As long as (NO) item is selected that can't be unselected
      if (!itemsNotToBeUnselected) {
        // Remove all the listeners
        this.removeEventListeners();

        // But if there is an item that is selected that can't be unselected
      } else {
        this.setSecondarySelectionType();
      }

      // If the list is (NOT) unselectable
    } else {
      let itemsToBeUnselected!: boolean;

      // Loop through each item of the list
      this.list.forEach(x => {
        // If there is an item that is selected that is unselectable
        if (x.selected && x.unselectable) {
          // Unselect it
          x.selected = false;
          x.selectType = null!;
          itemsToBeUnselected = true;
          if (x == this.pivotItem) this.pivotItem = null!;
          if (x == this._selectedItem) this._selectedItem = null!;
        }
      });

      if (itemsToBeUnselected) {
        this.setSecondarySelectionType();
      }

      // Check to see if any itmes are selected
      const selectedItems = this.list.filter(x => x.selected);

      // If the list ends up having no items selected
      if (selectedItems.length == 0) {
        // Remove all the listeners
        this.removeEventListeners();
      }
    }
  }



  protected removeEventListeners(): void {
    super.removeEventListeners();
    this.unselectedListEvent.emit();
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('paste', this.onPaste);
    window.removeEventListener('mousedown', this.onMouseDown);
  }
}