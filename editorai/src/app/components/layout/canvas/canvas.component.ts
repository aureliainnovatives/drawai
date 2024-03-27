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

  borderStyles: string[] = ['Solid', 'Dashed', 'Dotted', 'Double'];
  selectedBorderStyle: string = 'Solid'; // Default to 'solid', you can change it to match your default style


  isBold: boolean = false;
  isItalic: boolean = false;
  isUnderline: boolean = false;

  exportTransparentBackground: boolean = false;

  currentTextStyle: string = '';
  selectedTextSize: number = 20;
  currentTextSize: number = 20;
  selectedTextColor: string = '#000000';
  showColorChooser: boolean = true;

  selectedShapeBorderStyle: string | null = null;
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

        const canvasElement: HTMLCanvasElement = this.elementRef.nativeElement.querySelector('canvas');
        const canvasWidth = canvasElement.width;
        const canvasHeight = canvasElement.height;

        // Calculate center coordinates of the canvas
        const centerX = canvasWidth / 2.5;
        const centerY = canvasHeight / 2.4;

      const fabricText = new fabric.Textbox(this.textToAdd, {
        left: centerX,
        top: centerY,
        fontFamily: 'Arial',
        fontSize:45,
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
   
    onTransparentBackgroundChange(event: Event) {
      const detail = (event as CustomEvent).detail;
      this.exportTransparentBackground = detail;
    }



  ngAfterViewInit() {
    this.selectedColorService.selectedBorderStyle$.subscribe(style => {
      this.selectedBorderStyle = style;
    });

    this.containerElement = this.elementRef.nativeElement.querySelector('.canvas-container');
    this.canvas = new fabric.Canvas('canvas', {
      selection: true // Enable selection
    });
    this.canvas.preserveObjectStacking = true;
    this.resizables();
    const selectionChangeHandler = () => {
      const activeObjects = this.canvas.getActiveObjects(); // Get currently selected objects

      
      if (activeObjects.length > 1) {
        // Multi-select action
        console.log('Multiple objects selected:', activeObjects);
        // Perform actions on selected objects
      } else if (activeObjects.length === 1) {
        // Single object selected
        console.log('Single object selected:', activeObjects[0]);
        // Perform actions on single selected object
      } else {
        // No objects selected
        console.log('No objects selected');
      }

      this.onSelectionChange();
      this.updateSelectedBorderColor();
  };
    // this.enableDragAndDrop();
    this.canvas.on('selection:created', this.updateSelectionType.bind(this));
    this.canvas.on('selection:updated', this.updateSelectionType.bind(this));
    this.canvas.on('selection:cleared', this.updateSelectionType.bind(this));

    this.canvas.on('selection:created', selectionChangeHandler);
    this.canvas.on('selection:updated', selectionChangeHandler);
    this.canvas.on('selection:cleared', selectionChangeHandler);
    
    this.canvas.on('selection:created', selectionChangeHandler);
    this.canvas.on('selection:updated', selectionChangeHandler);
    this.canvas.on('selection:cleared', selectionChangeHandler);


    this.canvas.on('selection:cleared', () => this.selectedColorService.setBorderColor('')); // Reset when no selection
 
    this.canvas.on('selection:created', this.SendonSelectionChange.bind(this));
   
 
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
      this.addTextWithStyle(data.text, data.fontFamily, data.dropY , data.dropX, data.fill, data.shadow , data.fontWeight);
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

    this.canvas.on('selection:created', this.updateBorderStyleDropdown.bind(this));
    this.canvas.on('selection:updated', this.updateBorderStyleDropdown.bind(this));
    this.canvas.on('selection:cleared', this.updateBorderStyleDropdown.bind(this));

  }

applyBorderStyle(borderStyle: string) {
  const activeObjects = this.canvas.getActiveObjects();
  activeObjects.forEach(object => {
    if (object instanceof fabric.Object) {
      object.set('stroke', borderStyle === 'none' ? '' : 'black');
      object.set('strokeWidth', borderStyle === 'none' ? 0 : 2);
      object.set('strokeDashArray', this.getStrokeDashArray(borderStyle));
      object.setCoords();
    }
  });
  this.canvas.renderAll();
}



  // Helper function to get stroke dash array based on selected border style
// Helper function to get stroke dash array based on selected border style
getStrokeDashArray(borderStyle: string): number[] | undefined {
  switch (borderStyle) {
    case 'Solid':
      return undefined; // No dash array for solid style
    case 'Dashed':
      return [5, 5]; // Adjust dash array as needed
    case 'Dotted':
      return [1, 3]; // Adjust dash array as needed
    case 'Double':
      return [2, 2]; // Adjust dash array as needed
    default:
      return undefined;
  }
}


  // Update border style dropdown to reflect the selected object's border style
  updateBorderStyleDropdown() {
    const activeObjects = this.canvas.getActiveObjects();
    if (activeObjects.length === 1 && activeObjects[0] instanceof fabric.Object) {
      const activeObject = activeObjects[0] as fabric.Object;
      const strokeDashArray = activeObject.strokeDashArray || [];
      const matchingBorderStyle = this.borderStyles.find(style => {
        const expectedDashArray = this.getStrokeDashArray(style);
        return JSON.stringify(strokeDashArray) === JSON.stringify(expectedDashArray);
      });
      if (matchingBorderStyle) {
        this.selectedBorderStyle = matchingBorderStyle;
      } else {
        this.selectedBorderStyle = 'Solid'; // Default to 'solid' if no match found
      }
    } else {
      this.selectedBorderStyle = 'Solid'; // Default to 'solid' when no single object is selected
    }
  }
  addTextWithStyle(text: string, fontFamily: string, dropX: number, dropY: number, fill: string, shadow: string, fontWeight: string) {
    const fontSize = 90;
    const newText = new fabric.Textbox(text, {
      left: dropX - (fontSize / 2), // Subtract half of the text's width
      top: dropY - (fontSize / 2),
      fontFamily: fontFamily,
      fill: fill,
      shadow: shadow,
      fontSize: 90, // Set the desired font size
      fontWeight: fontWeight
    });
    
       setTimeout(() => {
    this.canvas.add(newText);
      this.canvas.renderAll();
    }, 200);
  }
  
  onTextDrop(data:string, event: DragEvent) {
    console.log('text : ', data)
    event.preventDefault();
    const textStyle = data;
    let text = '';
    let fontFamily = '';
    let fill = '';
    let shadow = '';
    let fontWeight = '';

    const canvasRect = (event.target as HTMLElement).getBoundingClientRect();
    const dropX = event.clientX - canvasRect.left;
    const dropY = event.clientY - canvasRect.top;
  


    switch (textStyle) {
      case 'style1.png':
        text = 'HELLO';
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
          text = 'Love you';
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
          text = 'Welcome';
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
          text = 'Enjoy';
          fontFamily = 'kleptocracy';
          fill = 'rgb(255, 0, 85)';
          shadow = '2px 2px 4px rgba(5, 5, 5, 3)';
          break;
  
      case 'style9.png':
          text = 'Welcome To India';
          fontFamily = 'ph';
          fill = 'blue';
          shadow = '2px 2px 4px rgba(255, 20, 147, 0.9)';
          break;
  
      case 'style10.png':
          text = 'Good';
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
    this.addTextWithStyle(text, fontFamily, dropX, dropY, fill, shadow, fontWeight);
  
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

      this.canvas.selection = true;
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
          borderColor: 'blue',
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

  // exportAsJSON() {
  //   if (this.canvas) {
  //     const json = JSON.stringify(this.canvas.toJSON());
  //     const blob = new Blob([json], { type: 'application/json' });
  //     const url = window.URL.createObjectURL(blob);
  
  //     // Create a link element to trigger download
  //     const link = document.createElement('a');
  //     link.href = url;
  //     link.download = 'canvas.json';
  //     link.click();
  
  //     // Clean up
  //     window.URL.revokeObjectURL(url);
  //   }
  // }


  exportAsJSON() {
    if (this.canvas) {
      const tempCanvas = document.createElement('canvas');
      const canvasWidth = this.canvas.width || 0; // Default to 0 if canvas width is undefined
      const canvasHeight = this.canvas.height || 0; // Default to 0 if canvas height is undefined
  
      tempCanvas.width = canvasWidth;
      tempCanvas.height = canvasHeight;
      const tempFabricCanvas = new fabric.Canvas(tempCanvas);
  
      // Set background color or transparency
      if (this.exportTransparentBackground) {
        tempFabricCanvas.backgroundColor = 'rgba(0, 0, 0, 0)'; // Transparent background
      } else {
        tempFabricCanvas.backgroundColor = this.canvas.backgroundColor; // Use original canvas background color
      }
  
      // Clone objects without resizable properties
      this.canvas.getObjects().forEach((obj) => {
        const clone = fabric.util.object.clone(obj);
        clone.setControlsVisibility({ mt: false, mb: false, ml: false, mr: false, bl: false, br: false, tl: false, tr: false });
        tempFabricCanvas.add(clone);
      });
  
      const json = JSON.stringify(tempFabricCanvas.toJSON());
      const blob = new Blob([json], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
  
      // Create a link element to trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = 'canvas.json';
      link.click();
  
      // Clean up
      window.URL.revokeObjectURL(url);
      tempFabricCanvas.dispose();
    }
  }
  
  

  exportAsPNG() {
    if (this.canvas) {
      const tempCanvas = document.createElement('canvas');
      const canvasWidth = this.canvas.width || 0; // Default to 0 if canvas width is undefined
      const canvasHeight = this.canvas.height || 0; // Default to 0 if canvas height is undefined

      tempCanvas.width = canvasWidth;
      tempCanvas.height = canvasHeight;
      const tempFabricCanvas = new fabric.Canvas(tempCanvas);

      // Set background color or transparency
      if (this.exportTransparentBackground) {
        tempFabricCanvas.backgroundColor = 'rgba(0, 0, 0, 0)'; // Transparent background
      } else {
        tempFabricCanvas.backgroundColor = this.canvas.backgroundColor; // Use original canvas background color
      }

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
  

//   private enableDragAndDrop(): void {
//     this.containerElement.addEventListener('dragover', (event) => {
//       event.preventDefault();
//     });

//     this.containerElement.addEventListener('drop', (event) => {
//       event.preventDefault();
//       const file = event.dataTransfer?.files[0];
//       if (file) {
//         this.loadImageFromFile(file);
//    }
// });
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
  onDragOver(event: DragEvent) {
    event.preventDefault();
}


onDrop(event: DragEvent) {
  event.preventDefault();
  event.stopPropagation();
  const dragDataString = event.dataTransfer!.getData("dragmeta");
  console.log(dragDataString)
  if (dragDataString) {
    try {
      const metaObject = JSON.parse(dragDataString);
      const type = metaObject.type;
      const data = metaObject.data;

      if (type === "shapes")
        this.onshapeDrop(data,event);
      else if (type === "image")
        this.ImageonDrop(data,event);
      else if (type === "StylishText")
        this.onTextDrop(data,event);
      else if (type === "Headings")
        this.onHeadingsDrop(data,event);

    } catch (error) {
      console.error("Error parsing drag data:", error);
    }
  } else {
    console.error("No drag data found");
  }
}

addHeadingText(text: string, fontFamily: string, dropX: number, dropY: number, fill: string, shadow: string,fontSize: number,fontWeight: string, ) {
  const newText = new fabric.Textbox(text, {
    left: dropX - (fontSize / 2), // Subtract half of the text's width
    top: dropY - (fontSize / 2),
    fontFamily: fontFamily,
    fill: fill,
    shadow: shadow,
    fontSize: fontSize, // Set the desired font size
    fontWeight: fontWeight,
  });
  
     setTimeout(() => {
  this.canvas.add(newText);
    this.canvas.renderAll();
  }, 200);
}

onHeadingsDrop(data: string, event: DragEvent) {
  event.preventDefault();
  const heading = data;
  let text = '';
  let fontFamily = '';
  let fill = '';
  let shadow = '';
  let fontWeight = '';
  let fontSize: number | null = null; // Initialize fontSize to null
  const canvasRect = (event.target as HTMLElement).getBoundingClientRect();
  const dropX = event.clientX - canvasRect.left;
  const dropY = event.clientY - canvasRect.top;

  switch (heading) {
    case 'Heading':
      text = 'Heading';
      fontFamily = 'roguedash';
      fill = '#007bff';
      shadow = ' 2px 2px 4px rgba(3, 2, 2, 1)';
      fontWeight = '900';
      fontSize = 90; // Font size for heading
      break;
    case 'Subheading':
      text = 'Subheading';
      fontFamily = 'Arial';
      fill = '#00000';
      shadow = '';
      fontWeight = '600';
      fontSize = 60; // Font size for subheading
      break;
    case 'BodyText':
      text = 'BodyText';
      fontFamily = 'Arial';
      fill = '#00000';
      shadow = '';
      fontWeight = '100';
      fontSize = 25; // Font size for body text
      break;
  }

  if (fontSize !== null) {
    this.addHeadingText(text, fontFamily, dropX, dropY, fill, shadow, fontSize, fontWeight);
    this.canvas.renderAll();
  }
}


ImageonDrop(data:string,event: DragEvent,) {
  event.preventDefault();
  const imageURL2 = data;

  this.http.get(imageURL2, { responseType: 'blob' }).subscribe((blob: Blob) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result as string;

      fabric.Image.fromURL(base64Data, (fabricImg) => {
        const canvasWidth = this.canvas.getWidth();
        const canvasHeight = this.canvas.getHeight();
        const imgWidth = fabricImg.width || fabricImg.getScaledWidth();
        const imgHeight = fabricImg.height || fabricImg.getScaledHeight();

     
        if (canvasWidth && canvasHeight) {
    
          if (imgWidth > canvasWidth || imgHeight > canvasHeight) {

            const scale = Math.min(canvasWidth / imgWidth, canvasHeight / imgHeight);
            fabricImg.scale(scale);
          }
        }


        fabricImg.set({
          left: event.offsetX,
          top: event.offsetY,
        });


        this.canvas.add(fabricImg);
        this.canvas.setActiveObject(fabricImg);
        this.canvas.renderAll();

      });
    };
    reader.readAsDataURL(blob);
  });
}

///shape section
onshapeDrop(data: string, event: DragEvent) {
  const shapeName = data;
  let fabricShape: fabric.Object | undefined;

  // Get the canvas element
  const canvasElement = this.canvas.getElement();

  // Get the bounding rectangle of the canvas
  const canvasRect = canvasElement.getBoundingClientRect();

  // Calculate the drop point coordinates relative to the canvas
  const dropX = event.clientX - canvasRect.left - canvasElement.clientLeft;
  const dropY = event.clientY - canvasRect.top - canvasElement.clientTop;


    switch (shapeName) {
        case 'filledcircle':
            fabricShape = new fabric.Circle({
              left: dropX - 50, // Adjust according to your shape's size
              top: dropY - 50, // Adjust according to your shape's size
                fill: 'black',
                stroke: 'black',
                strokeWidth: 2,
                radius: 50,
                selectable: true,

            });
            break;
            case 'emptycircle':
              fabricShape = new fabric.Circle({
                left: dropX - 50, // Adjust according to your shape's size
                top: dropY - 50, // Adjust according to your shape's size
                  fill: '',
                  stroke: 'black',
                  strokeWidth: 2,
                  radius: 50,
                  selectable: true,
              });
              break;
            case 'emptysquare':
              fabricShape = new fabric.Rect({
                left: dropX - 50, // Subtract half of the shape's width
                top: dropY - 50, // Subtract half of the shape's height
                  fill: '',
                  stroke: 'black',
                  strokeWidth: 2,
                  width: 100,
                  height: 100,
              });
              break;
            //   case 'roundedtriangle':
            //     fabricShape = new fabric.Triangle({ 
            //       left: dropX - 50, // Subtract half of the shape's width
            //       top: dropY - 50, // Subtract half of the shape's height
            //         fill: '', // You can specify a color for the fill if needed
            //         stroke: 'black',
            //         strokeWidth: 2,
            //         width: 100,
            //         height: 100,// Specify the height of the triangle
            //     });
            //     break;
            //     case 'filledtriangle':
            //       fabricShape = new fabric.Triangle({ 
            //         left: dropX - 50, // Subtract half of the shape's width
            //         top: dropY - 50, // Subtract half of the shape's height
            //           fill: 'black', // You can specify a color for the fill if needed
            //           stroke: 'black',
            //           strokeWidth: 2,
            //           width: 100,
            //         height: 100, // Specify the height of the triangle
            //       });
            //       break;
            //   case 'filledsquare':
            //     fabricShape = new fabric.Rect({ 
            //       left: dropX - 50, // Subtract half of the shape's width
            //       top: dropY - 50, // Subtract half of the shape's height
            //         fill: 'black',
            //         stroke: 'black',
            //         strokeWidth: 2,
            //         width: 100,
            //         height: 100,
                   
            //     });
            //     break;
            //     case 'roundedsquare':
            //       fabricShape = new fabric.Rect({ 
            //         left: dropX - 50, // Subtract half of the shape's width
            //         top: dropY - 50, // Subtract half of the shape's height
            //           fill: 'black',
            //           stroke: 'black',
            //           strokeWidth: 2,
            //           width: 100,
            //           height: 100,
            //           rx: 4, // Adjust the value to control the roundness of corners
            //           ry: 4, // Adjust the value to control the roundness of corners
                     
            //       });
            //       break;
            //       case 'fouremptystar':
            //         const starPoints1 = [
            //           { x: 0, y: -50 },
            //           { x: 15, y: -15 },
            //           { x: 50, y: 0 },
            //           { x: 15, y: 15 },
            //           { x: 0, y: 50 },
            //           { x: -15, y: 15 },
            //           { x: -50, y: 0 },
            //           { x: -15, y: -15 },
            //         ];
            //         fabricShape = new fabric.Polygon(starPoints1, {
            //           left: dropX - 50, // Subtract half of the shape's width
            //           top: dropY - 50, // Subtract half of the shape's height
            //             fill: '', // You can specify a color for the fill if needed
            //             stroke: 'black',
            //             strokeWidth: 2,
            //         });
            //         break;


            //         case 'halffilledstar':
            //           const starRadius = 50;
            //           const innerRadius = 20;
            //           const numberOfPoints = 5;
            //           const angleIncrement = (2 * Math.PI) / (numberOfPoints * 2);
                  
            //           const outerStarPoints = [];
            //           const innerStarPoints = [];
                  
            //           for (let i = 0; i < numberOfPoints * 2; i++) {
            //             const radius = i % 2 === 0 ? starRadius : innerRadius;
            //             const angle = i * angleIncrement - Math.PI / 2;
                  
            //             const point = {
            //               x: starRadius + radius * Math.cos(angle),
            //               y: starRadius + radius * Math.sin(angle),
            //               stroke: 'black',
            //               strokeWidth: 2,
            //             };
                  
            //             if (i <= numberOfPoints) {
            //               innerStarPoints.push(point);
            //             } else {
            //               outerStarPoints.push(point);
            //             }
            //           }
            //           fabricShape = new fabric.Polygon(innerStarPoints, {
            //             fill: 'black',
            //             stroke: 'black',
            //             strokeWidth: 2,
            //             left: dropX - 50, // Subtract half of the shape's width
            //             top: dropY - 50, // Subtract half of the shape's height
            //           });
            //           break;

            //           case 'filledhexa':
            //           const scaleFactor = 4; // Adjust this scaling factor as needed

            //           // Define hexagon points
            //           const hexagonPoints1 = [
            //               { x: 0, y: -15 },
            //               { x: 13.4, y: -7.5 },
            //               { x: 13.4, y: 7.5 },
            //               { x: 0, y: 15 },
            //               { x: -13.4, y: 7.5 },
            //               { x: -13.4, y: -7.5 }
            //           ];

            //           // Scale hexagon points
            //           const scaledHexagonPoints = hexagonPoints1.map(point => ({
            //               x: point.x * scaleFactor,
            //               y: point.y * scaleFactor
            //           }));

            //           // Create fabric polygon with scaled points
            //           fabricShape = new fabric.Polygon(scaledHexagonPoints, {
            //             left: dropX - 50, // Subtract half of the shape's width
            //             top: dropY - 50, // Subtract half of the shape's height
            //               fill: 'black',
            //               stroke: 'black',
            //               strokeWidth: 2
            //           });
            //           break;

            //           case 'emptyhexa':
            //             const scaleFactorempty = 4; // Adjust this scaling factor as needed
                    
            //             // Define hexagon points
            //             const hexagonPoints = [
            //                 { x: 0, y: -15 },
            //                 { x: 13.4, y: -7.5 },
            //                 { x: 13.4, y: 7.5 },
            //                 { x: 0, y: 15 },
            //                 { x: -13.4, y: 7.5 },
            //                 { x: -13.4, y: -7.5 }
            //             ];
                    
            //             // Scale hexagon points
            //             const scaledHexagonPoints1 = hexagonPoints.map(point => ({
            //                 x: point.x * scaleFactorempty,
            //                 y: point.y * scaleFactorempty
            //             }));
                    
            //             // Create fabric polygon with scaled points
            //             fabricShape = new fabric.Polygon(scaledHexagonPoints1, {
            //               left: dropX - 50, // Subtract half of the shape's width
            //               top: dropY - 50, // Subtract half of the shape's height
            //                 fill: '',
            //                 stroke: 'black',
            //                 strokeWidth: 2
            //             });
            //             break;
                        
                        
            //           case 'halfstarempty':
            //             const starRadius5 = 50;
            //             const innerRadius5 = 20;
            //             const numberOfPoints5 = 5;
            //             const angleIncrement5 = (2 * Math.PI) / (numberOfPoints5 * 2);
                    
            //             const outerStarPoints5 = [];
            //             const innerStarPoints5 = [];
                    
            //             for (let i = 0; i < numberOfPoints5 * 2; i++) {
            //               const radius = i % 2 === 0 ? starRadius5 : innerRadius5;
            //               const angle = i * angleIncrement5 - Math.PI / 2;
                    
            //               const point = {
            //                 x: starRadius5 + radius * Math.cos(angle),
            //                 y: starRadius5 + radius * Math.sin(angle),
            //         stroke: 'black',
            //                 strokeWidth: 2,
            //               };
                    
            //               if (i <= numberOfPoints5) {
            //                 innerStarPoints5.push(point);
            //               } else {
            //                 outerStarPoints5.push(point);
            //               }
            //             }
            //             fabricShape = new fabric.Polygon(innerStarPoints5, {
            //               fill: '',
            //               stroke: 'black',
            //               strokeWidth: 3,
            //               left: dropX - 50, // Subtract half of the shape's width
            //               top: dropY - 50, // Subtract half of the shape's height
            //             });

            //             break;

            //             case 'emptystar':
            //             const starRadius6 = 50;
            //             const innerRadius6 = 20;
            //             const numberOfPoints6 = 5;
            //             const angleIncrement6 = (2 * Math.PI) / (numberOfPoints6 * 2);
                    
            //             const starPoints6 = [];
                    
            //             for (let i = 0; i < numberOfPoints6 * 2; i++) {
            //               const radius = i % 2 === 0 ? starRadius6 : innerRadius6;
            //               const angle = i * angleIncrement6 - Math.PI / 2;
                    
            //               const point = {
            //                 x: starRadius6 + radius * Math.cos(angle),
            //                 y: starRadius6 + radius * Math.sin(angle),
            //                 stroke: 'blue',
            //                 strokeWidth: 2,
            //               };
                    
            //               starPoints6.push(point);
            //             }
                    
            //             fabricShape = new fabric.Polygon(starPoints6, {
            //               fill: '',
            //               stroke : 'black',
            //               strokeWidth: 2,
            //               left: dropX - 50, // Subtract half of the shape's width
            //               top: dropY - 50, // Subtract half of the shape's height
            //             });

            //             break;

            //             case 'fullfilledstar':
            //             const starRadius7 = 50;
            //             const innerRadius7 = 20;
            //             const numberOfPoints7= 5;
            //             const angleIncrement7 = (2 * Math.PI) / (numberOfPoints7 * 2);
                    
            //             const starPoints7 = [];
                    
            //             for (let i = 0; i < numberOfPoints7 * 2; i++) {
            //               const radius = i % 2 === 0 ? starRadius7 : innerRadius7;
            //               const angle = i * angleIncrement7 - Math.PI / 2;
                    
            //               const point = {
            //                 x: starRadius7 + radius * Math.cos(angle),
            //                 y: starRadius7 + radius * Math.sin(angle),
            //                 stroke: 'blue',
            //                 strokeWidth: 2,
            //               };
                    
            //               starPoints7.push(point);
            //             }
                    
            //             fabricShape = new fabric.Polygon(starPoints7, {
            //               fill: 'black',
            //               stroke : 'black',
            //               strokeWidth: 2,
            //               left: dropX - 50, // Subtract half of the shape's width
            //               top: dropY - 50, // Subtract half of the shape's height
            //             });
                    
            //             break;

                        
            //             // case 'halfemptystar':
            //             //   const svgUrl = '/assets/Svgs/halfstar.svg';

            //             // fabric.loadSVGFromURL(svgUrl, (objects, options) => {
            //             //   const [halfFilledStar] = objects as fabric.Object[];

            //             //   // Adjust the scale to make the star smaller
            //             //   const scaleRatio = 4.0; // Change this value as needed
            //             //   halfFilledStar.scaleX = scaleRatio;
            //             //   halfFilledStar.scaleY = scaleRatio;

            //             //   halfFilledStar.set({
            //             //     left: dropX - 50, // Subtract half of the shape's width
            //             //     top: dropY - 50, // Subtract half of the shape's height
            //             //   });
                          
            //             // })        
            //             // break;
                    
                  
            //       case 'sevenedgestar':
            //         const starRadius1 = 50;
            //         const innerRadius1 = 20;
            //         const numberOfPoints1 = 7;
            //         const angleIncrement1 = (2 * Math.PI) / numberOfPoints1;
                
            //         const starPoints = [];
                
            //         for (let i = 0; i < numberOfPoints1 * 2; i++) {
            //           const radius = i % 2 === 0 ? starRadius1 : innerRadius1;
            //           const angle = i * angleIncrement1 - Math.PI / 2;
                
            //           const point = {
            //             x: starRadius1 + radius * Math.cos(angle),
            //             y: starRadius1 + radius * Math.sin(angle),
            //           };
                
            //           starPoints.push(point);
            //         }

            //       fabricShape = new fabric.Polygon(starPoints, {
            //         fill: '',
            //         stroke :'black',
            //         strokeWidth: 2,
            //         left: dropX - 50, // Subtract half of the shape's width
            //         top: dropY - 50, // Subtract half of the shape's height
            //       });
            //       break;

        default:
            console.error('Unknown shape:', shapeName);
            return;
    }

    if (fabricShape) {
      
        this.canvas.add(fabricShape);
        this.canvas.setActiveObject(fabricShape);
        
    }
}


// toggleShapeBorderStyle() {
//   const activeObject = this.canvas.getActiveObject();
//   if (activeObject instanceof fabric.Object) {
//     if (activeObject.strokeDashArray && activeObject.strokeDashArray.length > 0) {
//       // If shape already has dashed border, remove the dashed border
//       activeObject.set('strokeDashArray', []);
//     } else {
//       // If shape doesn't have dashed border, add dashed border
//       activeObject.set('strokeDashArray', [5, 5]); // Set the border line style to dashed
//     }
//     this.canvas.renderAll();
// }
// }


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
    const scaleFactor = textSize / (activeObject.fontSize || 20); // Default font size if undefined
    activeObject.set({
      fontSize: textSize,
      width: (activeObject.width || 200) * scaleFactor // Default width if undefined
    });
    this.selectedTextSize = textSize;
    this.currentTextSize = textSize; // Update currentTextSize
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

// deleteSelectedObject(): void {
//   const activeObject = this.canvas.getActiveObject();
//   if (activeObject) {
//     this.canvas.remove(activeObject);
//     this.canvas.renderAll();
//   }
// }


deleteSelectedObject(): void {
  const activeObjects = this.canvas.getActiveObjects();
  if (activeObjects && activeObjects.length > 0) {
    activeObjects.forEach(obj => {
      this.canvas.remove(obj);
    });
    this.canvas.discardActiveObject(); // Deselect all objects
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

private SendonSelectionChange(event: fabric.IEvent): void {
  const activeObjects = this.canvas.getActiveObjects();
  if (activeObjects.length === 1) {
    // Single object selected
    console.log('Single object selected:', activeObjects[0]);
  } else {
    // No or multiple objects selected
    console.log('No or multiple objects selected');
  }
}

}

