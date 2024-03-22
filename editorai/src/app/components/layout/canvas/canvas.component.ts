import { Component, ElementRef, AfterViewInit, HostListener, EventEmitter, Output, ChangeDetectorRef, Renderer2, ViewChild } from '@angular/core';
import { fabric } from 'fabric';
import { CanvasSizeService } from '../../Services/canvas-size.service';
import { Subscription } from 'rxjs';
import { CanvasSelectionService } from '../../Services/canvas-selection.service';
import { SelectedColorService } from '../../Services/selected-color.service';
import { TextAdditionService } from '../../Services/text-addition.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements AfterViewInit {
  textToAdd: string = '';
  @ViewChild('fileInput') fileInput!: ElementRef;
  private subscription: Subscription;
  private textboxes: fabric.Textbox[] = []; 

  selectedColor: string = '#000000';

  canvas!: fabric.Canvas;
  scaleFactor = 1.1; // Zoom factor
  maxZoom = 10; // Maximum zoom
  minZoom = 0.1; // Minimum zoom
  containerElement!: HTMLElement;
  zoomLevel = 100; // Initial zoom level (100%)
  @Output() addImageToCategory: EventEmitter<{ name: string, data: string }> = new EventEmitter<{ name: string, data: string }>();
  @Output() textboxSelected: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() zoomLevelChanged = new EventEmitter<number>();
  @Output() canvasColorChanged: EventEmitter<string> = new EventEmitter<string>();

  selectedBorderColor: string = '#000000'; // Default border color
  isBold: boolean = false;
  isItalic: boolean = false;
  isUnderline: boolean = false;
  currentTextStyle: string = '';
  selectedTextSize: number = 20;
  currentTextSize: number = 20;
  selectedTextColor: string = '#000000';
  showColorChooser: boolean = true;

  
  canvasWidth: number = 700; // Initial canvas width
  canvasHeight: number = 700; // Initial canvas height

  copiedObject: fabric.Object | null = null; 
  
  constructor(private elementRef: ElementRef,
    private cdr: ChangeDetectorRef,
    private changeDetectorRef: ChangeDetectorRef,
    public canvasSizeService: CanvasSizeService,
    private selectedColorService: SelectedColorService,
    private textAdditionService: TextAdditionService,
    private http: HttpClient,
    private canvasSelectionService: CanvasSelectionService,
    private renderer: Renderer2) { 

      this.subscription = this.canvasSizeService.textToAdd$.subscribe(text => {
        this.textToAdd = text;

      const fabricText = new fabric.Textbox(this.textToAdd, {
        left: 10,
        top: 10,
        fontFamily: 'Arial',
        fontSize:25,
        fill: 'black',
      });
     
      this.canvas.add(fabricText);
      console.log("Text added to canvas:", text);
      this.canvas.renderAll();
    });
    }

    ngOnDestroy() {
      this.subscription.unsubscribe();
    }
   

  ngAfterViewInit() {
    this.containerElement = this.elementRef.nativeElement.querySelector('.canvas-container');
    this.canvas = new fabric.Canvas('canvas', {
      selection: true // Enable selection
    });
    this.canvas.preserveObjectStacking = true;
    this.resizables();
    // this.enableDragAndDrop();
    this.canvas.on('selection:created', this.updateSelectionType.bind(this));
    this.canvas.on('selection:updated', this.updateSelectionType.bind(this));
    this.canvas.on('selection:cleared', this.updateSelectionType.bind(this));

    this.canvas.on('selection:created', this.onSelectionChange.bind(this));
    this.canvas.on('selection:updated', this.onSelectionChange.bind(this));
    this.canvas.on('selection:cleared', this.onSelectionChange.bind(this));
    
    this.canvas.on('selection:created', () => this.updateSelectedBorderColor());
    this.canvas.on('selection:updated', () => this.updateSelectedBorderColor());
    this.canvas.on('selection:cleared', () => this.selectedColorService.setBorderColor('')); // Reset when no selection

    this.selectedColorService.selectedColor$.subscribe(color => {
      this.selectedColor = color;
      this.changeShapeColor(color); // Call method to change shape color
    });
    const activeObject = this.canvas.getActiveObject();
    if (activeObject) {
      const fillColor = activeObject.get('fill') as string;
      this.selectedColorService.setSelectedColor(fillColor);
    }
    this.subscription = this.textAdditionService.addTextWithStyle.subscribe(data => {
      this.addTextWithStyle(data.text, data.fontFamily, data.fill, data.shadow);
    });

    this.selectedColorService.borderColor$.subscribe(color => {
      console.log('Received border color in canvas:', color); // Debugging statement
      this.changeBorderColor(color);
    });

    this.selectedColorService.canvasColor$.subscribe(color => {
      if (this.canvas) {
        this.canvas.backgroundColor = color;
        this.canvas.renderAll();
      }
    });

  }


  // Method to add text to canvas on button click with specified styles

  addTextWithStyle(text: string, fontFamily: string, fill: string, shadow: string) {
    const left = 50;
    const top = 50 + this.canvas.getObjects().length * 50;
    const newText = new fabric.Textbox(text, {
      left: left,
      top: top,
      fontFamily: fontFamily,
      fill: fill,
      shadow: shadow,
      fontSize: 90 // Set the desired font size
    });
    
       setTimeout(() => {
    this.canvas.add(newText);
      this.canvas.renderAll();
    }, 100);
  }
  
  onTextDrop(event: DragEvent) {
    event.preventDefault();
    const textStyle = event.dataTransfer?.getData('textStyle') || '';
    let text = '';
    let fontFamily = '';
    let fill = '';
    let shadow = '';
    switch (textStyle) {
      case 'style1.png':
        text = 'Hello';
        fontFamily = 'roguedash';
        fill = '#007bff';
        shadow = '2px 2px 4px rgba(3, 2, 2, 1)';
        break;
        case 'style2.png':
          text = 'Thanks';
          fontFamily = 'cathilda';
          fill = 'black';
          shadow = '2px 2px 4px rgba(3, 2, 2, 1)';
          break;
  
      case 'style3.png':
          text = 'Open';
          fontFamily = 'myford';
          fill = 'yellow';
          shadow = '2px 2px 4px rgba(3, 2, 2, 1)';
          break;
  
      case 'style4.png':
          text = 'WOW!';
          fontFamily = 'catcut';
          fill = 'rgba(255, 20, 147, 0.9)';
          shadow = '2px 2px 4px rgba(0, 0, 0, 0.5)';
          break;
  
      case 'style5.png':
          text = 'Do What YOU LoVE';
          fontFamily = 'rainbow';
          fill = 'red';
          shadow = '';
          break;
  
      case 'style6.png':
          text = 'ChiLL!!';
          fontFamily = 'chunkfive';
          fill = 'purple';
          shadow = '';
          break;
  
      case 'style7.png':
          text = 'Happy Birthday';
          fontFamily = 'milvasten';
          fill = 'rgb(248, 110, 5)';
          shadow = '2px 2px 4px rgba(0, 0, 0, 0.5)';
          break;
  
      case 'style8.png':
          text = 'enjoy';
          fontFamily = 'kleptocracy';
          fill = 'rgb(255, 0, 85)';
          shadow = '2px 2px 4px rgba(5, 5, 5, 3)';
          break;
  
      case 'style9.png':
          text = 'Coming Soon';
          fontFamily = 'ph';
          fill = 'blue';
          shadow = '2px 2px 4px rgba(255, 20, 147, 0.9)';
          break;
  
      case 'style10.png':
          text = 'Party';
          fontFamily = 'prida01';
          fill = 'rgb(6, 243, 239)';
          shadow = '2px 2px 4px rgba(255, 43, 20, 0.9)';
          break;
  
      case 'style11.png':
          text = 'PLAY';
          fontFamily = 'prida';
          fill = 'rgb(32, 1, 33)';
          shadow = '2px 2px 4px rgba(67, 232, 7, 0.9)';
          break;
        
    
    }
    this.addTextWithStyle(text, fontFamily, fill, shadow);
  
      this.canvas.renderAll();
  }

