import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CanvasComponent } from '../canvas/canvas.component';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  zoomLevel = 100;
  constructor(private canvasComponent: CanvasComponent) {
    // Subscribe to the zoom level change event emitted by CanvasComponent
    this.canvasComponent.zoomLevelChanged.subscribe((zoomLevel: number) => {
      this.zoomLevel = zoomLevel;
    });
  }
  
  onZoomSliderChange(value: number) {
    this.zoomLevel = value;
    this.canvasComponent.onZoomSliderChange(value);
  }
  formatTooltip(value: number) {
    return `${value}%`;
  }
}