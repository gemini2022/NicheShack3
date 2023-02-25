import { Color } from '../color';
import { ListItem } from '../list-item';
import { ListOptions } from '../list-options';
import { CaseType, ItemSelectType } from '../enums';
import { Component, ElementRef, EventEmitter, Input, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';

@Component({
  selector: 'list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {
  // Private
  private newItem!: boolean;
  private pivotItem!: ListItem;
  private ctrlKeyDown!: boolean;
  private shiftKeyDown!: boolean;
  private _editedItem!: ListItem;
  private _selectedItem!: ListItem;
  private _unselectedItem!: ListItem;
  private eventListenersAdded!: boolean;
  private stopMouseDownPropagation!: boolean;

  // Public
  public Color = Color;
  public SelectType = ItemSelectType;
  public get editedItem(): ListItem { return this._editedItem; }
  public get selectedItem(): ListItem { return this._selectedItem; }
  public get unselectedItem(): ListItem { return this._unselectedItem; }

  // Decorators
  @Input() public list!: Array<ListItem>;
  @Input() public options: ListOptions = new ListOptions();
  @ViewChild('listContainer') listContainer!: ElementRef<HTMLElement>;
  @ViewChildren('htmlItem') private htmlItems!: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('htmlItemText') private htmlItemTexts!: QueryList<ElementRef<HTMLElement>>;

  // Events
  @Output() public editedItemEvent: EventEmitter<ListItem> = new EventEmitter();
  @Output() public pressedEnterKeyEvent: EventEmitter<ListItem> = new EventEmitter();
  @Output() public rightClickedItemEvent: EventEmitter<ListItem> = new EventEmitter();
  @Output() public deletedItemsEvent: EventEmitter<Array<ListItem>> = new EventEmitter();
  @Output() public selectedItemsEvent: EventEmitter<Array<ListItem>> = new EventEmitter();
  @Output() public pressedDeleteKeyEvent: EventEmitter<Array<ListItem>> = new EventEmitter();




  
  private ngOnChanges(changes: SimpleChanges) {
    if (changes.options) this.options = new ListOptions(changes.options.currentValue);
  }



  private ngAfterViewInit(): void {
    this.list.forEach((x, i) => {
      x.htmlItem = this.htmlItems.get(i)?.nativeElement;
      x.htmlItemText = this.htmlItemTexts.get(i)?.nativeElement;
    })
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



  private reinitializeList(): void {
    if (this.options.unselectable) {
      this.pivotItem = null!;
      this._editedItem = null!;
      this.ctrlKeyDown = false;
      this._selectedItem = null!;
      this.shiftKeyDown = false;
      this._unselectedItem = null!;
      this.eventListenersAdded = false;
      this.list.forEach(x => {
        x.selected = false;
        x.selectType = null!;
      });
      window.removeEventListener('keyup', this.onKeyUp);
      window.removeEventListener('paste', this.onPaste);
      window.removeEventListener('keydown', this.onKeyDown);
      window.removeEventListener('mousedown', this.onMouseDown);
    }
  }



  private onKeyUp = (e: KeyboardEvent): void => {
    if (this.options.multiselectable) {
      if (e.key === 'Control') this.ctrlKeyDown = false;
      if (e.key === 'Shift') this.shiftKeyDown = false;
    }
  }



  private onPaste = (e: Event): void => {
    if (this.getEditedItem()) {
      e.preventDefault();

      // Record the clipboard data
      const clipboardData = (e as ClipboardEvent).clipboardData!.getData('text/plain').trim();

      // As long as there is clipboard data (and not an empty string)
      if (clipboardData) {
        // Convert the clipboard data into an array anywhere there is a newline detected (if any)
        const clipboardDataArray = clipboardData.split("\n");

        // Remove \r anywhere it is found (if any)
        clipboardDataArray.forEach((x, i, arry) => {
          arry[i] = x.replace('\r', '').toLowerCase();
        })

        // If the array has more than one element (that would mean a list was pasted in)
        if (clipboardDataArray.length > 1) {
          // Remove the duplicate items (if any)
          let uniqueClipboardDataArray = [...new Set(clipboardDataArray)];

          // And as long as the list was pasted into a new item (not an existing item that is being edited)
          if (this.newItem) {
            this.newItem = false;
            this.getEditedItem().pastedItems = uniqueClipboardDataArray;
            // this.multiItemAddUpdate(this.getEditedItem());
          }

          // But if the array has only one element (that would mean a list was (NOT) pasted in)
        } else {
          this.getHtmlItemText().innerText = clipboardData;
        }
      }
    }
  }



  private onKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'Enter') this.onEnter(e);
    if (e.key === 'Escape') this.onEscape();
    if (e.key === 'ArrowUp') this.onArrowUp(e);
    if (e.key === 'ArrowDown') this.onArrowDown(e);
    if (e.key === 'Delete') this.emitPressedDeleteKey();

    if (this.options.multiselectable) {
      if (e.key === 'Shift') this.shiftKeyDown = true;
      if (e.key === 'Control') this.ctrlKeyDown = true;
    }
  }



  private onMouseDown = (): void => {
    // As long as a mouse-down on an item did (NOT) just occur
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



  onListMouseDown(e: MouseEvent) {
    if (e.clientX > this.listContainer.nativeElement.clientWidth) {
      this.stopMouseDownPropagation = true;
    }
  }


  private onEnter(e: KeyboardEvent): void {
    e.preventDefault();

    // If an item is being edited
    if (this._editedItem) {
      // Evaluate the state of the edit and then act accordingly
      this.exitItemEdit();

      // If an item is (NOT) being edited
    } else {
      this.setItemSelection(this._selectedItem);
      this.pressedEnterKeyEvent.emit(this._selectedItem)
    }
  }




  private onEscape(): void {
    // If an item is being edited
    if (this._editedItem) {

      // Evaluate the state of the edit and then act accordingly
      this.exitItemEdit(true);

      // If an item is NOT being edited
    } else {

      // Then reinitialize the list
      this.reinitializeList();
    }
  }





  private onArrowDown(e: KeyboardEvent): void {
    e.preventDefault();

    // First, find where the selection currently resides (if an item is selected)
    let index: number = this._selectedItem ? this.list.indexOf(this._selectedItem) : this._unselectedItem ? this.list.indexOf(this._unselectedItem) : -1;
    // Then move its position down one
    index++;

    // If the selection goes beyond the bottom of the list, send it back up to the top
    if (index > this.list.length - 1) index = 0;

    // If the list is set to have the items get selected on arrow key navigation
    if (!this.options.noSelectOnArrowKey) {
      // Select the next item in the list
      this.setItemSelection(this.list[index]);

      // But if the list is set to (NOT) have the items get selected on arrow key navigation
    } else {

      // Don't select the next item in the list but instead surround it with the primary selection border
      this._unselectedItem = null!;
      this._selectedItem = this.list[index];
      this.setItemsSelectType();
    }

    // Set focus to the item so the scrollbar can follow it
    this.list[index].htmlItem?.focus();
  }





  private onArrowUp(e: KeyboardEvent): void {
    e.preventDefault();

    // First, find where the selection currently resides (if an item is selected)
    let index: number = this._selectedItem ? this.list.indexOf(this._selectedItem) : this._unselectedItem ? this.list.indexOf(this._unselectedItem) : this.list.length;
    // Then move its position up one
    index--;

    // If the selection goes beyond the top of the list, send it back down to the bottom
    if (index < 0) index = this.list.length - 1;

    // If the list is set to have the items get selected on arrow key navigation
    if (!this.options.noSelectOnArrowKey) {
      // Select the next item in the list
      this.setItemSelection(this.list[index]);

      // But if the list is set to (NOT) have the items get selected on arrow key navigation
    } else {

      // Don't select the next item in the list but instead surround it with the primary selection border
      this._unselectedItem = null!;
      this._selectedItem = this.list[index];
      this.setItemsSelectType();
    }

    // Set focus to the item so the scrollbar can follow it
    this.list[index].htmlItem?.focus();
  }




  public onItemDown(item: ListItem, e?: MouseEvent): void {
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
    // As long as the item is (NOT) being edited
    if (!this._editedItem) {
      this._selectedItem = item;
      this._unselectedItem = null!;

      // Add the event listeners (if not already)
      this.addEventListeners();
      // Define what items are selected
      this.setSelectedItems();

      this.emitItemsSelected();
    }
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
    this.setItemsSelectType();
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




  private setItemsSelectType(): void {
    // As long as there is more than one item in the list
    if (this.list.length != 1) {


      // If the first item in the list (IS) marked as selected
      // But does (NOT) have the primary selection
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
        // If the item in the list (IS) marked as selected
        // But does (NOT) have the primary selection
        if (this.list[i].selected && this.list[i] != this._selectedItem) {




          // Item before (NOT) selected and item after (IS) selected
          if (!this.list[i - 1].selected && this.list[i + 1].selected) {

            // Item before (IS) unselected
            if (this.list[i - 1] == this._unselectedItem) {
              this.list[i].selectType = ItemSelectType.Middle;

              // Item before (NOT) unselected
            } else {
              this.list[i].selectType = ItemSelectType.Top;
            }
          }




          // Item before (IS) selected and item after (NOT) selected
          if (this.list[i - 1].selected && !this.list[i + 1].selected) {

            // Item after (IS) unselected
            if (this.list[i + 1] == this._unselectedItem) {
              this.list[i].selectType = ItemSelectType.Middle;

              // Item after (NOT) unselected
            } else {
              this.list[i].selectType = ItemSelectType.Bottom;
            }
          }




          // Item before (NOT) selected and item after (NOT) selected
          if (!this.list[i - 1].selected && !this.list[i + 1].selected) {

            // Item before (IS) unselected
            if (this.list[i - 1] == this._unselectedItem) {
              this.list[i].selectType = ItemSelectType.Bottom;

              // Item after (IS) unselected
            } else if (this.list[i + 1] == this._unselectedItem) {
              this.list[i].selectType = ItemSelectType.Top;

              // Item before and item after (NOT) unselected
            } else {
              this.list[i].selectType = ItemSelectType.All;
            }
          }




          // Item before (IS) selected and item after (IS) selected
          if (this.list[i - 1].selected && this.list[i + 1].selected) {
            this.list[i].selectType = ItemSelectType.Middle;
          }
        }
      }





      // If the last item in the list (IS) marked as selected
      // But does (NOT) have the primary selection
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






  public addItem(id?: string, text?: string): void {
    this.addEventListeners();

    this.list.forEach(x => {
      x.selected = false;
      x.selectType = null!;
    })

    // If the list (IS) editable
    if (this.options.editable) {

      // Add the new item to the top of the list
      this.list.unshift({ id: '', text: '' });

      this.newItem = true;
      this._selectedItem = null!;
      this._unselectedItem = null!;
      this._editedItem = this.list[0];

      window.setTimeout(() => {
        this.list[0].htmlItem = this.htmlItems.get(0)?.nativeElement;
        this.list[0].htmlItemText = this.htmlItemTexts.get(0)?.nativeElement;
        this._editedItem.htmlItemText!.innerText = this._editedItem.htmlItemText!.innerText?.trim()!;
        this.giveFocusToHtmlItemText();
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
      this._unselectedItem = null!;

      // As long as the list is set to be sortable
      if (this.options.sortable) {
        // Sort the list
        this.list.sort((a, b) => (a.text! > b.text!) ? 1 : -1);
      }

      // Get the index of the new item
      const indexOfNewItem = this.list.indexOf(newItem);

      window.setTimeout(() => {
        this.list[indexOfNewItem].htmlItem = this.htmlItems.get(indexOfNewItem)?.nativeElement;
        this._selectedItem.htmlItem?.focus();
        this.list[indexOfNewItem].htmlItemText = this.htmlItemTexts.get(indexOfNewItem)?.nativeElement;
        this._selectedItem.htmlItemText!.innerText = this._selectedItem.htmlItemText!.innerText?.trim()!;
      });

      this.emitItemsSelected();
    }
  }








  private setItemEdit(): void {
    this._editedItem = this._selectedItem;
    this._selectedItem = null!;
    this.addEventListeners();

    this.list.forEach(x => {
      x.selected = false;
      x.selectType = null!;
    })
    this.giveFocusToHtmlItemText();
  }





  public deleteItems() {
    this.emitItemsDeleted();
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




  private reselectItem(item: ListItem): void {
    this.newItem = false;
    if (this.options.selectable) {
      this._selectedItem = item;
      this._selectedItem.selected = true;

      window.setTimeout(() => {
        this._selectedItem.htmlItem?.focus();
      });

      this.emitItemsSelected();
    }
    this._editedItem = null!;
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





  public onItemDoubleClick(): void {
    // As long as an item is (NOT) being edited and the [shift] key and the [CTRL] key is (NOT) being pressed
    if (!this._editedItem && !this.shiftKeyDown && !this.ctrlKeyDown) {
      // And as long as the item itself is editable
      if (this._selectedItem.editable == null || this._selectedItem.editable) {
        this.setItemEdit();
      }
    }
  }



  public getEditedItem(): ListItem {
    return this._editedItem;
  }

  public getHtmlItemText(): HTMLElement {
    return this._editedItem.htmlItemText!;
  }


  private giveFocusToHtmlItemText(): void {
    if (this.newItem) {
      this.getHtmlItemText().focus();

    } else {

      const range = document.createRange();
      range.selectNodeContents(this.getHtmlItemText());
      const sel = window.getSelection();
      sel!.removeAllRanges();
      sel!.addRange(range);
    }
  }







  private getCase(): string {
    let text: string;

    switch (this._editedItem.case) {

      // Capitalized Case
      case CaseType.CapitalizedCase:
        // const capCase = new CapitalizedCase();
        // text = capCase.getCase(this.getHtmlItem().innerText.trim());
        text = this.getHtmlItemText().innerText.trim(); // ****** Temporary ****** \\
        break;

      // Title Case
      case CaseType.TitleCase:
        // const titleCase = new TitleCase();
        // text = titleCase.getCase(this.getHtmlItem().innerText.trim());
        text = this.getHtmlItemText().innerText.trim(); // ****** Temporary ****** \\
        break;

      // Lower Case
      case CaseType.LowerCase:
        text = this.getHtmlItemText().innerText.trim().toLowerCase();
        break;

      // No Case
      default:
        text = this.getHtmlItemText().innerText.trim();
        break;
    }
    return text;
  }



  public sort(): void {
    this.getHtmlItemText().innerText = this.getEditedItem().text!.trim()!;
    this.list.sort((a, b) => (a.text! > b.text!) ? 1 : -1);
  }



  public exitItemEdit(isEscape?: boolean, isBlur?: boolean): void {
    const trimmedEditedItem = this.getHtmlItemText().innerText.trim();

    // If the edited item has text written in it
    if (trimmedEditedItem.length > 0) {

      // If we pressed the (Escape) key
      if (isEscape) {

        // If we ARE adding a new item 
        if (this.newItem) {

          // Remove the item
          this.list.splice(this.list.indexOf(this._editedItem), 1);
          this.newItem = false;
          this._editedItem = null!;
          this._selectedItem = null!;

          // If we were NOT adding a new item
        } else {

          // Reset the item back to the way it was before the edit
          this.getHtmlItemText().innerText = this.getEditedItem().text!.trim()!;
          this.reselectItem(this._editedItem);
        }

        // If we did NOT press the (Escape) key
        // But the (Enter) key was pressed or the item was (Blurred)
      } else {

        // As long as a list was (NOT) pasted into the item
        if (!this.getEditedItem().pastedItems) {

          // As long as the edited text is different from what it was before the edit
          if (trimmedEditedItem.toLowerCase() != this.getEditedItem().text!.trim().toLowerCase()) {
            this.completeItemEdit();

            // If the edited text has NOT changed
          } else {

            //But if the case was changed. i.e. lower case to upper case
            if (trimmedEditedItem != this.getEditedItem().text!.trim()) {
              this.getEditedItem().text = this.getCase();
              this.completeItemEdit();
            }
            this.reselectItem(this._editedItem);
          }
        }
      }

      // But if the item is empty
    } else {

      // If we pressed the (Escape) key or the item was (Blurred)
      if (isEscape || isBlur) {

        // If we were adding a new item
        if (this.newItem) {

          // Remove the item
          this.list.splice(this.list.indexOf(this._editedItem), 1);
          this.newItem = false;
          this._editedItem = null!;
          this._selectedItem = null!;
          // this.unSelectedItemsUpdate();

          // If we were NOT adding a new item
        } else {

          // Reset the item back to the way it was before the edit
          this.getHtmlItemText().innerText = this.getEditedItem().text!.trim()!;
          this.reselectItem(this._editedItem);
        }
      }
    }
  }




  private completeItemEdit(): void {
    // Update the text property
    this.getEditedItem().text = this.getCase();


    // As long as the list is sortable
    if (this.options.sortable) {

      // Sort the list
      this.sort()!
    }

    this.emitItemEdited();
    this.reselectItem(this._editedItem);
  }



  private emitItemsSelected() {
    const selectedItems = this.list.filter(x => x.selected == true);
    this.selectedItemsEvent.emit(selectedItems);
  }


  private emitItemEdited() {
    this.editedItemEvent.emit(this.editedItem);
  }



  private emitPressedDeleteKey() {
    if (!this.editedItem && this.options.deletable) {
      const itemsToBeDeleted = this.list.filter(x => x.selected == true);
      this.pressedDeleteKeyEvent.emit(itemsToBeDeleted);
    }
  }


  private emitItemsDeleted() {
    const deletedItems = this.list.filter(x => x.selected == true);
    this.deletedItemsEvent.emit(deletedItems);
  }
}