private updateSelectionType() {
  const activeObject = this.canvas.getActiveObject();
  if (activeObject instanceof fabric.Textbox) {
    this.canvasSelectionService.setSelectionType('textbox');
  } else if (activeObject instanceof fabric.Image) {
    this.canvasSelectionService.setSelectionType('image');
  } else if (
    activeObject instanceof fabric.Rect ||
    activeObject instanceof fabric.Polygon ||
    activeObject instanceof fabric.Circle ||
    activeObject instanceof fabric.Triangle 
  ) {
    this.canvasSelectionService.setSelectionType('shape');
  } else {
    this.canvasSelectionService.setSelectionType('none');
  }
}

onSelectionChange() {
  const activeObject = this.canvas.getActiveObject();
  if (activeObject) {
    const fillColor = activeObject.get('fill') as string;
    this.selectedColorService.setSelectedColor(fillColor);
    
    if (activeObject.stroke) {
      this.selectedBorderColor = activeObject.stroke;
    }
  }
}

changeShapeColor(color: string) {
  const activeObject = this.canvas.getActiveObject();
  if (activeObject) {
    activeObject.set('fill', color);
    this.canvas.renderAll(); // Render canvas to reflect changes
  }
}

onColorChange(event: Event, isBorderColor: boolean = false) {
  const target = event.target as HTMLInputElement;
  if (isBorderColor) {
    this.selectedBorderColor = target.value;
    this.changeBorderColor(this.selectedBorderColor); // Apply border color
  } else {
    this.selectedColor = target.value;
    this.changeShapeColor(this.selectedColor); // Apply fill color
  }
}

