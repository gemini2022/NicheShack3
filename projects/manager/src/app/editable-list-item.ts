import { Color } from "./color";
import { ListItem } from "./list-item";
import { CaseType, ItemSelectType } from "./enums";

export class EditableListItem extends ListItem {
    public editable?: boolean;
    public deletable?: boolean;
    public caseType?: CaseType;
    public selectable?: boolean;
    public unselectable?: boolean;
    public showSelection?: boolean;
    public selectType?: ItemSelectType;
    public editedItemTextColor?: Color;
    public secondarySelectionTextColor?: Color;
    public secondarySelectionFillColor?: Color;
    public secondarySelectionBorderColor?: Color;
    public secondarySelectionBorderWidth?: number;

    constructor(itemText: string) {
        super();
        this.text = itemText;
    }
}