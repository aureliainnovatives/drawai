import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CanvasComponent } from '../canvas/canvas.component';
import { Subscription } from 'rxjs';
import { CanvasSelectionService } from '../../Services/canvas-selection.service';
import { SelectedColorService } from '../../Services/selected-color.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  @Output() addCanvas: EventEmitter<void> = new EventEmitter<void>();
  @Output() changeCanvasSize: EventEmitter<string> = new EventEmitter<string>();
  @Input() selectedCanvasSizeOption: string = 'letter';
  @Output() deletecanvas: EventEmitter<void> = new EventEmitter<void>();
  @Output() fileInputChange : EventEmitter<string> = new EventEmitter<string>();
  selectedColor$ = this.selectedColorService.selectedColor$;
 

  @Output() boldToggled = new EventEmitter<void>();
  @Output() italicToggled = new EventEmitter<void>();
  @Output() underlineToggled = new EventEmitter<void>();
  @Output() textSizeChanged = new EventEmitter<number>();
  @Output() textColorChanged = new EventEmitter<string>();
  @Output() fontFamilyChanged = new EventEmitter<string>();
  @Input() currentTextSize: number=20; 
  @Input() selectedTextSize: number = 20;

  selectedBorderColor: string = '';
  isTextboxSelected: boolean = false;
  isImageSelected: boolean = false;
  isShapeSelected: boolean = false;
  private subscription: Subscription;

  
  @Output() canvasSizeChanged: EventEmitter<string> = new EventEmitter<string>();

  fontFamilies: string[] = ['Arial', 'Helvetica', 'Times New Roman', 'Courier New'];
  selectedFontColor: string = '#000000';

  isBold: boolean = false;
  isItalic: boolean = false;
  isUnderline: boolean = false 
  selectedColor: string = '#000000';
  onChangeCanvasSize(event: Event) {
    const target = event.target as HTMLSelectElement;
    const size = target.value;
    this.canvasSizeChanged.emit(size);
  }

  textSize: number = 20; 
  constructor(private canvasComponent: CanvasComponent,private selectedColorService: SelectedColorService,private canvasSelectionService: CanvasSelectionService) {
   
    this.selectedColorService.borderColor$.subscribe(color => {
      this.selectedBorderColor = color;
    });
    
    this.subscription = this.canvasSelectionService.selectionType$.subscribe(selectionType => {
      this.isTextboxSelected = selectionType === 'textbox';
      this.isImageSelected = selectionType === 'image';
      this.isShapeSelected = selectionType === 'shape';});
   }

   ngOnDestroy() {
    this.subscription.unsubscribe();
}

ngOnInit() {
  this.selectedColorService.selectedColor$.subscribe(color => {
    this.selectedColor = color;
  });

  this.selectedColorService.borderColor$.subscribe(color => {
    this.selectedBorderColor = color;
  });
}
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
exportAsJSON() {
  this.canvasComponent.exportAsJSON(); // Call exportAsJSON() from CanvasComponent
}

  exportAsPNG() {
    this.canvasComponent.exportAsPNG(); // Call exportAsPNG() from CanvasComponent
  }
  onColorChange() {
    this.selectedColorService.setSelectedColor(this.selectedColor);
  }
  changeBorderColor(event: any) {
    const color = event?.target?.value; // Check for null or undefined before accessing value
    if (color !== null && color !== undefined) {
      this.selectedColorService.setBorderColor(color);
    }
  }
}