changeBorderColor(color: string) {
  const activeObject = this.canvas.getActiveObject();
  if (activeObject && activeObject.stroke) {
    activeObject.set('stroke', color); // Change border color
    this.canvas.renderAll(); // Render canvas to reflect changes
  }
}

updateSelectedBorderColor() {
  const activeObject = this.canvas.getActiveObject();
  if (activeObject && activeObject.stroke) {
    this.selectedColorService.setBorderColor(activeObject.stroke); // Update selected border color
  }
}
onChangeCanvasSize(size: string) {
  if (size) {
    const [width, height] = size.split('x').map(Number);
    this.canvasWidth = width;
    this.canvasHeight = height;
    this.canvas.setDimensions({ width, height });
  }

}

  
  private resizables(): void {
    if (this.canvas) {

      this.canvas.selection = false;
       // Apply resizable properties to any object added to the canvas
       this.canvas.on('object:added', (event) => {
        const addedObject = event.target;
        if (addedObject) {
          applyResizableProperties(addedObject as fabric.Object);
        }
      });
  
      // Function to apply resizable border properties to an object
      const applyResizableProperties = (obj: fabric.Object): void => {
        obj.set({
          selectable: true,
          hasControls: true,
          hasBorders: true,
          cornerStyle: 'circle',
          cornerColor: 'white', // Change corner color to white
          cornerSize: 10,
          borderColor: 'red',
          cornerStrokeColor: 'gray',
          transparentCorners: false, 
          borderScaleFactor: 2,
          
          // Ensure corners are not transparent
        });
      };
    }
  }
  changeCanvasColor(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target) {
      const color = target.value;
      this.selectedColorService.updateCanvasColor(color);
    }
  }


  exportAsJSON() {
    const json = JSON.stringify(this.canvas.toJSON());
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'canvas.json';
    link.click();
    window.URL.revokeObjectURL(url);
  }

  exportAsPNG() {
    if (this.canvas) {
      const tempCanvas = document.createElement('canvas');
      const canvasWidth = this.canvas.width || 0; // Default to 0 if canvas width is undefined
      const canvasHeight = this.canvas.height || 0; // Default to 0 if canvas height is undefined
  
      tempCanvas.width = canvasWidth;
      tempCanvas.height = canvasHeight;
      const tempFabricCanvas = new fabric.Canvas(tempCanvas);
  
      // Clone objects without resizable properties
      this.canvas.getObjects().forEach((obj) => {
        const clone = fabric.util.object.clone(obj);
        clone.setControlsVisibility({ mt: false, mb: false, ml: false, mr: false, bl: false, br: false, tl: false, tr: false });
        tempFabricCanvas.add(clone);
      });
  
      // Use fabric.js toDataURL method to export the canvas as a data URL
      const dataUrl = tempFabricCanvas.toDataURL({
        format: 'png',
        quality: 1, // Set quality to 1 for maximum quality
        multiplier: 1 // Set multiplier to 1 for original size
      });
  
      // Create a link element to trigger download
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'canvas_image.png';
      link.click();
  
      // Dispose the temporary fabric canvas
      tempFabricCanvas.dispose();
}

  }
  
  // private enableDragAndDrop(): void {
  //   this.containerElement.addEventListener('dragover', (event) => {
  //     event.preventDefault();
  //   });

  //   this.containerElement.addEventListener('drop', (event) => {
  //     event.preventDefault();
  //     const file = event.dataTransfer?.files[0];
  //     if (file) {
  //       this.loadImageFromFile(file);
  //     }
  //   });
  // }

  
  private loadImageFromFile(file: File): void {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      const imgURL = event.target.result;
  
      fabric.Image.fromURL(imgURL, (img) => {
        if (this.canvas && this.canvas.width && this.canvas.height && img.width && img.height) {
          // Define fixed width and height for all images
          const fixedWidth = 200; // Adjust as needed
          const fixedHeight = 200; // Adjust as needed
  
          // Calculate scaling factors to fit the image within the fixed dimensions
          const scaleX = fixedWidth / img.width;
          const scaleY = fixedHeight / img.height;
          const scale = Math.min(scaleX, scaleY);
  
          // Scale the image proportionally
          const scaledWidth = img.width * scale;
          const scaledHeight = img.height * scale;
  
          // Calculate position to center the image within the canvas
          const left = (this.canvas.width - scaledWidth) / 2;
          const top = (this.canvas.height - scaledHeight) / 2;
  
          // Set image properties
          img.set({
            left: left,
            top: top,
            scaleX: scale,
            scaleY: scale,
          });
  
          // Add image to canvas
          this.canvas.add(img);
          this.canvas.renderAll();
        }
      });
    };
    reader.readAsDataURL(file);
  }
  
  
  
  
  // Function to handle zoom in
  zoomIn() {
    if (this.zoomLevel < 200) {
      this.zoomLevel += 1;
      this.applyZoom();
    }
  }

  // Function to handle zoom out
  zoomOut() {
    if (this.zoomLevel > 20) {
      this.zoomLevel -= 1;
      this.applyZoom();
    }
  }

  // Function to apply zoom based on slider value
  onZoomSliderChange(value: number) {
    this.zoomLevel = value;
    this.applyZoom();
  }

  applyZoom() {
    const scaleValue = this.zoomLevel / 100;
    this.containerElement.style.transform = `scale(${scaleValue})`;
    this.zoomLevelChanged.emit(this.zoomLevel); // Emitting zoom level change
  }
  // Host listener for wheel events
  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent) {
    // Check if shift key is pressed
    if (event.shiftKey) {
      // Check if scroll event is detected
      if (event.deltaY > 0) {
        // Scroll down, zoom out
        this.zoomOut();
      } else if (event.deltaY < 0) {
        // Scroll up, zoom in
        this.zoomIn();
      }
      // Prevent default scrolling behavior
      event.preventDefault();
    }
  }
  // Dragover event handler
