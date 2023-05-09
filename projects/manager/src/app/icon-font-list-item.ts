import { Color } from "./color";
import { ListItem } from "./list-item";

export class IconFontListItem extends ListItem {
    public iconFont!: string;
    public iconFontColor?: Color;
    public iconFontHoverColor?: Color;
    public iconFontSelectedColor?: Color
    public iconFontContainerWidth?: number;
}