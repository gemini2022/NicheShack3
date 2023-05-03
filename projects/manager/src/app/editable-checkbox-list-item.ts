import { Color } from "./color";
import { EditableListItem } from "./editable-list-item";

export class EditableCheckboxListItem extends EditableListItem {
    public isChecked?: boolean
    public checkmarkColor?: Color;
    public checkboxBorderColor?: Color;
    public checkmarkHoverColor?: Color;
    public checkboxBorderWidth?: number;
    public checkboxBackgroundColor?: Color;
    public checkboxBorderHoverColor?: Color;
    public checkboxBorderRadius?: number = 2;
    public checkboxBorderCheckedColor?: Color;
    public checkboxBackgroundHoverColor?: Color;
    public checkboxBackgroundCheckedColor?: Color;
}