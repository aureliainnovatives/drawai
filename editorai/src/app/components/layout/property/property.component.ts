import { Component } from '@angular/core';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.css']
})
export class PropertyComponent {
  showPropertyPanel: boolean = false;

  closeProperty() {
    // Set showPropertyPanel to false to hide the property panel
    this.showPropertyPanel = false;
  }
}
