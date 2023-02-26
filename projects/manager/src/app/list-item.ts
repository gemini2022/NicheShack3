import { CaseType, ItemSelectType } from "./enums";

export class ListItem {
    public id!: string;
    public text!: string;
    public case?: CaseType;
    public selected?: boolean;
    public editable?: boolean;
    public disabled?: boolean;
    public textColor?: string;
    public hoverColor?: string;
    public selectable?: boolean;
    public htmlItem?: HTMLElement;
    public showSelection?: boolean;
    public selectionColor?: string;
    public htmlItemText?: HTMLElement;
    public selectType?: ItemSelectType;
    public pastedItems?: Array<string>;
}