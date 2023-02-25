export class ListOptions {
    public indent?: number = 5;
    public cursor?: string = 'auto';
    public sortable?: boolean = true;
    public editable?: boolean = false;
    public deletable?: boolean = true;
    public selectable?: boolean = true;
    public unselectable?: boolean = true;
    public loopSelection?: boolean = true;
    public showSelection?: boolean = true;
    public multiselectable?: boolean = true;
    public selectionColor?: string = '#ffba00';
    public noSelectOnArrowKey?: boolean = true;

    constructor(listOptions?: ListOptions) {
        this.indent = listOptions && listOptions.indent ? listOptions.indent : this.indent;
        this.cursor = listOptions && listOptions.cursor ? listOptions.cursor : this.cursor;
        this.sortable = listOptions && listOptions.sortable ? listOptions.sortable : this.sortable;
        this.editable = listOptions && listOptions.editable ? listOptions.editable : this.editable;
        this.deletable = listOptions && listOptions.deletable ? listOptions.deletable : this.deletable;
        this.selectable = listOptions && listOptions.selectable ? listOptions.selectable : this.selectable;
        this.unselectable = listOptions && listOptions.unselectable ? listOptions.unselectable : this.unselectable;
        this.loopSelection = listOptions && listOptions.loopSelection ? listOptions.loopSelection : this.loopSelection;
        this.showSelection = listOptions && listOptions.showSelection ? listOptions.showSelection : this.showSelection;
        this.selectionColor = listOptions && listOptions.selectionColor ? listOptions.selectionColor : this.selectionColor;
        this.multiselectable = listOptions && listOptions.multiselectable ? listOptions.multiselectable : this.multiselectable;
        this.noSelectOnArrowKey = listOptions && listOptions.noSelectOnArrowKey ? listOptions.noSelectOnArrowKey : this.noSelectOnArrowKey;
    }
}