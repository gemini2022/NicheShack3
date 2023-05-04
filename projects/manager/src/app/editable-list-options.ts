import { Color } from "./color";
import { ListOptions } from "./list-options";

export class EditableListOptions extends ListOptions {
    public sortable?: boolean = true;
    public editable?: boolean = true;
    public deletable?: boolean = true;
    public selectable?: boolean = true;
    public unselectable?: boolean = true;
    public showSelection?: boolean = true;
    public disabledOpacity?: number = 0.25;
    public multiselectable?: boolean = true;
    public noSelectOnArrowKey?: boolean = false;
    public secondarySelectionBorderWidth?: number = 4;
    public editedItemTextColor?: Color = new Color(220, 220, 220, 1);
    public secondarySelectionTextColor?: Color = new Color(210, 210, 210, 1);
    public secondarySelectionFillColor?: Color = new Color(255, 255, 255, 0.05);
    public secondarySelectionBorderColor?: Color = new Color(255, 255, 255, 0.25);

    constructor(editableListOptions?: EditableListOptions) {
        super(editableListOptions);

        if (editableListOptions) {
            if (editableListOptions.sortable != null) this.sortable = editableListOptions.sortable;
            if (editableListOptions.editable != null) this.editable = editableListOptions.editable;
            if (editableListOptions.deletable != null) this.deletable = editableListOptions.deletable;
            if (editableListOptions.selectable != null) this.selectable = editableListOptions.selectable;
            if (editableListOptions.unselectable != null) this.unselectable = editableListOptions.unselectable;
            if (editableListOptions.showSelection != null) this.showSelection = editableListOptions.showSelection;
            if (editableListOptions.disabledOpacity != null) this.disabledOpacity = editableListOptions.disabledOpacity;
            if (editableListOptions.multiselectable != null) this.multiselectable = editableListOptions.multiselectable;
            if (editableListOptions.editedItemTextColor) this.editedItemTextColor = editableListOptions.editedItemTextColor;
            if (editableListOptions.noSelectOnArrowKey != null) this.noSelectOnArrowKey = editableListOptions.noSelectOnArrowKey;
            if (editableListOptions.secondarySelectionTextColor) this.secondarySelectionTextColor = editableListOptions.secondarySelectionTextColor;
            if (editableListOptions.secondarySelectionFillColor) this.secondarySelectionFillColor = editableListOptions.secondarySelectionFillColor;
            if (editableListOptions.secondarySelectionBorderColor) this.secondarySelectionBorderColor = editableListOptions.secondarySelectionBorderColor;
            if (editableListOptions.secondarySelectionBorderWidth != null) this.secondarySelectionBorderWidth = editableListOptions.secondarySelectionBorderWidth;
        }
    }
}