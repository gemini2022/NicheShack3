import { Color } from "./color";
import { ListOptions } from "./list-options";

export class WebsiteListOptions extends ListOptions {
    constructor(listOptions?: ListOptions) {
        super(listOptions);

        this.itemHeight = listOptions && listOptions.itemHeight ? listOptions.itemHeight : 22;
        this.borderWidth = listOptions && listOptions.borderWidth ? listOptions.borderWidth : 0;
        this.fillColor = listOptions && listOptions.fillColor ? listOptions.fillColor : new Color(255, 0, 217, 0.35);
    }
}