onDragOver(event: DragEvent) {
  event.preventDefault();
}

ImageonDrop(event: DragEvent) {
  event.preventDefault();
  const imageURL = event.dataTransfer!.getData('text/plain');

  // Load the image URL using HttpClient to avoid CORS issues
  this.http.get(imageURL, { responseType: 'blob' }).subscribe((blob: Blob) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result as string;

      // Create a Fabric.js Image object with base64 data
      fabric.Image.fromURL(base64Data, (fabricImg) => {
        const canvasWidth = this.canvas.getWidth();
        const canvasHeight = this.canvas.getHeight();
        const imgWidth = fabricImg.width || fabricImg.getScaledWidth();
        const imgHeight = fabricImg.height || fabricImg.getScaledHeight();

        // Check if the canvas dimensions are available
        if (canvasWidth && canvasHeight) {
          // Check if the image exceeds canvas dimensions
          if (imgWidth > canvasWidth || imgHeight > canvasHeight) {
            // Scale down the image to fit within the canvas dimensions
            const scale = Math.min(canvasWidth / imgWidth, canvasHeight / imgHeight);
            fabricImg.scale(scale);
          }
        }

        // Set position
        fabricImg.set({
          left: event.offsetX,
          top: event.offsetY,
        });

        // Add the Fabric.js Image object to the canvas
        this.canvas.add(fabricImg);
        this.canvas.setActiveObject(fabricImg);
        this.canvas.renderAll();

        // Emit event to add the image to the "Added Images" category
        this.addImageToCategory.emit({ name: 'New Image', data: base64Data });
      });
    };
    reader.readAsDataURL(blob);
  });
}



