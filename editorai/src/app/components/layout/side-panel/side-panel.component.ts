// sidepanel.component.ts

import { Component,Renderer2, Input, Output, EventEmitter, ElementRef, AfterViewInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CanvasSizeService } from '../../Services/canvas-size.service';

@Component({
  selector: 'app-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.css'],

})

export class SidePanelComponent  {
  @Input() panelVisible: boolean = false;
  @Input() selectedMenuItem: string | null = null; 
  @Output() closePanel: EventEmitter<void> = new EventEmitter<void>();
  @Output() addText: EventEmitter<string> = new EventEmitter<string>(); // New event emitter for adding text
  @Output() shapeDragged: EventEmitter<string> = new EventEmitter<string>();
  @Output() addTextToCanvas: EventEmitter<string> = new EventEmitter<string>()


  selectedImage: { name: string, data: string } | null = null;
  selectedTab: string = '';
  searchTerm: string = '';
  enteredText:string = '';
  showProgressBar: boolean = false;
  textStyles: string[] = ['style1.png', 'style2.png', 'style3.png', 'style4.png','style5.png','style6.png','style7.png','style8.png','style9.png','style10.png','style11.png'];
 
 
  // Squares: string[] = ['emptysquare', 'filledsquare', 'roundedsquare'];
  // Circles: string[] = ['filledcircle', 'emptycircle'];
  // Triangles: string[] = ['filledtriangle','emptytriangle','roundedtriangle'];
  // Hexagons: string[] = ['filledhexa','emptyhexa'];
  // Stars: string[] = ['emptystar','fullfilledstar', 'fouremptystar','sevenedgestar','halfemptystar','halfstarempty','halffilledstar'];


  // shapesIcons: string[] = [...this.Squares, ...this.Circles, ...this.Triangles,...this.Hexagons , ...this.Stars ];
  

  shapeIconsMapping: { [key: string]: string } = {
    emptysquare: 'assets/icons/rectangle.svg',
    filledsquare: 'assets/icons/filledsquare.svg',
    roundedsquare: 'assets/icons/roundedsquare.svg',
    filledcircle: 'assets/icons/filledcircle.svg',
    emptycircle: 'assets/icons/Circle2.svg',
    filledtriangle: 'assets/icons/filledtriangle.svg',
    emptytriangle: 'assets/icons/emptytriangle.svg',
    filledhexa: 'assets/icons/filledhexa.svg',
    emptyhexa: 'assets/icons/emptyhexa.svg',
    roundedtriangle: 'assets/icons/roundedtriangle.svg',
    emptystar: 'assets/icons/emptystar.svg',
    fouremptystar: 'assets/icons/fouremptystar.svg',
    sevenedgestar: 'assets/icons/sevenedgestar.svg',
    halfemptystar: 'assets/icons/halfemptystar.svg',
    halfstarempty: 'assets/icons/halfstarempty.svg',
    halffilledstar: 'assets/icons/halffilledstar.svg',
    fullfilledstar: 'assets/icons/fullfilledstar.svg',
  };

  get filteredShapeArrays() {
    if (!this.searchTerm.trim()) {
      return this.shapeArrays;
    }
    return this.shapeArrays.map(shapeArray => ({
      ...shapeArray,
      shapes: shapeArray.shapes.filter(shape => shape.name.toLowerCase().includes(this.searchTerm.trim().toLowerCase()))
    })).filter(shapeArray => shapeArray.shapes.length > 0);
  }


