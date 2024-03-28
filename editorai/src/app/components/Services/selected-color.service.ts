// selected-color.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectedColorService {
  private borderColorSubject = new BehaviorSubject<string>('#000000');
  borderColor$ = this.borderColorSubject.asObservable();


  private selectedColorSubject = new BehaviorSubject<string>('#000000');
  selectedColor$ = this.selectedColorSubject.asObservable();


  private canvasColorSubject = new BehaviorSubject<string>('#ffffff');
  canvasColor$ = this.canvasColorSubject.asObservable();

  private selectedBorderStyleSubject: BehaviorSubject<string> = new BehaviorSubject<string>('solid');
  selectedBorderStyle$ = this.selectedBorderStyleSubject.asObservable();

  
  constructor() { }

  setSelectedBorderStyle(borderStyle: string): void {
    this.selectedBorderStyleSubject.next(borderStyle);
  }
  
  setSelectedColor(color: string) {
    this.selectedColorSubject.next(color);
  }

  setBorderColor(color: string) {
    this.borderColorSubject.next(color);
  }

  getBorderColor(): string {
    return this.borderColorSubject.value;
  }



  updateCanvasColor(color: string) {
    this.canvasColorSubject.next(color);
  }
}