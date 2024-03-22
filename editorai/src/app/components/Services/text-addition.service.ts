import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { fabric } from 'fabric';
@Injectable({
  providedIn: 'root'
})
export class TextAdditionService {
  textEdited: Subject<string> = new Subject<string>();
  addTextWithStyle = new Subject<{ text: string, fontFamily: string, fill: string, shadow: string }>();
  editText(newText: string) {
    this.textEdited.next(newText);
  }
  constructor() { }
}