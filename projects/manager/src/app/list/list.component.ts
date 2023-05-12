import { ListItem } from '../list-item';
import { PageLoad } from '../page-load';
import { ListOptions } from '../list-options';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {
  // Inputs
  @Input() public list!: Array<ListItem>;
  @Input() public options: ListOptions = new ListOptions();

  // Events
  @Output() public itemClickedEvent: EventEmitter<ListItem> = new EventEmitter();
  @Output() public mouseLeftItemEvent: EventEmitter<ListItem> = new EventEmitter();
  @Output() public pressedEnterKeyEvent: EventEmitter<ListItem> = new EventEmitter();
  @Output() public mouseEnteredItemEvent: EventEmitter<ListItem> = new EventEmitter();
  @Output() public requestedPageLoadEvent: EventEmitter<PageLoad> = new EventEmitter();
  @Output() public selectedItemsEvent: EventEmitter<Array<ListItem>> = new EventEmitter();
}