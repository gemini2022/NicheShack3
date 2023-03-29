import { Color } from "./color";
import { ListOptions } from "./list-options";

export class WebsiteListOptions extends ListOptions {
    constructor(listOptions?: ListOptions) {
        super(listOptions);
        this.itemHeight = listOptions && listOptions.itemHeight ? listOptions.itemHeight : 22;
        this.scrollSnapping = listOptions && listOptions.scrollSnapping ? listOptions.scrollSnapping : true;
        this.selectionFillColor = listOptions && listOptions.selectionFillColor ? listOptions.selectionFillColor : new Color(255, 0, 217, 0.35);
        this.selectionBorderColor = listOptions && listOptions.selectionBorderColor ? listOptions.selectionBorderColor : new Color(156, 9, 135, 1);
        this.secondarySelectionFillColor = listOptions && listOptions.secondarySelectionFillColor ? listOptions.secondarySelectionFillColor : new Color(103, 14, 90, 1);
        this.secondarySelectionBorderColor = listOptions && listOptions.secondarySelectionBorderColor ? listOptions.secondarySelectionBorderColor : new Color(103, 14, 90, 1);
    }
}