import { Component, ElementRef, Input, QueryList, ViewChildren } from '@angular/core';
import { ItemSelectType } from '../enums';
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
  private eventListenersAdded!: boolean;
  private duplicateCheckingInProgress!: boolean;

  // Public
  public editedItem!: ListItem;
  public selectedItem!: ListItem;
  public unselectedItem!: ListItem;
  public SelectType = ItemSelectType;

  // Decorators
  @Input() list!: Array<ListItem>;
  @Input() options: ListOptions = new ListOptions();
  @ViewChildren('div') divs!: QueryList<ElementRef<HTMLElement>>;


  ngAfterViewInit() {

    

    this.list.forEach((x, i)=> {
      console.log(this.divs.get(i));
    })
  }


  addEventListeners() {
    if (!this.eventListenersAdded) {
      this.eventListenersAdded = true;
      window.addEventListener('keyup', this.onKeyUp);
      window.addEventListener('paste', this.onPaste);
      window.addEventListener('keydown', this.onKeyDown);
      window.addEventListener('mousedown', this.onMouseDown);
    }
  }



  removeEventListeners() {
    if (this.options.unselectable) {
      this.pivotItem = null!;
      this.editedItem = null!;
      this.ctrlKeyDown = false;
      this.selectedItem = null!;
      this.shiftKeyDown = false;
      this.unselectedItem = null!;
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



  onKeyUp = (e: KeyboardEvent) => {
    if (this.options.multiselectable) {
      if (e.key === 'Control') this.ctrlKeyDown = false;
      if (e.key === 'Shift') this.shiftKeyDown = false;
    }
  }



  onPaste = (e: Event) => {
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

          // And as long as the list was pasted into a new list item (not an existing list item that is being edited)
          if (this.newItem) {
            this.newItem = false;
            this.getEditedItem().items = uniqueClipboardDataArray;
            // this.multiItemAddUpdate(this.getEditedItem());
          }

          // But if the array has only one element (that would mean a list was (NOT) pasted in)
        } else {
          // this.getHtmlItem().innerText = clipboardData;
        }
      }
    }
  }



  onKeyDown = (e: KeyboardEvent) => {
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



  onMouseDown = () => {
    // If an item is being edited or added
    if (this.editedItem) {

      // Evaluate the state of the edit and then act accordingly
      this.evaluateEdit(null!, true);

      // If an item is (NOT) being edited
    } else {

      // Remove all listeners and selections
      this.removeEventListeners();
    }
  }



  onEnter(e: KeyboardEvent) {

  }



  onDelete() {

  }



  onEscape() {

  }



  onArrowUp() {

  }


  onArrowDown() {

  }




  onItemDown(item: ListItem, e?: MouseEvent) {
    if (e) e!.stopPropagation()

    // As long as the item that just received this mouse down is (NOT) currently being edited
    if (this.editedItem != item) {

      // If another item is being edited, remove it from edit mode
      if (this.editedItem) this.evaluateEdit(null!, true);

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




  setItemSelection(item: ListItem) {
    // As long as the item is (NOT) being edited
    if (!this.editedItem) {
      this.selectedItem = item;
      this.unselectedItem = null!;

      // Add the event listeners (if not already)
      this.addEventListeners();
      // Define what items are selected
      this.setSelectedItems();
      // Then define what the selection type is for each item
      this.setItemsSelectType();
    }
  }




  setSelectedItems() {
    // If the shift key is down
    if (this.shiftKeyDown) {
      this.setSelectedItemsShiftKey();

      // If the ctrl key is down 
    } else if (this.ctrlKeyDown) {
      this.setSelectedItemsCtrlKey();

      // If NO modifier key is down
    } else {
      this.setSelectedItemsNoModifierKey();
    }
  }





  setItemsSelectType() {
    // As long as there is more than one item in the list
    if (this.list.length != 1) {


      // If the first item in the list (IS) marked as selected
      // But does (NOT) have the primary selection
      if (this.list[0].selected && this.list[0] != this.selectedItem) {


        // Item after (IS) selected or item after (IS) unselected
        if (this.list[1].selected || this.list[1] == this.unselectedItem) {
          this.list[0].selectType = ItemSelectType.Top;
        }


        // Item after (NOT) selected and item after (NOT) unselected
        if (!this.list[1].selected && this.list[1] != this.unselectedItem) {
          this.list[0].selectType = ItemSelectType.All;
        }
      }




      // Every item in between
      for (let i = 1; i < this.list.length - 1; i++) {
        // If the item in the list (IS) marked as selected
        // But does (NOT) have the primary selection
        if (this.list[i].selected && this.list[i] != this.selectedItem) {




          // Item before (NOT) selected and item after (IS) selected
          if (!this.list[i - 1].selected && this.list[i + 1].selected) {

            // Item before (IS) unselected
            if (this.list[i - 1] == this.unselectedItem) {
              this.list[i].selectType = ItemSelectType.Middle;

              // Item before (NOT) unselected
            } else {
              this.list[i].selectType = ItemSelectType.Top;
            }
          }




          // Item before (IS) selected and item after (NOT) selected
          if (this.list[i - 1].selected && !this.list[i + 1].selected) {

            // Item after (IS) unselected
            if (this.list[i + 1] == this.unselectedItem) {
              this.list[i].selectType = ItemSelectType.Middle;

              // Item after (NOT) unselected
            } else {
              this.list[i].selectType = ItemSelectType.Bottom;
            }
          }




          // Item before (NOT) selected and item after (NOT) selected
          if (!this.list[i - 1].selected && !this.list[i + 1].selected) {

            // Item before (IS) unselected
            if (this.list[i - 1] == this.unselectedItem) {
              this.list[i].selectType = ItemSelectType.Bottom;

              // Item after (IS) unselected
            } else if (this.list[i + 1] == this.unselectedItem) {
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
      if (this.list[this.list.length - 1].selected && this.list[this.list.length - 1] != this.selectedItem) {


        // Item before (IS) selected or item before (IS) unselected
        if (this.list[this.list.length - 2].selected || this.list[this.list.length - 2] == this.unselectedItem) {
          this.list[this.list.length - 1].selectType = ItemSelectType.Bottom;
        }


        // Item before (NOT) selected and item before (NOT) unselected
        if (!this.list[this.list.length - 2].selected && this.list[this.list.length - 2] != this.unselectedItem) {
          this.list[this.list.length - 1].selectType = ItemSelectType.All;
        }
      }
    }
  }



  setSelectedItemsShiftKey() {
    // Clear the selection for all items
    this.list.forEach(x => x.selected = false);
    const indexOfPivotItem = this.list.indexOf(this.pivotItem);
    const indexOfSelectedItem = this.list.indexOf(this.selectedItem);

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




  setSelectedItemsCtrlKey() {
    // If the item we are pressing down on is already selected
    if (this.selectedItem.selected) {

      // Set that item as unselected
      if (this.options.unselectable) {
        this.selectedItem.selected = false;
        this.selectedItem.selectType = null!;
        this.unselectedItem = this.selectedItem;
        this.selectedItem = null!;
      }

      // If the item we are pressing down on is NOT yet selected
    } else {

      // Select that item
      this.unselectedItem = null!;
      this.selectedItem.selected = true;
    }
    // Define the pivot item
    this.pivotItem = this.selectedItem;
  }



  setSelectedItemsNoModifierKey() {
    // Clear the selection for all items
    this.list.forEach(x => {
      x.selected = false;
      x.selectType = null!;
    });
    // Set the selected
    this.selectedItem.selected = true;
    // Define the pivot item
    this.pivotItem = this.selectedItem;
  }



  setEdit() {
    this.editedItem = this.selectedItem;
    this.selectedItem = null!;
    this.addEventListeners();

    // this.getHtmlItem().innerText = this.getHtmlItem().innerText.trim()!;



    this.list.forEach(x => {
      x.selected = false;
      x.selectType = null!;
    })
    // this.setItemFocus();
  }



  onItemDoubleClick() {
    // As long as an item is (NOT) being edited and the [shift] key and the [CTRL] key is (NOT) being pressed
    if (!this.editedItem && !this.shiftKeyDown && !this.ctrlKeyDown) {
      // And as long as the item itself is editable
      if (this.selectedItem.editable == null || this.selectedItem.editable) {
        this.setEdit();
      }
    }
  }




  evaluateEdit(isEscape?: boolean, isBlur?: boolean) {

  }


  getEditedItem() {
    return this.editedItem;
  }

  getHtmlItem() {
    // return this.editedItem.htmlItem!.nativeElement;
  }
}