///shape section
  onDrop(event: DragEvent) {
    event.preventDefault();
    const shapeName = event.dataTransfer!.getData('text/plain');
    let fabricShape: fabric.Object | undefined;

    switch (shapeName) {
        case 'filledcircle':
            fabricShape = new fabric.Circle({
                left: event.offsetX,
                top: event.offsetY,
                fill: 'black',
                radius: 50,
                selectable: true
            });
            break;
            case 'emptycircle':
              fabricShape = new fabric.Circle({
                  left: event.offsetX,
                  top: event.offsetY,
                  fill: '',
                  stroke: 'black',
                  strokeWidth: 2,
                  radius: 50,
                  selectable: true
              });
              break;
            case 'emptysquare':
              fabricShape = new fabric.Rect({
                  left: event.offsetX,
                  top: event.offsetY,
                  fill: '',
                  stroke: 'black',
                  strokeWidth: 2,
                  width: 100,
                  height: 100,
              });
              break;
              case 'roundedtriangle':
                fabricShape = new fabric.Triangle({ 
                    left: event.offsetX,
                    top: event.offsetY,
                    fill: '', // You can specify a color for the fill if needed
                    stroke: 'black',
                    strokeWidth: 2,
                    width: 100,
                    height: 100,// Specify the height of the triangle
                });
                break;
                case 'filledtriangle':
                  fabricShape = new fabric.Triangle({ 
                      left: event.offsetX,
                      top: event.offsetY,
                      fill: 'black', // You can specify a color for the fill if needed
                      stroke: 'black',
                      strokeWidth: 2,
                      width: 100,
                    height: 100, // Specify the height of the triangle
                  });
                  break;
              case 'filledsquare':
                fabricShape = new fabric.Rect({ 
                    left: event.offsetX,
                    top: event.offsetY,
                    fill: 'black',
                    width: 100,
                    height: 100,
                   
                });
                break;
                case 'roundedsquare':
                  fabricShape = new fabric.Rect({ 
                      left: event.offsetX,
                      top: event.offsetY,
                      fill: 'black',
                      stroke: 'black',
                      strokeWidth: 2,
                      width: 100,
                      height: 100,
                      rx: 4, // Adjust the value to control the roundness of corners
                      ry: 4, // Adjust the value to control the roundness of corners
                     
                  });
                  break;
                  case 'fouremptystar':
                    const starPoints1 = [
                      { x: 0, y: -50 },
                      { x: 15, y: -15 },
                      { x: 50, y: 0 },
                      { x: 15, y: 15 },
                      { x: 0, y: 50 },
                      { x: -15, y: 15 },
                      { x: -50, y: 0 },
                      { x: -15, y: -15 },
                    ];
                    fabricShape = new fabric.Polygon(starPoints1, {
                        left: event.offsetX,
                        top: event.offsetY,
                        fill: '', // You can specify a color for the fill if needed
                        stroke: 'black',
                        strokeWidth: 2,
                    });
                    break;


                    case 'halffilledstar':
                      const starRadius = 50;
                      const innerRadius = 20;
                      const numberOfPoints = 5;
                      const angleIncrement = (2 * Math.PI) / (numberOfPoints * 2);
                  
                      const outerStarPoints = [];
                      const innerStarPoints = [];
                  
                      for (let i = 0; i < numberOfPoints * 2; i++) {
                        const radius = i % 2 === 0 ? starRadius : innerRadius;
                        const angle = i * angleIncrement - Math.PI / 2;
                  
                        const point = {
                          x: starRadius + radius * Math.cos(angle),
                          y: starRadius + radius * Math.sin(angle),
                          stroke: 'black',
                          strokeWidth: 2,
                        };
                  
                        if (i <= numberOfPoints) {
                          innerStarPoints.push(point);
                        } else {
                          outerStarPoints.push(point);
                        }
                      }
                      fabricShape = new fabric.Polygon(innerStarPoints, {
                        fill: 'black',
                        stroke: 'black',
                        strokeWidth: 2,
                        left: event.offsetX,
                      top: event.offsetY,
                      });
                      break;

                      case 'filledhexa':
                      const scaleFactor = 4; // Adjust this scaling factor as needed

                      // Define hexagon points
                      const hexagonPoints1 = [
                          { x: 0, y: -15 },
                          { x: 13.4, y: -7.5 },
                          { x: 13.4, y: 7.5 },
                          { x: 0, y: 15 },
                          { x: -13.4, y: 7.5 },
                          { x: -13.4, y: -7.5 }
                      ];

                      // Scale hexagon points
                      const scaledHexagonPoints = hexagonPoints1.map(point => ({
                          x: point.x * scaleFactor,
                          y: point.y * scaleFactor
                      }));

                      // Create fabric polygon with scaled points
                      fabricShape = new fabric.Polygon(scaledHexagonPoints, {
                          left: event.offsetX,
                          top: event.offsetY,
                          fill: 'black',
                          stroke: 'black',
                          strokeWidth: 2
                      });
                      break;

                      case 'emptyhexa':
                        const scaleFactorempty = 4; // Adjust this scaling factor as needed
                    
                        // Define hexagon points
                        const hexagonPoints = [
                            { x: 0, y: -15 },
                            { x: 13.4, y: -7.5 },
                            { x: 13.4, y: 7.5 },
                            { x: 0, y: 15 },
                            { x: -13.4, y: 7.5 },
                            { x: -13.4, y: -7.5 }
                        ];
                    
                        // Scale hexagon points
                        const scaledHexagonPoints1 = hexagonPoints.map(point => ({
                            x: point.x * scaleFactorempty,
                            y: point.y * scaleFactorempty
                        }));
                    
                        // Create fabric polygon with scaled points
                        fabricShape = new fabric.Polygon(scaledHexagonPoints1, {
                            left: event.offsetX,
                            top: event.offsetY,
                            fill: '',
                            stroke: 'black',
                            strokeWidth: 2
                        });
                        break;
                    
                  
                  case 'sevenedgestar':
                    const starRadius1 = 50;
                    const innerRadius1 = 20;
                    const numberOfPoints1 = 7;
                    const angleIncrement1 = (2 * Math.PI) / numberOfPoints1;
                
                    const starPoints = [];
                
                    for (let i = 0; i < numberOfPoints1 * 2; i++) {
                      const radius = i % 2 === 0 ? starRadius1 : innerRadius1;
                      const angle = i * angleIncrement1 - Math.PI / 2;
                
                      const point = {
                        x: starRadius1 + radius * Math.cos(angle),
                        y: starRadius1 + radius * Math.sin(angle),
                      };
                
                      starPoints.push(point);
                    }

                  fabricShape = new fabric.Polygon(starPoints, {
                    fill: '',
                    stroke :'black',
                    strokeWidth: 2,
                    left: event.offsetX,
                    top: event.offsetY,
                  });
                  break;

                  
    
  

        default:
            console.error('Unknown shape:', shapeName);
            return;
    }

    if (fabricShape) {
        this.canvas.add(fabricShape);
        this.canvas.setActiveObject(fabricShape);
    }
}




