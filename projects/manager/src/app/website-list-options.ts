import { Color } from "./color";
import { ListOptions } from "./list-options";

export class WebsiteListOptions extends ListOptions {
    constructor(listOptions?: ListOptions) {
        super(listOptions);
        this.itemHeight = listOptions && listOptions.itemHeight ? listOptions.itemHeight : 22;
        this.scrollSnapping = listOptions && listOptions.scrollSnapping ? listOptions.scrollSnapping : true;
        this.selectionBorderWidth = listOptions && listOptions.selectionBorderWidth ? listOptions.selectionBorderWidth : 0;
        this.selectionFillColor = listOptions && listOptions.selectionFillColor ? listOptions.selectionFillColor : new Color(255, 0, 217, 0.35);
    }
}