 shapeArrays: { category: string, shapes: { name: string, icon: string }[] }[] = [
    { 
      category: 'Squares', 
      shapes: [
        { name: 'emptysquare', icon: this.shapeIconsMapping['emptysquare'] },
        { name: 'filledsquare', icon: this.shapeIconsMapping['filledsquare'] },
        { name: 'roundedsquare', icon: this.shapeIconsMapping['roundedsquare'] }
      ]
    },
    { 
      category: 'Circles', 
      shapes: [
        { name: 'filledcircle', icon: this.shapeIconsMapping['filledcircle'] },
        { name: 'emptycircle', icon: this.shapeIconsMapping['emptycircle'] },
       
      ]
    },
    { 
      category: 'Triangles', 
      shapes: [
        { name: 'filledtriangle', icon: this.shapeIconsMapping['filledtriangle'] },
        { name: 'emptytriangle', icon: this.shapeIconsMapping['emptytriangle'] },
        { name: 'roundedtriangle', icon: this.shapeIconsMapping['roundedtriangle'] }
      ]
    }, { 
      category: 'Hexagons', 
      shapes: [
        { name: 'filledhexa', icon: this.shapeIconsMapping['filledhexa'] },
        { name: 'emptyhexa', icon: this.shapeIconsMapping['emptyhexa'] }
      ]
    },
    { 
      category: 'Stars', 
      shapes: [
        { name: 'emptystar', icon: this.shapeIconsMapping['emptystar'] },
        { name: 'fullfilledstar', icon: this.shapeIconsMapping['fullfilledstar'] },
        { name: 'fouremptystar', icon: this.shapeIconsMapping['fouremptystar'] },
        { name: 'sevenedgestar', icon: this.shapeIconsMapping['sevenedgestar'] },
        { name: 'halfemptystar', icon: this.shapeIconsMapping['halfemptystar'] },
        { name: 'halfstarempty', icon: this.shapeIconsMapping['halfstarempty'] },
        { name: 'halffilledstar', icon: this.shapeIconsMapping['halffilledstar'] },
        { name: 'emptystar', icon: this.shapeIconsMapping['emptystar'] },
        { name: 'fullfilledstar', icon: this.shapeIconsMapping['fullfilledstar'] },
        { name: 'fouremptystar', icon: this.shapeIconsMapping['fouremptystar'] },
        { name: 'sevenedgestar', icon: this.shapeIconsMapping['sevenedgestar'] },
        { name: 'halfemptystar', icon: this.shapeIconsMapping['halfemptystar'] },
        { name: 'halfstarempty', icon: this.shapeIconsMapping['halfstarempty'] },
        { name: 'halffilledstar', icon: this.shapeIconsMapping['halffilledstar'] },
        

        
      ]
    },
  ];


  constructor(private renderer: Renderer2, private el: ElementRef, private canvasSizeService : CanvasSizeService) {}
  onDragStart(event: DragEvent, shape: string) {
    event.dataTransfer!.setData('text/plain', shape);
  }
  ImageonDragStart(event: DragEvent, imageData: string) {
    event.dataTransfer!.setData('text/plain', imageData);
  }
  
  



  // onTabSelected(tab: string) {
  //   this.selectedTab = tab;
  // }
  // get contentToShow(): string {
  //   switch (this.selectedMenuItem) {
  //     case 'shapes':
  //       return 'Shapes content goes here';
  //     case 'text':
  //       return 'Text content goes here';
  //     case 'images':
  //       return 'Text content goes here';  
  //     default:
  //       return '';
  //   }
  // }

  
  
  // Image section //
  onImageSelect(event: any) {
    const inputElement = event.target as HTMLInputElement;
    const files = inputElement.files;
  
    if (files && files.length > 0) {
      // Check if a category is selected, if not, create a new category
      if (!this.selectedTab) {
        const newCategory = {
          category: 'Added Images',
          images: [] as { name: string; data: any }[], // Explicitly type images array
        };
  
        // Add each selected image to the new category
        const promises: Promise<any>[] = [];
  
        for (let i = 0; i < files.length; i++) {
          promises.push(this.getImageData(files[i]));
        }
  
        Promise.all(promises).then(images => {
          newCategory.images = images;
          this.imageCategories.unshift(newCategory);
          this.selectedTab = 'Added Images';
        });
      } else {
        // Find the selected category and add each selected image to it
        const selectedCategory = this.imageCategories.find(cat => cat.category === this.selectedTab);
  
        if (selectedCategory) {
          const promises: Promise<any>[] = [];
  
          for (let i = 0; i < files.length; i++) {
            promises.push(this.getImageData(files[i]));
          }
  
          Promise.all(promises).then(images => {
            selectedCategory.images = selectedCategory.images.concat(images);
          });
        }
      }
  
      this.selectedImage = null;
      inputElement.value = '';
    }
  }
  
  // Helper method to get image data as a Promise
  getImageData(file: File): Promise<{ name: string; data: any }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = (e: any) => {
        const selectedImage = { name: file.name, data: e.target.result };
        resolve(selectedImage);
      };
  
      reader.onerror = (error) => {
        reject(error);
      };
  
      reader.readAsDataURL(file);
    });
  }
  


openImageSelector() {
  const imageInput = document.getElementById('imageInput');
  
  if (imageInput) {
   
    imageInput.click();
  }

}

onDrop(event: any) {
  event.preventDefault();
  const files = event.dataTransfer.files;
  if (files.length > 0) {
    this.readAndAddImages(files);
    this.showProgressBar = false; 
  }
}


onDragOver(event: any) {
  event.preventDefault();
  
}

