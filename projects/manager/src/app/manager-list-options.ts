import { Color } from "./color";
import { EditableListOptions } from "./editable-list-options";

export class ManagerListOptions extends EditableListOptions {

    constructor(listOptions?: EditableListOptions) {
        super(listOptions);
        this.hoverColor = listOptions && listOptions.hoverColor ? listOptions.hoverColor : new Color(255, 186, 0, 0.03);
        this.selectionFillColor = listOptions && listOptions.selectionFillColor ? listOptions.selectionFillColor : new Color(255, 186, 0, 0.1);
        this.selectionBorderColor = listOptions && listOptions.selectionBorderColor ? listOptions.selectionBorderColor : new Color(255, 186, 0, 0.85);
        this.secondarySelectionFillColor = listOptions && listOptions.secondarySelectionFillColor ? listOptions.secondarySelectionFillColor : new Color(255, 186, 0, 0.05);
        this.secondarySelectionBorderColor = listOptions && listOptions.secondarySelectionBorderColor ? listOptions.secondarySelectionBorderColor : new Color(255, 186, 0, 0.25);
    }
}