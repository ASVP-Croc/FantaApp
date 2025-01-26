import { TestBed } from '@angular/core/testing';

import { MatchdaysService } from './matchdays.service';

describe('MatchdaysService', () => {
  let service: MatchdaysService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatchdaysService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
