import { Color } from "./color";

export class ListItem {
    public id?: string;
    public text?: string;
    public cursor?: string;
    public textColor?: Color;
    public fontSize?: number;
    public selected?: boolean;
    public hoverColor?: Color;
    public fontFamily?: string;
    public hoverTextColor?: Color
    public selectionFillColor?: Color;
    public selectionTextColor?: Color;
    public selectionBorderColor?: Color;
    public selectionBorderWidth?: number;
}