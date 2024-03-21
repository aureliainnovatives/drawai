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

  setSelectedColor(color: string) {
    this.selectedColorSubject.next(color);
  }

  setBorderColor(color: string) {
    this.borderColorSubject.next(color);
  }

  getBorderColor(): string {
    return this.borderColorSubject.value;
  }
}
