import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})

export class CanvasSizeService {
  private textToAddSubject = new Subject<string>();
  textToAdd$ = this.textToAddSubject.asObservable();

  addTextToCanvas(text: string) {
    this.textToAddSubject.next(text);
}
}