import { Color } from "./color";

export class ListOptions {
    public indent?: number = 5;
    public fontSize?: number = 14;
    public cursor?: string = 'auto';
    public itemHeight?: number = 26;
    public borderWidth?: number = 1;
    public sortable?: boolean = true;
    public editable?: boolean = true;
    public deletable?: boolean = true;
    public itemsPerPage?: number = 20;
    public selectable?: boolean = true;
    public unselectable?: boolean = true;
    public showSelection?: boolean = true;
    public textColor?: string = '#a0a0a0';
    public loadListOnInit?: boolean = true;
    public loopSelection?: boolean = false;
    public multiselectable?: boolean = false;
    public noSelectOnArrowKey?: boolean = false;
    public fillColor?: Color = new Color(255, 255, 255, 0.1);
    public hoverColor?: Color = new Color(255, 255, 255, 0.03);
    public borderColor?: Color = new Color(255, 255, 255, 0.85);
    public fontFamily?: string = 'Arial, Helvetica, sans-serif';
    public secondaryFillColor?: Color = new Color(255, 255, 255, 0.05);
    public secondaryBorderColor?: Color = new Color(255, 255, 255, 0.25);

    constructor(listOptions?: ListOptions) {
        if (listOptions) {
            if (listOptions.indent != null) this.indent = listOptions.indent;
            if (listOptions.cursor) this.cursor = listOptions.cursor;
            if (listOptions.fontSize != null) this.fontSize = listOptions.fontSize;
            if (listOptions.fillColor) this.fillColor = listOptions.fillColor;
            if (listOptions.textColor) this.textColor = listOptions.textColor;
            if (listOptions.hoverColor) this.hoverColor = listOptions.hoverColor;
            if (listOptions.itemHeight != null) this.itemHeight = listOptions.itemHeight;
            if (listOptions.fontFamily) this.fontFamily = listOptions.fontFamily;
            if (listOptions.sortable != null) this.sortable = listOptions.sortable;
            if (listOptions.editable != null) this.editable = listOptions.editable;
            if (listOptions.borderColor) this.borderColor = listOptions.borderColor;
            if (listOptions.borderWidth != null) this.borderWidth = listOptions.borderWidth;
            if (listOptions.deletable != null) this.deletable = listOptions.deletable;
            if (listOptions.itemsPerPage != null) this.itemsPerPage = listOptions.itemsPerPage;
            if (listOptions.selectable != null) this.selectable = listOptions.selectable;
            if (listOptions.unselectable != null) this.unselectable = listOptions.unselectable;
            if (listOptions.loopSelection != null) this.loopSelection = listOptions.loopSelection;
            if (listOptions.showSelection != null) this.showSelection = listOptions.showSelection;
            if (listOptions.loadListOnInit != null) this.loadListOnInit = listOptions.loadListOnInit;
            if (listOptions.multiselectable != null) this.multiselectable = listOptions.multiselectable;
            if (listOptions.secondaryFillColor) this.secondaryFillColor = listOptions.secondaryFillColor;
            if (listOptions.secondaryBorderColor) this.secondaryBorderColor = listOptions.secondaryBorderColor;
            if (listOptions.noSelectOnArrowKey != null) this.noSelectOnArrowKey = listOptions.noSelectOnArrowKey;
        }
    }
}