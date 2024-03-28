import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CanvasComponent } from '../canvas/canvas.component';
import { Subscription } from 'rxjs';
import { CanvasSelectionService } from '../../Services/canvas-selection.service';
import { SelectedColorService } from '../../Services/selected-color.service';
import { fabric } from 'fabric';
import { MatDialog } from '@angular/material/dialog';
import { ExportDialogComponent } from './DownloadDialog/export-dialog/export-dialog.component';

declare var Coloris: any;
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
  @Output() textSizeResized: EventEmitter<number> = new EventEmitter<number>();

  @Output() boldToggled = new EventEmitter<void>();
  @Output() italicToggled = new EventEmitter<void>();
  @Output() underlineToggled = new EventEmitter<void>();

  @Output() textColorChanged = new EventEmitter<string>();
  @Output() fontFamilyChanged = new EventEmitter<string>();
  @Input() selectedTextSize: number = 20;
  @Input() selectedFontFamily: string = 'Arial'; 
  @Input() selectedTextColor: string = '#000000'; 

    @Input() borderStyles: string[] = [];
  @Input() selectedBorderStyle: string = '';
  @Output() borderStyleChanged: EventEmitter<string> = new EventEmitter<string>();

  isCanvasContainerVisible: boolean = true;


  textAlignment: 'left' | 'center' | 'right' | 'justify' = 'left'; // Default alignment
  selectedBorderColor: string = '';
  isTextboxSelected: boolean = false;
  isImageSelected: boolean = false;
  isShapeSelected: boolean = false;
  private subscription: Subscription;

  
  @Output() canvasSizeChanged: EventEmitter<string> = new EventEmitter<string>();

  fontFamilies: string[] = ['Arial', 'Helvetica', 'Times New Roman', 'Courier New'];
  // fontFamilies: string[] = ['Arial', 'Helvetica', 'Times New Roman', 'Courier New','roguedash','cathilda','myford','catcut','rainbow','chunkfive','milvasten','kleptocracy','ph','prida01','poppins'];
  selectedFontColor: string = '#000000';

  isBold: boolean = false;
  isItalic: boolean = false;
  isUnderline: boolean = false;
  
  selectedColor: string = '#000000';
  onChangeCanvasSize(event: Event) {
    const target = event.target as HTMLSelectElement;
    const size = target.value;
    this.canvasSizeChanged.emit(size);
  }

  textSize: number = 20; 
  constructor(private canvasComponent: CanvasComponent,private dialog: MatDialog ,private selectedColorService: SelectedColorService,private canvasSelectionService: CanvasSelectionService) {
   
    
    this.selectedColorService.borderColor$.subscribe(color => {
      this.selectedBorderColor = color;
    });
    
    this.subscription = this.canvasSelectionService.selectionType$.subscribe(selectionType => {
      this.isTextboxSelected = selectionType === 'textbox';
      this.isImageSelected = selectionType === 'image';
      this.isShapeSelected = selectionType === 'shape';
    
        this.isTextboxSelected = selectionType === 'textbox';
        if (this.isTextboxSelected) {
        const activeObject = this.canvasComponent.canvas.getActiveObject();
        if (activeObject instanceof fabric.Textbox) {
          this.selectedTextColor = activeObject.get('fill') as string;
        }
        if (activeObject && activeObject.type === 'textbox') {
          this.selectedFontFamily = (activeObject as fabric.Textbox).fontFamily || 'Arial';
        }
      }
  });

   }

   ngOnDestroy() {
    this.subscription.unsubscribe();
}

