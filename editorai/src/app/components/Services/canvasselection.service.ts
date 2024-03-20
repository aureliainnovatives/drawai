import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CanvasSelectionService {
  private selectionTypeSubject: BehaviorSubject<string> = new BehaviorSubject<string>('none');
  selectionType$ = this.selectionTypeSubject.asObservable();

  setSelectionType(type: string) {
    this.selectionTypeSubject.next(type);
}
}