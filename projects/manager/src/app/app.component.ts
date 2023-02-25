import { Component, ViewChild } from '@angular/core';
import { ListItem } from './list-item';
import { ListOptions } from './list-options';
import { ListComponent } from './list/list.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('list') list!: ListComponent;

  public alitaList: Array<ListItem> = [
    { id: 'a', text: 'Alita' },
    { id: 'b', text: 'Battle' },
    { id: 'c', text: 'Angel' },
    { id: 'd', text: 'Make' },
    { id: 'e', text: 'America' },
    { id: 'f', text: 'Great' },
    { id: 'g', text: 'Again' }
  ];





  // #1
  // public listOptions: ListOptions = new ListOptions({
  //   indent: 22
  // });





  // #2
  // public listOptions: ListOptions = new ListOptions();

  // ngOnInit() {
  //   this.listOptions.indent = 22;
  // }




  // #3
  // ngAfterViewInit() {
  //   window.setTimeout(()=> {
  //     this.list.options.indent = 22;
  //   })
  // }






  trumpy() {
    // this.list.addItem();
    // this.list.addItem('x', 'Cat');
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


  onPressedEnterKey(selectedItem: ListItem) {
    console.log(selectedItem);
  }


  onDeletedItems(deletedItems: Array<ListItem>) {
    // console.log(deletedItems);
  }


  onRightClickedItem(rightClickedItem: ListItem) {
    // console.log(rightClickedItem);
  }
}