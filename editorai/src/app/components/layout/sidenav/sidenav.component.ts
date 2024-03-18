import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements AfterViewInit {
  @ViewChild('canvas') canvasElement!: ElementRef 
  panelVisible: boolean = false;
  selectedMenuItem: string | null = null;
  togglePanel(menuItem: string) {
    if (this.selectedMenuItem === menuItem) {
      this.panelVisible = !this.panelVisible;
    } else {
      this.panelVisible = true;
      this.selectedMenuItem = menuItem;
    }
  }

  closePanel() {
    this.panelVisible = false;
    this.selectedMenuItem = null; // Reset the selected menu item when closing the panel
  }

  ngAfterViewInit() {
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas()); 
  }

  resizeCanvas() {
    const footerElement = document.querySelector('app-footer') as HTMLElement;
    if (footerElement && this.canvasElement) { // Check if canvasElement is defined
      const footerHeight = footerElement.offsetHeight;
      this.canvasElement.nativeElement.style.height = `calc(100vh - ${footerHeight}px)`;
    }
  }
}
