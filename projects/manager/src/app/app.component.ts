import { Component } from '@angular/core';
import { ListItem } from './list-item';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public alitaList: Array<ListItem> = [
    { id: 'a', name: 'Alita' },
    { id: 'b', name: 'Battle' },
    { id: 'c', name: 'Angel' },
    { id: 'd', name: 'Make' },
    { id: 'e', name: 'America' },
    { id: 'f', name: 'Great' },
    { id: 'g', name: 'Again' }
  ];
}