toggleBold() {
  this.isBold = !this.isBold;
  this.applySelectedTextStyle();
}

toggleItalic() {
  this.isItalic = !this.isItalic;
  this.applySelectedTextStyle();
}

toggleUnderline() {
  this.isUnderline = !this.isUnderline;
  this.applySelectedTextStyle();
}
applySelectedTextStyle() {
  const activeObject = this.canvas.getActiveObject();
  if (activeObject && activeObject.type === 'textbox') {
    const textObject = activeObject as fabric.Textbox;
    textObject.set({
      fontStyle: this.isItalic ? 'italic' : 'normal',
      fontWeight: this.isBold ? 'bold' : 'normal',
      underline: this.isUnderline,
      fontSize: this.selectedTextSize
    });
    this.canvas.renderAll();
  }
}
applySelectedTextSize(textSize: number) {
  const activeObject = this.canvas.getActiveObject();
  if (activeObject instanceof fabric.Textbox) {
    activeObject.set('fontSize', textSize); // Set fontSize instead of fill
    this.selectedTextSize = textSize; // Update selected text size
    this.canvas.renderAll();
  }
}

applySelectedTextColor(color: string) {
  const activeObject = this.canvas.getActiveObject();
  if (activeObject instanceof fabric.Textbox) {
    activeObject.set('fill', color);
    this.selectedTextColor = color; // Update selected text color
    this.canvas.renderAll();
  }
}
applySelectedFontFamily(fontFamily: string) {
  const activeObject = this.canvas.getActiveObject();
  if (activeObject && activeObject.type === 'textbox') {
    const textObject = activeObject as fabric.Textbox;
    textObject.set({
      fontFamily: fontFamily
    });
    this.canvas.requestRenderAll(); // Use requestRenderAll to ensure proper rendering
  }
  }
