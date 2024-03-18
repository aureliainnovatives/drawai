import { Component, ElementRef, AfterViewInit, HostListener, EventEmitter, Output, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { fabric } from 'fabric';
import { CanvasSizeService } from '../../Services/canvas-size.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements AfterViewInit {
  textToAdd: string = '';
  
  private subscription: Subscription;
  private textboxes: fabric.Textbox[] = []; 

  canvas!: fabric.Canvas;
  scaleFactor = 1.1; // Zoom factor
  maxZoom = 10; // Maximum zoom
  minZoom = 0.1; // Minimum zoom
  containerElement!: HTMLElement;
  zoomLevel = 100; // Initial zoom level (100%)
  @Output() addImageToCategory: EventEmitter<{ name: string, data: string }> = new EventEmitter<{ name: string, data: string }>();


  isBold: boolean = false;
  isItalic: boolean = false;
  isUnderline: boolean = false;
  currentTextStyle: string = '';
  selectedTextSize: number = 20;
  currentTextSize: number = 20;
  selectedTextColor: string = '#000000';

  
  
  constructor(private elementRef: ElementRef,
    private cdr: ChangeDetectorRef,
    public canvasSizeService: CanvasSizeService,
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
    this.enableDragAndDrop();
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
          borderColor: 'darkblue',
          cornerStrokeColor: 'gray',
          transparentCorners: false, 
          borderScaleFactor: 2,
          
          // Ensure corners are not transparent
        });
      };
    }
  }

  private enableDragAndDrop(): void {
    this.containerElement.addEventListener('dragover', (event) => {
      event.preventDefault();
    });

    this.containerElement.addEventListener('drop', (event) => {
      event.preventDefault();
      const file = event.dataTransfer?.files[0];
      if (file) {
        this.loadImageFromFile(file);
      }
    });
  }

  
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

  // Apply zoom transformation to the container element
  applyZoom() {
    const scaleValue = this.zoomLevel / 100;
    this.containerElement.style.transform = `scale(${scaleValue})`;
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
  const imageData = event.dataTransfer!.getData('text/plain');
  const img = new Image();
  img.src = imageData;
  const canvas = this.canvas;

  img.onload = () => {
    const fabricImg = new fabric.Image(img, {
      left: event.offsetX,
      top: event.offsetY,
    });

    // Scale the image to fit within the canvas dimensions
    fabricImg.scaleToWidth(canvas.getWidth() * 0.4); // Adjust the scale as needed
    fabricImg.scaleToHeight(canvas.getHeight() * 0.4); // Adjust the scale as needed

    // Center the image within the canvas
    fabricImg.set({
      originX: 'center',
      originY: 'center',
    });

    canvas.add(fabricImg);
    canvas.setActiveObject(fabricImg); // Select the added image
    canvas.renderAll();

    // Emit event to add the image to the "Added Images" category
    this.addImageToCategory.emit({ name: 'New Image', data: imageData });
  };
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
              case 'emptytriangle':
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
                  case 'roundedtriangle':
                    fabricShape = new fabric.Triangle({ 
                        left: event.offsetX,
                        top: event.offsetY,
                        fill: 'black', // You can specify a color for the fill if needed
                        stroke: 'black',
                        strokeWidth: 2,
                        width: 100,
                        height: 100,// Specify the height of the triangle
            
                    });
                    break;
              case 'filledsquare':
                fabricShape = new fabric.Rect({ 
                    left: event.offsetX,
                    top: event.offsetY,
                    fill: 'black',
                    stroke :'black',
                    strokeWidth :2,
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
  if (activeObject && activeObject.type === 'textbox') {
    const textObject = activeObject as fabric.Textbox;
    textObject.set({
      fontSize: textSize
    });
    this.currentTextSize = textSize; // Update currentTextSize
    this.canvas.requestRenderAll(); // Use requestRenderAll to ensure proper rendering
  }
}

applySelectedTextColor(color: string) {
const activeObject = this.canvas.getActiveObject();
if (activeObject instanceof fabric.Textbox) {
  activeObject.set('fill', color);
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


}
