import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Color } from './color';
import { CaseType } from './enums';
import { ListItem } from './list-item';
import { ListComponent } from './list/list.component';
import { ManagerListOptions } from './manager-list-options';
import { PageLoad } from './page-load';
import { WebsiteListOptions } from './website-list-options';
import { EditableListComponent } from './editable-list/editable-list.component';
import { EditableCheckboxListItem } from './editable-checkbox-list-item';
import { EditableCheckboxListComponent } from './editable-checkbox-list/editable-checkbox-list.component';
import { EditableListItem } from './editable-list-item';
import { IconFontListItem } from './icon-font-list-item';
import { IconFontListOptions } from './icon-font-list-options';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('list') list!: ListComponent;
  @ViewChild('editableList') editableList!: EditableListComponent;
  @ViewChild('editableCheckboxList') editableCheckboxListVar!: EditableCheckboxListComponent;

  private listLength!: number;

  public Color = Color;

  public managerListOptions = new ManagerListOptions();
  public websiteListOptions = new WebsiteListOptions();
  public managerList: Array<EditableListItem> = new Array<EditableListItem>();
  public websiteList: Array<ListItem> = new Array<ListItem>();

  public editableCheckboxList: Array<EditableCheckboxListItem> = new Array<EditableCheckboxListItem>();

  public iconFontList: Array<IconFontListItem> = [
    { iconFont: 'fa-solid fa-user', text: 'Your Account' },
    { iconFont: 'fa-solid fa-cart-shopping', text: 'Your Orders' },
    { iconFont: 'fa-solid fa-file-lines', text: 'Your List' },
    { iconFont: 'fa-solid fa-address-card', text: 'Your Profile' },
    { iconFont: 'fa-solid fa-envelope', text: 'Email Preferences' },
    { iconFont: 'fa-solid fa-right-from-bracket', text: 'Log Out' },
  ];


  public iconFontListOptions = new IconFontListOptions({ itemHeight: 30, cursor: 'pointer' });

  // // ===============================================================
  // // This code will be in the lazy-laod script

  // public tabElements: Array<HTMLElement> = new Array<HTMLElement>();
  // @ViewChildren('tabElement') HTMLElements!: QueryList<any>;

  // ngAfterViewInit() {
  //   this.HTMLElements.forEach(x => {
  //     if (x.tabElement) {
  //       this.tabElements.push(x.tabElement)
  //     } else {
  //       this.tabElements.push(x);
  //     }
  //   })
  //   console.log(this.tabElements)
  // }
  // // ===============================================================


  updateItem() {
    // this.editableCheckboxList[4].checkboxBorderColor = new Color(0, 0, 255, 1);
    // this.managerList[4].cursor = 'crosshair';
    // this.managerList[4].editable = true;
    // this.managerList[4].fontSize = 20;
    // this.managerList[4].textColor = new Color(255, 0, 0, 1);
    // this.managerList[4].deletable = true;
    // this.managerList[4].selectable = true;
    // this.managerList[4].fontFamily = 'Segoe Print';
    // this.managerList[4].hoverColor = new Color(255, 0, 0, 1);
    // this.managerList[4].unselectable = true;
    // this.managerList[4].showSelection = false;
    // this.managerList[4].selectionFillColor = new Color(255, 0, 0, 1);
    // this.managerList[4].selectionBorderColor = new Color(255, 0, 0, 1);
    // this.managerList[4].selectionBorderWidth = 3;
    // this.managerList[4].secondarySelectionFillColor = new Color(255, 0, 0, 1);
    // this.managerList[4].secondarySelectionBorderColor = new Color(255, 0, 0, 1);

    this.iconFontList[4].iconFontColor = new Color(255, 0, 0, 1);
  }



  onRequestedPageLoad(pageLoad: PageLoad) {
    this.listLength = this.managerList.length;

    for (let i = this.listLength; i < this.listLength + pageLoad.itemsPerPage; i++) {
      this.managerList.push({ id: i.toString(), text: 'item' + (i + 1) });
      this.websiteList.push({ id: i.toString(), text: 'item' + (i + 1) });
    }
  }




  addItem() {
    // this.list.addItem();
    // this.editableList.addItem('x', 'Cat');
  }


  editItem() {
    // this.editableList.editItem();
  }


  deleteItem() {
    // this.editableList.deleteItem();
  }


  onSelectedItems(selectedItems: Array<ListItem>) {
    // console.log(selectedItems);
  }


  onAddedItem(addedItem: ListItem) {
    // console.log(addedItem);
  }

  onEditedItem(editedItem: ListItem) {
    // console.log(editedItem);
  }

  onPressedDeleteKey(itemsToBeDeleted: Array<ListItem>) {
    // console.log(itemsToBeDeleted);
    // this.editableList.deleteItem(itemsToBeDeleted);
  }


  onPressedEnterKey(selectedItem: EditableListItem) {
    console.log(selectedItem);
  }


  onDeletedItems(deletedItems: Array<ListItem>) {
    // console.log(deletedItems);
  }


  onRightClickedItem(rightClickedItem: ListItem) {
    // console.log(rightClickedItem);
  }


  onRequestedItemCaseType(item: ListItem) {
    // item.caseType = CaseType.TitleCase;
  }


  onUnselectedList() {
    // console.log('list unselected')
  }


  onPastedList(pastedList: Array<ListItem>) {
    // console.log(pastedList)
  }



  onCheckboxChanged(isChecked: boolean) {
    console.log(isChecked)
  }








  onEditableCheckboxListRequestedPageLoad(pageLoad: PageLoad) {
    for (let i = 0; i < pageLoad.itemsPerPage; i++) {
      this.editableCheckboxList.push({ id: i.toString(), text: 'editableCheckboxItem' + (i + 1) });
    }
  }


  onItemCheckboxChanged(item: EditableCheckboxListItem) {
    console.log(item)
  }
}