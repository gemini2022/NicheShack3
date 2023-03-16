import { CaseType, ItemSelectType } from "./enums";

export class ListItem {
    public id!: string;
    public text!: string;
    public cursor?: string;
    public fontSize?: number;
    public selected?: boolean;
    public editable?: boolean;
    public disabled?: boolean;
    public textColor?: string;
    public hoverColor?: string;
    public fontFamily?: string;
    public caseType?: CaseType;
    public selectable?: boolean;
    public showSelection?: boolean;
    public selectionColor?: string;
    public selectType?: ItemSelectType;

    constructor(itemText: string) {
        this.text = itemText;
    }
}