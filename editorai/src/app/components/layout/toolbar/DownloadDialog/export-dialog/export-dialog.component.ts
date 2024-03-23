import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CanvasComponent } from '../../../canvas/canvas.component';

@Component({
  selector: 'app-export-dialog',
  templateUrl: './export-dialog.component.html',
  styleUrls: ['./export-dialog.component.css']
})
export class ExportDialogComponent implements OnInit {

  
  exportTransparentBackground: boolean = false;
  constructor( @Inject(MAT_DIALOG_DATA) public canvasComponent: CanvasComponent,public dialogRef: MatDialogRef<ExportDialogComponent>) {}

  ngOnInit(): void {}

  exportAsPNG() {
    this.canvasComponent.exportTransparentBackground = this.exportTransparentBackground;
    this.canvasComponent.exportAsPNG();
    this.dialogRef.close();
  }

  exportAsJSON() {
    this.canvasComponent.exportAsJSON();
    this.dialogRef.close();
  }

}
