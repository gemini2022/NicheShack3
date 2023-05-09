import { Color } from "./color";
import { WebsiteListOptions } from "./website-list-options";

export class IconFontListOptions extends WebsiteListOptions {
    public iconFontContainerWidth?: number = 37;
    public iconFontColor?: Color = new Color(138, 0, 119, 1);
    public iconFontHoverColor?: Color = new Color(190, 0, 169, 1);
    public iconFontSelectedColor?: Color = new Color(237, 141, 237, 1);

    constructor(iconFontListOptions?: IconFontListOptions) {
        super(iconFontListOptions)

        if (iconFontListOptions) {
            if (iconFontListOptions.iconFontColor) this.iconFontColor = iconFontListOptions.iconFontColor;
            if (iconFontListOptions.iconFontHoverColor) this.iconFontHoverColor = iconFontListOptions.iconFontHoverColor;
            if (iconFontListOptions.iconFontSelectedColor) this.iconFontSelectedColor = iconFontListOptions.iconFontSelectedColor;
            if (iconFontListOptions.iconFontContainerWidth != null) this.iconFontContainerWidth = iconFontListOptions.iconFontContainerWidth;
        }
    }
}