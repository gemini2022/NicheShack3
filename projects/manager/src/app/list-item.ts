import { Color } from "./color";
import { CaseType, ItemSelectType } from "./enums";

export class ListItem {
    public id!: string;
    public text!: string;
    public cursor?: string;
    public textColor?: Color;
    public fontSize?: number;
    public selected?: boolean;
    public editable?: boolean;
    public hoverColor?: Color;
    public deletable?: boolean;
    public fontFamily?: string;
    public caseType?: CaseType;
    public selectable?: boolean;
    public unselectable?: boolean;
    public showSelection?: boolean;
    public selectionFillColor?: Color;
    public selectType?: ItemSelectType;
    public selectionBorderColor?: Color;
    public selectionBorderWidth?: number;
    public secondarySelectionFillColor?: Color;
    public secondarySelectionBorderColor?: Color;

    constructor(itemText: string) {
        this.text = itemText;
    }
}