ngOnInit() {

  this.canvasComponent.canvas.on('selection:cleared', () => {
    this.textAlignment = 'left'; // or whatever default alignment you want
  });

  this.canvasComponent.canvas.on('selection:created', this.updateTextAlignment.bind(this));
  this.canvasComponent.canvas.on('selection:updated', this.updateTextAlignment.bind(this));


  this.selectedColorService.selectedBorderStyle$.subscribe(style => {
    this.selectedBorderStyle = style;
  });

  Coloris({
    // themeMode: 'dark',
    wrap: true,
    format: 'hex',
    theme : 'large',
    swatches: [
      '#264653',
      '#2a9d8f',
      '#e9c46a',
      'rgb(244,162,97)',
      '#e76f51',
      '#d62828',
      'navy',
      '#07b',
      '#0096c7',
      '#00b4d880',
      'rgba(0,119,182,0.8)'
    ],
    el: '[data-coloris]', // Initialize Coloris for elements with class 'coloris'
    onChange: this.onColorisColorChange // Call onColorChange function when color is picked
  });
  
  this.selectedColorService.selectedColor$.subscribe(color => {
    this.selectedColor = color;
  });

  this.selectedColorService.borderColor$.subscribe(color => {
    this.selectedBorderColor = color;
  });
  this.subscribeToSelectionType();
}

onBorderStyleChange(event: any) {
  const borderStyle = event.target.value;
  this.borderStyleChanged.emit(borderStyle);
}

preventDefaultColorPicker(event: MouseEvent): void {
  event.preventDefault();
}

onColorisColorChange(color: any) {
  console.log('Selected color:', color);
  // You can perform actions with the selected color here
}
  onAddCanvas(): void {
    this.addCanvas.emit();
    
  }
   Deletecanvas(): void {
    this.deletecanvas.emit();
    
  }
  toggleBold() {
    this.isBold = !this.isBold;
    this.boldToggled.emit(); // Emit event without passing arguments
  }

  toggleItalic() {
    this.isItalic = !this.isItalic;
    this.italicToggled.emit(); // Emit event without passing arguments
  }

  toggleUnderline() {
    this.isUnderline = !this.isUnderline;
    this.underlineToggled.emit(); // Emit event without passing arguments
  }


  applyTextColor(event: Event) {
    const color = (event.target as HTMLInputElement).value;
    this.textColorChanged.emit(color);
  }

  changeFontFamily(select: HTMLSelectElement) {
    const selectedFontFamily = select.value;
    this.selectedFontFamily = selectedFontFamily;
    this.canvasComponent.applySelectedFontFamily(selectedFontFamily); // You may need to call a method in your canvas component to apply the font family
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

  openColorPicker() {
    // Access the color input element
    const colorInputElement = document.querySelector('.color-picker-container input[type="color"]') as HTMLInputElement;
    
    // Trigger the click event on the color input element
    if (colorInputElement) {
      colorInputElement.click();
    }
  }


  changeCanvasColor(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target) {
      const color = target.value;
      this.selectedColorService.updateCanvasColor(color);
    }
  }
  private subscribeToSelectionType(): void {
    this.canvasSelectionService.selectionType$.subscribe(selectionType => {
      this.isTextboxSelected = selectionType === 'textbox';
      this.isImageSelected = selectionType === 'image';
      this.isShapeSelected = selectionType === 'shape';

      // Check visibility of other containers and toggle canvas container visibility accordingly
      this.isCanvasContainerVisible = !(this.isTextboxSelected || this.isImageSelected || this.isShapeSelected);
    });
  }

  openExportDialog(): void {
    this.dialog.open(ExportDialogComponent, {
      data: this.canvasComponent // Pass the CanvasComponent instance to the dialog
    });
  }

  updateTextAlignment(): void {
    const activeObject = this.canvasComponent.canvas.getActiveObject();
    if (activeObject instanceof fabric.Textbox) {
      this.textAlignment = activeObject.textAlign as 'left' | 'center' | 'right' | 'justify';
    }
  }
  setTextAlignment(textAlignment: 'left' | 'center' | 'right' | 'justify'): void {
    if (this.textAlignment === textAlignment) {
      this.textAlignment = 'left'; // Reset to default if already selected
    } else {
      this.textAlignment = textAlignment;
    }
    this.canvasComponent.setTextAlignment(this.textAlignment);
  }

  isAlignmentActive(alignment: 'left' | 'center' | 'right' | 'justify'): boolean {
    const activeObject = this.canvasComponent.canvas.getActiveObject();
    if (activeObject instanceof fabric.Textbox) {
      return activeObject.textAlign === alignment;
    }
    return false;
  }

}