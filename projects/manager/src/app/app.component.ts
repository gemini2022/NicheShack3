import { Component, ViewChild } from '@angular/core';
import { CaseType } from './enums';
import { ListItem } from './list-item';
import { ListComponent } from './list/list.component';
import { PageLoad } from './page-load';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('list') list!: ListComponent;
  public testList: Array<ListItem> = new Array<ListItem>();
  private listLength!: number;




  onRequestedPageLoad(pageLoad: PageLoad) {
    this.listLength = this.testList.length;
    // window.setTimeout(() => {
    for (let i = this.listLength; i < this.listLength + pageLoad.itemsPerPage; i++) {
      this.testList.push({ id: i.toString(), text: 'item' + (i + 1) })
    }

    // }, 1000)
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

    

    // window.setTimeout(()=> {
    //   console.log('hello')
    item.caseType = CaseType.TitleCase;
    // },4500)
  }


  onPastedItems(pastedItems: Array<ListItem>){
    console.log(pastedItems)
  }
}