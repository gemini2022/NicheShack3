import { Color } from "./color";

export class ListOptions {
    public indent?: number = 5;
    public fontSize?: number = 14;
    public cursor?: string = 'auto';
    public itemHeight?: number = 26;
    public sortable?: boolean = true;
    public editable?: boolean = true;
    public deletable?: boolean = true;
    public itemsPerPage?: number = 20;
    public selectable?: boolean = true;
    public unselectable?: boolean = true;
    public showSelection?: boolean = true;
    public loopSelection?: boolean = false;
    public loadListOnInit?: boolean = true;
    public scrollSnapping?: boolean = false;
    public multiselectable?: boolean = true;
    public selectionBorderWidth?: number = 1;
    public noSelectOnArrowKey?: boolean = true;
    public secondarySelectionBorderWidth?: number = 3;
    public initiateSelectionOnArrowKey?: boolean = false;
    public textColor?: Color = new Color(160, 160, 160, 1);
    public hoverColor?: Color = new Color(255, 255, 255, 0.03);
    public fontFamily?: string = 'Arial, Helvetica, sans-serif';
    public hoverTextColor?: Color = new Color(210, 210, 210, 1);
    public selectionTextColor?: Color = new Color(255, 255, 255, 1);
    public editedItemTextColor?: Color = new Color(220, 220, 220, 1);
    public selectionFillColor?: Color = new Color(255, 255, 255, 0.1);
    public selectionBorderColor?: Color = new Color(255, 255, 255, 0.85);
    public secondarySelectionTextColor?: Color = new Color(210, 210, 210, 1);
    public secondarySelectionFillColor?: Color = new Color(255, 255, 255, 0.05);
    public secondarySelectionBorderColor?: Color = new Color(255, 255, 255, 0.25);


    

    
    

    constructor(listOptions?: ListOptions) {
        if (listOptions) {
            if (listOptions.cursor) this.cursor = listOptions.cursor;
            if (listOptions.indent != null) this.indent = listOptions.indent;
            if (listOptions.textColor) this.textColor = listOptions.textColor;
            if (listOptions.hoverColor) this.hoverColor = listOptions.hoverColor;
            if (listOptions.fontFamily) this.fontFamily = listOptions.fontFamily;
            if (listOptions.fontSize != null) this.fontSize = listOptions.fontSize;
            if (listOptions.sortable != null) this.sortable = listOptions.sortable;
            if (listOptions.editable != null) this.editable = listOptions.editable;
            if (listOptions.deletable != null) this.deletable = listOptions.deletable;
            if (listOptions.selectable != null) this.selectable = listOptions.selectable;
            if (listOptions.itemHeight != null) this.itemHeight = listOptions.itemHeight;
            if (listOptions.hoverTextColor) this.hoverTextColor = listOptions.hoverTextColor;
            if (listOptions.itemsPerPage != null) this.itemsPerPage = listOptions.itemsPerPage;
            if (listOptions.unselectable != null) this.unselectable = listOptions.unselectable;
            if (listOptions.loopSelection != null) this.loopSelection = listOptions.loopSelection;
            if (listOptions.showSelection != null) this.showSelection = listOptions.showSelection;
            if (listOptions.loadListOnInit != null) this.loadListOnInit = listOptions.loadListOnInit;
            if (listOptions.scrollSnapping != null) this.scrollSnapping = listOptions.scrollSnapping;
            if (listOptions.multiselectable != null) this.multiselectable = listOptions.multiselectable;
            if (listOptions.selectionFillColor) this.selectionFillColor = listOptions.selectionFillColor;
            if (listOptions.selectionTextColor) this.selectionTextColor = listOptions.selectionTextColor;
            if (listOptions.editedItemTextColor) this.editedItemTextColor = listOptions.editedItemTextColor;
            if (listOptions.selectionBorderColor) this.selectionBorderColor = listOptions.selectionBorderColor;
            if (listOptions.noSelectOnArrowKey != null) this.noSelectOnArrowKey = listOptions.noSelectOnArrowKey;
            if (listOptions.selectionBorderWidth != null) this.selectionBorderWidth = listOptions.selectionBorderWidth;
            if (listOptions.secondarySelectionTextColor) this.secondarySelectionTextColor = listOptions.secondarySelectionTextColor;
            if (listOptions.secondarySelectionFillColor) this.secondarySelectionFillColor = listOptions.secondarySelectionFillColor;
            if (listOptions.secondarySelectionBorderColor) this.secondarySelectionBorderColor = listOptions.secondarySelectionBorderColor;
            if (listOptions.initiateSelectionOnArrowKey != null) this.initiateSelectionOnArrowKey = listOptions.initiateSelectionOnArrowKey;
            if (listOptions.secondarySelectionBorderWidth != null) this.secondarySelectionBorderWidth = listOptions.secondarySelectionBorderWidth;
        }
    }
}