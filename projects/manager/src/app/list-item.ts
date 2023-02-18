import { CaseType, ItemSelectType } from "./enums";

export class ListItem {
    id!: string;
    name!: string;
    case?: CaseType;
    selected?: boolean;
    editable?: boolean;
    disabled?: boolean;
    selectable?: boolean;
    htmlItem?: HTMLElement;
    htmlItemName?: HTMLElement;
    showSelection?: boolean;
    selectType?: ItemSelectType;
    pastedItems?: Array<string>;
}