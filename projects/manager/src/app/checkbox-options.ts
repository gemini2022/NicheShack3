import { Color } from "./color";

export class CheckboxOptions {
    public tabIndex?: number = 0;
    public labelFontSize?: number = 14;
    public containerHeight?: number = 15;
    public spaceBetween?: boolean = false;
    public disabledOpacity?: number = 0.25;
    public checkboxSideMargin?: number = 5;
    public checkboxBorderWidth?: number = 1;
    public checkboxBorderRadius?: number = 2;
    public containerPaddingLeft?: number = 0;
    public containerPaddingRight?: number = 0;
    public labelPlacementRight?: boolean = true;
    public showHoverBackground?: boolean = false;
    public labelColor?: Color = new Color(160, 160, 160, 1);
    public checkmarkColor?: Color = new Color(255, 186, 0, 1);
    public labelHoverColor?: Color = new Color(210, 210, 210, 1);
    public checkboxBorderColor?: Color = new Color(80, 80, 80, 1);
    public labelFontFamily?: string = 'Arial, Helvetica, sans-serif';
    public checkmarkHoverColor?: Color = new Color(255, 214, 102, 1);
    public checkboxBackgroundColor?: Color = new Color(40, 40, 40, 1);
    public hoverBackgroundColor?: Color = new Color(255, 255, 255, 0.03);
    public checkboxBorderHoverColor?: Color = new Color(130, 130, 130, 1);
    public checkboxFocusOutlineColor?: Color = new Color(128, 128, 128, 1);
    public checkboxBackgroundHoverColor?: Color = new Color(60, 60, 60, 1);
    public checkboxBorderCheckedColor?: Color = new Color(100, 100, 100, 1);
    public checkboxBackgroundCheckedColor?: Color = new Color(60, 60, 60, 1);


    constructor(checkboxOptions?: CheckboxOptions) {
        if (checkboxOptions) {
            if (checkboxOptions.labelColor) this.labelColor = checkboxOptions.labelColor;
            if (checkboxOptions.tabIndex != null) this.tabIndex = checkboxOptions.tabIndex;
            if (checkboxOptions.checkmarkColor) this.checkmarkColor = checkboxOptions.checkmarkColor;
            if (checkboxOptions.spaceBetween != null) this.spaceBetween = checkboxOptions.spaceBetween;
            if (checkboxOptions.labelHoverColor) this.labelHoverColor = checkboxOptions.labelHoverColor;
            if (checkboxOptions.labelFontFamily) this.labelFontFamily = checkboxOptions.labelFontFamily;
            if (checkboxOptions.labelFontSize != null) this.labelFontSize = checkboxOptions.labelFontSize;
            if (checkboxOptions.containerHeight != null) this.containerHeight = checkboxOptions.containerHeight;
            if (checkboxOptions.disabledOpacity != null) this.disabledOpacity = checkboxOptions.disabledOpacity;
            if (checkboxOptions.checkboxBorderColor) this.checkboxBorderColor = checkboxOptions.checkboxBorderColor;
            if (checkboxOptions.checkmarkHoverColor) this.checkmarkHoverColor = checkboxOptions.checkmarkHoverColor;
            if (checkboxOptions.hoverBackgroundColor) this.hoverBackgroundColor = checkboxOptions.hoverBackgroundColor;
            if (checkboxOptions.checkboxSideMargin != null) this.checkboxSideMargin = checkboxOptions.checkboxSideMargin;
            if (checkboxOptions.checkboxBorderWidth != null) this.checkboxBorderWidth = checkboxOptions.checkboxBorderWidth;
            if (checkboxOptions.labelPlacementRight != null) this.labelPlacementRight = checkboxOptions.labelPlacementRight;
            if (checkboxOptions.showHoverBackground != null) this.showHoverBackground = checkboxOptions.showHoverBackground;
            if (checkboxOptions.checkboxBorderRadius != null) this.checkboxBorderRadius = checkboxOptions.checkboxBorderRadius;
            if (checkboxOptions.containerPaddingLeft != null) this.containerPaddingLeft = checkboxOptions.containerPaddingLeft;
            if (checkboxOptions.checkboxBackgroundColor) this.checkboxBackgroundColor = checkboxOptions.checkboxBackgroundColor;
            if (checkboxOptions.containerPaddingRight != null) this.containerPaddingRight = checkboxOptions.containerPaddingRight;
            if (checkboxOptions.checkboxBorderHoverColor) this.checkboxBorderHoverColor = checkboxOptions.checkboxBorderHoverColor;
            if (checkboxOptions.checkboxFocusOutlineColor) this.checkboxFocusOutlineColor = checkboxOptions.checkboxFocusOutlineColor;
            if (checkboxOptions.checkboxBorderCheckedColor) this.checkboxBorderCheckedColor = checkboxOptions.checkboxBorderCheckedColor;
            if (checkboxOptions.checkboxBackgroundHoverColor) this.checkboxBackgroundHoverColor = checkboxOptions.checkboxBackgroundHoverColor;
            if (checkboxOptions.checkboxBackgroundCheckedColor) this.checkboxBackgroundCheckedColor = checkboxOptions.checkboxBackgroundCheckedColor;
        }
    }
}