import { TestBed } from '@angular/core/testing';

import { MasroufService } from './masrouf.service';

describe('MasroufService', () => {
  let service: MasroufService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MasroufService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
