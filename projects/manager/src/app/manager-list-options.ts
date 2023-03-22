import { Color } from "./color";
import { ListOptions } from "./list-options";

export class ManagerListOptions extends ListOptions {

    constructor(listOptions?: ListOptions) {
        super(listOptions);

        this.fillColor = listOptions && listOptions.fillColor ? listOptions.fillColor : new Color(255, 186, 0, 0.1);
        this.hoverColor = listOptions && listOptions.hoverColor ? listOptions.hoverColor : new Color(255, 186, 0, 0.03);
        this.borderColor = listOptions && listOptions.borderColor ? listOptions.borderColor : new Color(255, 186, 0, 0.85);
        this.secondaryFillColor = listOptions && listOptions.secondaryFillColor ? listOptions.secondaryFillColor : new Color(255, 186, 0, 0.05);
        this.secondaryBorderColor = listOptions && listOptions.secondaryBorderColor ? listOptions.secondaryBorderColor : new Color(255, 186, 0, 0.25);
    }
}