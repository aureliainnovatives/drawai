import { TestBed } from '@angular/core/testing';

import { CanvasselectionService } from './canvasselection.service';

describe('CanvasselectionService', () => {
  let service: CanvasselectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CanvasselectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
