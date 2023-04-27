import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CheckboxOptions } from '../checkbox-options';

@Component({
  selector: 'checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent {
  @Input() public label!: string;
  @Input() public isChecked!: boolean;
  @Input() public options: CheckboxOptions = new CheckboxOptions();
  @ViewChild('tabElement') public tabElement!: ElementRef<HTMLElement>;
  @Output() public checkboxChangedEvent: EventEmitter<boolean> = new EventEmitter();
}