import { CaseType, ItemSelectType } from "./enums";

export class ListItem {
    id!: string;
    name!: string;
    case?: CaseType;
    div?: HTMLElement;
    selected?: boolean;
    editable?: boolean;
    disabled?: boolean;
    selectable?: boolean;
    showSelection?: boolean;
    selectType?: ItemSelectType;
    pastedItems?: Array<string>;
}