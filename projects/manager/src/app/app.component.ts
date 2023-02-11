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
    this.list.addItem('x','Cat');
  }


  onItemSelectedEvent(selectedItems: Array<ListItem>) {
    // console.log(selectedItems)
  }

  onItemEditedEvent(editedItem: ListItem) {
    // console.log(editedItem)
  }
}