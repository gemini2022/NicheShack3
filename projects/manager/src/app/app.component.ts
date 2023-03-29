import { Component, ViewChild } from '@angular/core';
import { Color } from './color';
import { CaseType } from './enums';
import { ListItem } from './list-item';
import { ListComponent } from './list/list.component';
import { ManagerListOptions } from './manager-list-options';
import { PageLoad } from './page-load';
import { WebsiteListOptions } from './website-list-options';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('list') list!: ListComponent;
  
  private listLength!: number;

  public managerListOptions = new ManagerListOptions();
  public websiteListOptions = new WebsiteListOptions();
  public managerList: Array<ListItem> = new Array<ListItem>();
  public websiteList: Array<ListItem> = new Array<ListItem>();



  updateItem() {
    // this.managerList[4].cursor = 'crosshair';
    // this.managerList[4].editable = false;
    // this.managerList[4].fontSize = 20;
    // this.managerList[4].textColor = new Color(255, 0, 0, 1);
    // this.managerList[4].deletable = false;
    // this.managerList[4].selectable = false;
    // this.managerList[4].fontFamily = 'Segoe Print';
    // this.managerList[4].hoverColor = new Color(255, 0, 0, 1);
    // this.managerList[4].unselectable = false;
    // this.managerList[4].showSelection = false;
    // this.managerList[4].selectionFillColor = new Color(255, 0, 0, 1);
    // this.managerList[4].selectionBorderColor = new Color(255, 0, 0, 1);
    // this.managerList[4].selectionBorderWidth = 3;
    // this.managerList[4].secondarySelectionFillColor = new Color(255, 0, 0, 1);
    // this.managerList[4].secondarySelectionBorderColor = new Color(255, 0, 0, 1);
  }



  onRequestedPageLoad(pageLoad: PageLoad) {
    this.listLength = this.managerList.length;
    
    for (let i = this.listLength; i < this.listLength + pageLoad.itemsPerPage; i++) {
      this.managerList.push({ id: i.toString(), text: 'item' + (i + 1) });
      this.websiteList.push({ id: i.toString(), text: 'item' + (i + 1) });
    }
  }




  addItem() {
    this.list.addItem();
    // this.list.addItem('x', 'Cat');
  }


  editItem() {
    this.list.editItem();
  }


  deleteItem() {
    this.list.deleteItem();
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
    this.list.deleteItem();
  }


  onPressedEnterKey(selectedItem: ListItem) {
    // console.log(selectedItem);
  }


  onDeletedItems(deletedItems: Array<ListItem>) {
    // console.log(deletedItems);
  }


  onRightClickedItem(rightClickedItem: ListItem) {
    // console.log(rightClickedItem);
  }


  onRequestedItemCaseType(item: ListItem) {
    item.caseType = CaseType.TitleCase;
  }


  onUnselectedList() {
    // console.log('list unselected')
  }


  onPastedList(pastedList: Array<ListItem>) {
    // console.log(pastedList)
  }
}