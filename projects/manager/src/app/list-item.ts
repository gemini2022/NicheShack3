import { Color } from "./color";
import { CaseType, ItemSelectType } from "./enums";

export class ListItem {
    public id!: string;
    public text!: string;
    public cursor?: string;
    public fontSize?: number;
    public fillColor?: Color;
    public selected?: boolean;
    public editable?: boolean;
    public disabled?: boolean;
    public hoverColor?: Color;
    public textColor?: string;
    public borderColor?: Color;
    public fontFamily?: string;
    public caseType?: CaseType;
    public selectable?: boolean;
    public showSelection?: boolean;
    public selectionColor?: string;
    public secondaryFillColor?: Color;
    public selectType?: ItemSelectType;
    public secondaryBorderColor?: Color;

    constructor(itemText: string) {
        this.text = itemText;
    }
}