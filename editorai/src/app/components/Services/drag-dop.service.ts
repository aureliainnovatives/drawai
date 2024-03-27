import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DragDropService {
  private draggedData: any;

  setDraggedData(data: any) {
    this.draggedData = data;
  }

  getDraggedData(): any {
    return this.draggedData;
  }
}