readAndAddImages(files: FileList) {
  for (let i = 0; i < files.length; i++) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const newImage = { name: files[i].name, data: e.target.result };
      this.addImageToCategory(newImage);
    };
    reader.readAsDataURL(files[i]);
  }
}
addImageToCategory(newImage: { name: string, data: string }) {
  setTimeout(() => {
    if (!this.selectedTab) {
      const newCategory = {
        category: 'Added Images', // You can set a default name for the new category
        images: [newImage],
      };
      this.imageCategories.unshift(newCategory); // Add the new category at the beginning
      this.selectedTab = 'New Category'; // Select the new category
    } else {
      // Find the selected category and add the image to it
      const selectedCategory = this.imageCategories.find(cat => cat.category === this.selectedTab);
      if (selectedCategory) {
        selectedCategory.images.push(newImage);
      }
    }
  }, 2000);
}


imageCategories: { category: string, images: { name: string, data: string }[] }[] = [
  {
    category: 'Sky',
    images: [
      { name: 'Image 1', data: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQV6-DQF2pBwNFV9KzPafu9RghrNF1tZ8J3AA&usqp=CAU' },
      { name: 'Image 2', data: 'https://wallpaper-mania.com/wp-content/uploads/2018/09/High_resolution_wallpaper_background_ID_77701311660.jpg' },
    ]
  },
    {
      category: 'Nature',
      images: [
        { name: 'Image 3', data:   'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8P6m-zeDwC2oDBWDtvjSXnst2h2jKfdpbGw&usqp=CAU' },
        { name: 'Image 4', data:   'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5Nmh54qJsJQ1VabUohmNHyGvZdK58zalFxg&usqp=CAU'},
        { name: 'Image 5', data:   'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTILI-pwHf8xieo5W7YKa4_4GzUd1O2_T_Z3w&usqp=CAU' },
        { name: 'Image 3', data:   'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8P6m-zeDwC2oDBWDtvjSXnst2h2jKfdpbGw&usqp=CAU' },
        { name: 'Image 4', data:   'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5Nmh54qJsJQ1VabUohmNHyGvZdK58zalFxg&usqp=CAU'},
        { name: 'Image 3', data:   'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8P6m-zeDwC2oDBWDtvjSXnst2h2jKfdpbGw&usqp=CAU' },
        { name: 'Image 4', data:   'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5Nmh54qJsJQ1VabUohmNHyGvZdK58zalFxg&usqp=CAU'},
        { name: 'Image 3', data:   'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8P6m-zeDwC2oDBWDtvjSXnst2h2jKfdpbGw&usqp=CAU' },
        { name: 'Image 4', data:   'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5Nmh54qJsJQ1VabUohmNHyGvZdK58zalFxg&usqp=CAU'},
        { name: 'Image 3', data:   'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8P6m-zeDwC2oDBWDtvjSXnst2h2jKfdpbGw&usqp=CAU' },
        { name: 'Image 4', data:   'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5Nmh54qJsJQ1VabUohmNHyGvZdK58zalFxg&usqp=CAU'},
        { name: 'Image 3', data:   'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8P6m-zeDwC2oDBWDtvjSXnst2h2jKfdpbGw&usqp=CAU' },
        { name: 'Image 4', data:   'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5Nmh54qJsJQ1VabUohmNHyGvZdK58zalFxg&usqp=CAU'},
        { name: 'Image 3', data:   'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8P6m-zeDwC2oDBWDtvjSXnst2h2jKfdpbGw&usqp=CAU' },
        { name: 'Image 4', data:   'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5Nmh54qJsJQ1VabUohmNHyGvZdK58zalFxg&usqp=CAU'},
      ]
    },
   
  ];

  // imageArray: string[] = [
  //   'https://wallpapers.com/images/hd/view-background-ol6fhyqp5s0knpmg.jpg',
  //   'https://wallpaper-mania.com/wp-content/uploads/2018/09/High_resolution_wallpaper_background_ID_77701311660.jpg',
  //   'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8P6m-zeDwC2oDBWDtvjSXnst2h2jKfdpbGw&usqp=CAU',
  //   'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6GW5opwRtJPQBEC5ahDV0MZBzt7VOHejHnw&usqp=CAU'
  //   // Add more image paths as needed
  // ];


//Text section

addEnteredText() {
  this.canvasSizeService.addTextToCanvas(this.enteredText);
  this.enteredText = ''; // Clear the input field after emitting the text
}

addTextToCanvasFromSidePanel(text: string) {
  this.addTextToCanvas.emit(text);
}


}




