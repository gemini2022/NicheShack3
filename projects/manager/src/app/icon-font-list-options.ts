import { Color } from "./color";
import { WebsiteListOptions } from "./website-list-options";

export class IconFontListOptions extends WebsiteListOptions {
    public usingClick?: boolean = true;
    public usingMouseEnter?: boolean = true;
    public usingMouseLeave?: boolean = true;
    public iconFontContainerWidth?: number = 37;
    public iconFontColor?: Color = new Color(138, 0, 119, 1);
    public iconFontHoverColor?: Color = new Color(200, 0, 177, 1);
    public iconFontSelectedColor?: Color = new Color(237, 141, 237, 1);

    constructor(iconFontListOptions?: IconFontListOptions) {
        super(iconFontListOptions)

        if (iconFontListOptions) {
            if (iconFontListOptions.usingClick != null) this.usingClick = iconFontListOptions.usingClick;
            if (iconFontListOptions.iconFontColor) this.iconFontColor = iconFontListOptions.iconFontColor;
            if (iconFontListOptions.usingMouseEnter != null) this.usingMouseEnter = iconFontListOptions.usingMouseEnter;
            if (iconFontListOptions.usingMouseLeave != null) this.usingMouseLeave = iconFontListOptions.usingMouseLeave;
            if (iconFontListOptions.iconFontHoverColor) this.iconFontHoverColor = iconFontListOptions.iconFontHoverColor;
            if (iconFontListOptions.iconFontSelectedColor) this.iconFontSelectedColor = iconFontListOptions.iconFontSelectedColor;
            if (iconFontListOptions.iconFontContainerWidth != null) this.iconFontContainerWidth = iconFontListOptions.iconFontContainerWidth;
        }
    }
}