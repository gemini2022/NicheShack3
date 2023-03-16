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
    public loopSelection?: boolean = false;
    public showSelection?: boolean = true;
    public textColor?: string = '#a0a0a0';
    public hoverColor?: string = '#ffba00';
    public multiselectable?: boolean = true;
    public selectionColor?: string = '#ffba00';
    public noSelectOnArrowKey?: boolean = false;
    public fontFamily?: string = 'Arial, Helvetica, sans-serif';
    public loadListOnInit?: boolean = true;

    constructor(listOptions?: ListOptions) {
        this.indent = listOptions && listOptions.indent ? listOptions.indent : this.indent;
        this.cursor = listOptions && listOptions.cursor ? listOptions.cursor : this.cursor;
        this.sortable = listOptions && listOptions.sortable ? listOptions.sortable : this.sortable;
        this.editable = listOptions && listOptions.editable ? listOptions.editable : this.editable;
        this.fontSize = listOptions && listOptions.fontSize ? listOptions.fontSize : this.fontSize;
        this.deletable = listOptions && listOptions.deletable ? listOptions.deletable : this.deletable;
        this.textColor = listOptions && listOptions.textColor ? listOptions.textColor : this.textColor;
        this.hoverColor = listOptions && listOptions.hoverColor ? listOptions.hoverColor : this.hoverColor;
        this.selectable = listOptions && listOptions.selectable ? listOptions.selectable : this.selectable;
        this.itemHeight = listOptions && listOptions.itemHeight ? listOptions.itemHeight : this.itemHeight;
        this.fontFamily = listOptions && listOptions.fontFamily ? listOptions.fontFamily : this.fontFamily;
        this.itemsPerPage = listOptions && listOptions.itemsPerPage ? listOptions.itemsPerPage : this.itemsPerPage;
        this.unselectable = listOptions && listOptions.unselectable ? listOptions.unselectable : this.unselectable;
        this.loopSelection = listOptions && listOptions.loopSelection ? listOptions.loopSelection : this.loopSelection;
        this.showSelection = listOptions && listOptions.showSelection ? listOptions.showSelection : this.showSelection;
        this.loadListOnInit = listOptions && listOptions.loadListOnInit ? listOptions.loadListOnInit : this.loadListOnInit;
        this.selectionColor = listOptions && listOptions.selectionColor ? listOptions.selectionColor : this.selectionColor;
        this.multiselectable = listOptions && listOptions.multiselectable ? listOptions.multiselectable : this.multiselectable;
        this.noSelectOnArrowKey = listOptions && listOptions.noSelectOnArrowKey ? listOptions.noSelectOnArrowKey : this.noSelectOnArrowKey;
    }
}