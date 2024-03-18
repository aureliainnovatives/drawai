import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CanvasComponent } from '../canvas/canvas.component';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  zoomLevel = 100;
  constructor(private canvasComponent: CanvasComponent) { }

  ngOnInit() {
    this.canvasComponent.onZoomSliderChange(this.zoomLevel);
  }
  onZoomSliderChange(value: number) {
    this.zoomLevel = value;
    this.canvasComponent.onZoomSliderChange(value);
  }
  formatTooltip(value: number) {
    return `${value}%`;
  }
}