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


  
  constructor() { }

  
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
