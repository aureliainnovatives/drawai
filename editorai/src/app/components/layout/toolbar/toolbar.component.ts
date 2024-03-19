import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {
  @Output() addCanvas: EventEmitter<void> = new EventEmitter<void>();
  @Output() changeCanvasSize: EventEmitter<string> = new EventEmitter<string>();
  @Input() selectedCanvasSizeOption: string = 'letter';
  @Output() deletecanvas: EventEmitter<void> = new EventEmitter<void>();
  @Output() fileInputChange : EventEmitter<string> = new EventEmitter<string>();

  @Input() isTextboxSelected: boolean = false;

  @Output() boldToggled = new EventEmitter<void>();
  @Output() italicToggled = new EventEmitter<void>();
  @Output() underlineToggled = new EventEmitter<void>();
  @Output() textSizeChanged = new EventEmitter<number>();
  @Output() textColorChanged = new EventEmitter<string>();
  @Output() fontFamilyChanged = new EventEmitter<string>();
  @Input() currentTextSize: number=20; 
  @Input() selectedTextSize: number = 20;


  fontFamilies: string[] = ['Arial', 'Helvetica', 'Times New Roman', 'Courier New'];
  selectedFontColor: string = '#000000';
  textSize: number = 20; 
  isBold: boolean = false;
  isItalic: boolean = false;
  isUnderline: boolean = false 

  onAddCanvas(): void {
    this.addCanvas.emit();
    
  }
   Deletecanvas(): void {
    this.deletecanvas.emit();
    
  }
  toggleBold() {
    this.isBold = !this.isBold;
    this.boldToggled.emit();
  }

  toggleItalic() {
    this.isItalic = !this.isItalic;
    this.italicToggled.emit();
  }

  toggleUnderline() {
    this.isUnderline = !this.isUnderline;
    this.underlineToggled.emit();
  }
 
  
  applyTextColor(event: Event) {
    const color = (event.target as HTMLInputElement).value;
    this.textColorChanged.emit(color);
  }
  updateTextSize(selectedTextSize: number): void {
    this.currentTextSize = selectedTextSize;
  }
  changeTextSize(delta: number): void {
    this.currentTextSize = Math.max(1, this.currentTextSize + delta);
    this.textSizeChanged.emit(this.currentTextSize);
  }
changeFontFamily(select: HTMLSelectElement) {
  const selectedFontFamily = select.value;
  this.fontFamilyChanged.emit(selectedFontFamily);
}

  
}
