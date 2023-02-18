import { Component, ViewChild } from '@angular/core';
import { ListItem } from './list-item';
import { ListComponent } from './list/list.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('list') list!: ListComponent;

  public alitaList: Array<ListItem> = [
    { id: 'a', name: 'Alita' },
    { id: 'b', name: 'Battle' },
    { id: 'c', name: 'Angel' },
    { id: 'd', name: 'Make' },
    { id: 'e', name: 'America' },
    { id: 'f', name: 'Great' },
    { id: 'g', name: 'Again' }
  ];


  trumpy() {
    // this.list.addItem();
    this.list.addItem('x', 'Cat');
  }


  onSelectedItems(selectedItems: Array<ListItem>) {
    // console.log(selectedItems);
  }

  onEditedItem(editedItem: ListItem) {
    // console.log(editedItem);
  }

  onPressedDeleteKey(itemsToBeDeleted: Array<ListItem>) {
    // console.log(itemsToBeDeleted);
    this.list.deleteItems();
  }


  onDeletedItems(deletedItems: Array<ListItem>) {
    // console.log(deletedItems);
  }


  onRightClickedItem(rightClickedItem: ListItem) {
    // console.log(rightClickedItem);
  }
}