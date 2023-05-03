import { Color } from "./color";

export class ListOptions {
    public indent?: number = 5;
    public fontSize?: number = 14;
    public cursor?: string = 'auto';
    public itemHeight?: number = 26;
    public itemsPerPage?: number = 20;
    public loopSelection?: boolean = false;
    public loadListOnInit?: boolean = true;
    public scrollSnapping?: boolean = false;
    public selectionBorderWidth?: number = 1;
    public textColor?: Color = new Color(160, 160, 160, 1);
    public hoverColor?: Color = new Color(255, 255, 255, 0.03);
    public fontFamily?: string = 'Arial, Helvetica, sans-serif';
    public hoverTextColor?: Color = new Color(210, 210, 210, 1);
    public selectionTextColor?: Color = new Color(255, 255, 255, 1);
    public selectionFillColor?: Color = new Color(255, 255, 255, 0.1);
    public selectionBorderColor?: Color = new Color(255, 255, 255, 0.85);

    constructor(listOptions?: ListOptions) {
        if (listOptions) {
            if (listOptions.cursor) this.cursor = listOptions.cursor;
            if (listOptions.indent != null) this.indent = listOptions.indent;
            if (listOptions.textColor) this.textColor = listOptions.textColor;
            if (listOptions.hoverColor) this.hoverColor = listOptions.hoverColor;
            if (listOptions.fontFamily) this.fontFamily = listOptions.fontFamily;
            if (listOptions.fontSize != null) this.fontSize = listOptions.fontSize;
            if (listOptions.itemHeight != null) this.itemHeight = listOptions.itemHeight;
            if (listOptions.hoverTextColor) this.hoverTextColor = listOptions.hoverTextColor;
            if (listOptions.itemsPerPage != null) this.itemsPerPage = listOptions.itemsPerPage;
            if (listOptions.loopSelection != null) this.loopSelection = listOptions.loopSelection;
            if (listOptions.loadListOnInit != null) this.loadListOnInit = listOptions.loadListOnInit;
            if (listOptions.scrollSnapping != null) this.scrollSnapping = listOptions.scrollSnapping;
            if (listOptions.selectionFillColor) this.selectionFillColor = listOptions.selectionFillColor;
            if (listOptions.selectionTextColor) this.selectionTextColor = listOptions.selectionTextColor;
            if (listOptions.selectionBorderColor) this.selectionBorderColor = listOptions.selectionBorderColor;
            if (listOptions.selectionBorderWidth != null) this.selectionBorderWidth = listOptions.selectionBorderWidth;
        }
    }
}