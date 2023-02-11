import { Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { CaseType, ItemSelectType } from '../enums';
import { ListItem } from '../list-item';
import { ListOptions } from '../list-options';

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

  // Public
  public SelectType = ItemSelectType;
  public get editedItem(): ListItem { return this._editedItem; }
  public get selectedItem(): ListItem { return this._selectedItem; }
  public get unselectedItem(): ListItem { return this._unselectedItem; }

  // Decorators
  @Input() public list!: Array<ListItem>;
  @Input() public options: ListOptions = new ListOptions();
  @ViewChildren('div') private divs!: QueryList<ElementRef<HTMLElement>>;
  @Output() public itemEditedEvent: EventEmitter<ListItem> = new EventEmitter();
  @Output() public itemSelectedEvent: EventEmitter<Array<ListItem>> = new EventEmitter();


  private ngAfterViewInit(): void {
    this.list.forEach((x, i) => {
      x.div = this.divs.get(i)?.nativeElement;
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



  private removeEventListeners(): void {
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
          // this.getHtmlItem().innerText = clipboardData;
        }
      }
    }
  }



  private onKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'Enter') this.onEnter(e);
    if (e.key === 'Delete') this.onDelete();
    if (e.key === 'Escape') this.onEscape();
    if (e.key === 'ArrowUp') this.onArrowUp();
    if (e.key === 'ArrowDown') this.onArrowDown();

    if (this.options.multiselectable) {
      if (e.key === 'Shift') this.shiftKeyDown = true;
      if (e.key === 'Control') this.ctrlKeyDown = true;
    }
  }



  private onMouseDown = (): void => {
    // If an item is being edited or added
    if (this._editedItem) {

      // Evaluate the state of the edit and then act accordingly
      this.exitItemEdit(null!, true);

      // If an item is (NOT) being edited
    } else {

      // Remove all listeners and selections
      this.removeEventListeners();
    }
  }



  private onEnter(e: KeyboardEvent): void {
    e.preventDefault();

    // If an item is being edited
    if (this._editedItem) {
      // Evaluate the state of the edit and then act accordingly
      this.exitItemEdit();
    }
  }



  private onDelete(): void {

  }



  private onEscape(): void {
    // If an item is being edited
    if (this._editedItem) {

      // Evaluate the state of the edit and then act accordingly
      this.exitItemEdit(true);

      // If an item is NOT being edited
    } else {

      // Then remove all listeners and selections
      this.removeEventListeners();
    }
  }

  private onArrowDown(): void {

  }


  private onArrowUp(): void {

  }


  public onItemDown(item: ListItem, e?: MouseEvent): void {
    if (e) e!.stopPropagation()

    // As long as the item that just received this mouse down is (NOT) currently being edited
    if (this._editedItem != item) {
      
      // If another item is being edited, remove it from edit mode
      if (this._editedItem) this.exitItemEdit(null!, true);

      // If this item is being selected from a right mouse down
      if (e != null && e.button == 2) {


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

      } else {
        this.removeEventListeners();
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


    this.emitItemSelected();
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
      }

      // If the item we are pressing down on is NOT yet selected
    } else {

      // Select that item
      this._unselectedItem = null!;
      this._selectedItem.selected = true;
    }
    // Define the pivot item
    this.pivotItem = this._selectedItem;
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






  public addItem(id?: string, name?: string): void {
    this.addEventListeners();

    this.list.forEach(x => {
      x.selected = false;
      x.selectType = null!;
    })

    // If the list (IS) editable
    if (this.options.editable) {

      // Add the new item to the top of the list
      this.list.unshift({ id: '', name: '' });

      this.newItem = true;
      this._selectedItem = null!;
      this._unselectedItem = null!;
      this._editedItem = this.list[0];

      window.setTimeout(() => {
        this.list[0].div = this.divs.get(0)?.nativeElement;
        this._editedItem.div!.innerText = this._editedItem.div!.innerText?.trim()!;
        this.setItemFocus();
      });

      // If the list is (NOT) Editable
    } else {

      // Add the new item to the bottom of the list
      this.list.push({ id: id!, name: name! });

      const newItem = this.list[this.list.length - 1];

      newItem.selected = true;
      this._selectedItem = newItem;
      this._editedItem = null!;
      this._unselectedItem = null!;

      // As long as the list is set to be sortable
      if (this.options.sortable) {
        // Sort the list
        this.list.sort((a, b) => (a.name! > b.name!) ? 1 : -1);
      }

      const indexOfNewItem = this.list.indexOf(newItem);

      window.setTimeout(() => {
        this.list[indexOfNewItem].div = this.divs.get(indexOfNewItem)?.nativeElement;
        this._selectedItem.div!.innerText = this._selectedItem.div!.innerText?.trim()!;
      });

      this.emitItemSelected();
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
    this.setItemFocus();
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

  public getHtmlItem(): HTMLElement {
    return this._editedItem.div!;
  }


  private setItemFocus(): void {
    if (this.newItem) {
      this.getHtmlItem().focus();

    } else {

      const range = document.createRange();
      range.selectNodeContents(this.getHtmlItem());
      const sel = window.getSelection();
      sel!.removeAllRanges();
      sel!.addRange(range);
    }
  }



  private reselectItem(): void {
    this.newItem = false;
    if (this.options.selectable) {
      this._selectedItem = this._editedItem;
      this._selectedItem.selected = true;
      this.emitItemSelected();
    }
    this._editedItem = null!;
  }



  private getCase(): string {
    let text: string;

    switch (this._editedItem.case) {

      // Capitalized Case
      case CaseType.CapitalizedCase:
        // const capCase = new CapitalizedCase();
        // text = capCase.getCase(this.getHtmlItem().innerText.trim());
        text = this.getHtmlItem().innerText.trim(); // ****** Temporary ****** \\
        break;

      // Title Case
      case CaseType.TitleCase:
        // const titleCase = new TitleCase();
        // text = titleCase.getCase(this.getHtmlItem().innerText.trim());
        text = this.getHtmlItem().innerText.trim(); // ****** Temporary ****** \\
        break;

      // Lower Case
      case CaseType.LowerCase:
        text = this.getHtmlItem().innerText.trim().toLowerCase();
        break;

      // No Case
      default:
        text = this.getHtmlItem().innerText.trim();
        break;
    }
    return text;
  }



  public sort(): void {
    this.getHtmlItem().innerText = this.getEditedItem().name!.trim()!;
    this.list.sort((a, b) => (a.name! > b.name!) ? 1 : -1);
  }



  public exitItemEdit(isEscape?: boolean, isBlur?: boolean): void {
    const trimmedEditedItem = this.getHtmlItem().innerText.trim();

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
          this.getHtmlItem().innerText = this.getEditedItem().name!.trim()!;
          this.reselectItem();
        }

        // If we did NOT press the (Escape) key
        // But the (Enter) key was pressed or the item was (Blurred)
      } else {

        // As long as a list was (NOT) pasted into the item
        if (!this.getEditedItem().pastedItems) {

          // As long as the edited name is different from what it was before the edit
          if (trimmedEditedItem.toLowerCase() != this.getEditedItem().name!.trim().toLowerCase()) {
            this.completeItemEdit();

            // If the edited name has NOT changed
          } else {

            //But if the case was changed. i.e. lower case to upper case
            if (trimmedEditedItem != this.getEditedItem().name!.trim()) {
              this.getEditedItem().name = this.getCase();
              this.completeItemEdit();
            }
            this.reselectItem();
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
          this.getHtmlItem().innerText = this.getEditedItem().name!.trim()!;
          this.reselectItem();
        }
      }
    }
  }




  private completeItemEdit(): void {
    // Update the name property
    this.getEditedItem().name = this.getCase();


    // As long as the list is sortable
    if (this.options.sortable) {

      // Sort the list
      this.sort()!
    }

    this.emitItemEdited();
    this.reselectItem();
  }



  private emitItemSelected() {
    const selectedItems = this.list.filter(x => x.selected == true);
    this.itemSelectedEvent.emit(selectedItems);
  }


  private emitItemEdited() {
    this.itemEditedEvent.emit(this.editedItem);
  }
}