handleTextboxSelection(isSelected: boolean) {
  // Emit the selected state of the textbox
  this.textboxSelected.emit(isSelected);
}
@HostListener('document:keydown', ['$event'])
handleKeyboardEvents(event: KeyboardEvent) {
  // Copy: Ctrl+C or Cmd+C
  if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
    this.copySelected();
  }
  // Paste: Ctrl+V or Cmd+V
  if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
    this.pasteCopied();
  }
  // Delete: Delete or Backspace
  if (event.key === 'Delete') {
    this.deleteSelectedObject();
  }
}

// Function to copy the currently selected object
copySelected() {
  const activeObject = this.canvas.getActiveObject();
  if (activeObject) {
    activeObject.clone((clonedObject: fabric.Object) => {
      this.copiedObject = clonedObject;
    });
  }
}


// Function to paste the copied object slightly to the right of the original object
pasteCopied() {
  if (this.copiedObject) {
    const originalObject = this.canvas.getActiveObject();
    if (originalObject) {
      const originalPosition = originalObject.getCenterPoint(); // Get center point of the original object
      const xOffset = 20; // Offset value for moving to the right
      const clonedObject = fabric.util.object.clone(this.copiedObject);
      const newPosition = new fabric.Point(originalPosition.x + xOffset, originalPosition.y);
      clonedObject.set({ left: newPosition.x, top: newPosition.y }); // Set new position
      this.canvas.add(clonedObject);
      this.canvas.setActiveObject(clonedObject);
      this.canvas.renderAll();
    }
  }
}

deleteSelectedObject(): void {
  const activeObject = this.canvas.getActiveObject();
  if (activeObject) {
    this.canvas.remove(activeObject);
    this.canvas.renderAll();
  }
}
flipSelectedImage(): void {
  const activeObject = this.canvas.getActiveObject();
  if (activeObject && activeObject.type === 'image') {
    activeObject.set({ flipX: !activeObject.flipX });
    this.canvas.renderAll();
  }
}
moveObjectBackward(): void {
  const activeObject = this.canvas.getActiveObject();
  if (activeObject) {
    this.canvas.sendBackwards(activeObject);
    this.canvas.renderAll();
  }
}

moveObjectForward(): void {
  const activeObject = this.canvas.getActiveObject();
  if (activeObject) {
    this.canvas.bringForward(activeObject);
    this.canvas.renderAll();
  }
}

}

