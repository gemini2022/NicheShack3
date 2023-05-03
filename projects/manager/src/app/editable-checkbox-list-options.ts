import { Color } from "./color";
import { EditableListOptions } from "./editable-list-options";

export class EditableCheckboxListOptions extends EditableListOptions {
    public tabIndex?: number = -1;
    public checkboxMarginRight?: number = 9;
    public checkboxBorderWidth?: number = 1;
    public checkboxBorderRadius?: number = 2;
    public checkmarkColor?: Color = new Color(255, 186, 0, 1);
    public checkboxBorderColor?: Color = new Color(80, 80, 80, 1);
    public checkmarkHoverColor?: Color = new Color(255, 214, 102, 1);
    public checkboxBackgroundColor?: Color = new Color(40, 40, 40, 1);
    public checkboxBorderHoverColor?: Color = new Color(130, 130, 130, 1);
    public checkboxBackgroundHoverColor?: Color = new Color(60, 60, 60, 1);
    public checkboxBorderCheckedColor?: Color = new Color(100, 100, 100, 1);
    public checkboxBackgroundCheckedColor?: Color = new Color(60, 60, 60, 1);


    constructor(editableCheckboxListOptions?: EditableCheckboxListOptions) {
        super(editableCheckboxListOptions);

        if (editableCheckboxListOptions) {
            if (editableCheckboxListOptions.tabIndex != null) this.tabIndex = editableCheckboxListOptions.tabIndex;
            if (editableCheckboxListOptions.checkmarkColor) this.checkmarkColor = editableCheckboxListOptions.checkmarkColor;
            if (editableCheckboxListOptions.checkboxBorderColor) this.checkboxBorderColor = editableCheckboxListOptions.checkboxBorderColor;
            if (editableCheckboxListOptions.checkmarkHoverColor) this.checkmarkHoverColor = editableCheckboxListOptions.checkmarkHoverColor;
            if (editableCheckboxListOptions.checkboxBorderWidth != null) this.checkboxBorderWidth = editableCheckboxListOptions.checkboxBorderWidth;
            if (editableCheckboxListOptions.checkboxMarginRight != null) this.checkboxMarginRight = editableCheckboxListOptions.checkboxMarginRight;
            if (editableCheckboxListOptions.checkboxBorderRadius != null) this.checkboxBorderRadius = editableCheckboxListOptions.checkboxBorderRadius;
            if (editableCheckboxListOptions.checkboxBackgroundColor) this.checkboxBackgroundColor = editableCheckboxListOptions.checkboxBackgroundColor;
            if (editableCheckboxListOptions.checkboxBorderHoverColor) this.checkboxBorderHoverColor = editableCheckboxListOptions.checkboxBorderHoverColor;
            if (editableCheckboxListOptions.checkboxBorderCheckedColor) this.checkboxBorderCheckedColor = editableCheckboxListOptions.checkboxBorderCheckedColor;
            if (editableCheckboxListOptions.checkboxBackgroundHoverColor) this.checkboxBackgroundHoverColor = editableCheckboxListOptions.checkboxBackgroundHoverColor;
            if (editableCheckboxListOptions.checkboxBackgroundCheckedColor) this.checkboxBackgroundCheckedColor = editableCheckboxListOptions.checkboxBackgroundCheckedColor;
        }
    }
}