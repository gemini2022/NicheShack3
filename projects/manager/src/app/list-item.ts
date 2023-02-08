import { ElementRef } from "@angular/core";
import { ItemSelectType } from "./enums";

export class ListItem {
    id!: string;
    name!: string;
    selected?: boolean;
    editable?: boolean;
    disabled?: boolean;
    selectable?: boolean;
    items?: Array<string>;
    showSelection?: boolean;
    selectType?: ItemSelectType;
    div?: ElementRef<HTMLElement>;
}