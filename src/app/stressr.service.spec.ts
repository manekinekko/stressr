import { TestBed } from '@angular/core/testing';

import { StressrService } from './stressr.service';

describe('StressrService', () => {
  let service: StressrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StressrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
