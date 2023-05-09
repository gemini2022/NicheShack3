import { Component, Input, SimpleChanges } from '@angular/core';
import { ListItem } from '../list-item';
import { ListComponent } from '../list/list.component';
import { IconFontListOptions } from '../icon-font-list-options';
import { IconFontListItem } from '../icon-font-list-item';

@Component({
  selector: 'icon-font-list',
  templateUrl: './icon-font-list.component.html',
  styleUrls: ['./icon-font-list.component.scss']
})
export class IconFontListComponent extends ListComponent {
  public hoverItem!: ListItem;

  // Inputs
  // @Input() public list!: Array<IconFontListItem>;
  @Input() public options: IconFontListOptions = new IconFontListOptions();

  protected ngOnChanges(changes: SimpleChanges): void {
    // If any of the default options have been changed
    if (changes.options) this.options = new IconFontListOptions(changes.options.currentValue);
  }
}