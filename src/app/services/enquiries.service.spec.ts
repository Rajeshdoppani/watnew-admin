import { TestBed, inject } from '@angular/core/testing';

import { EnquiriesService } from './enquiries.service';

describe('EnquiriesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EnquiriesService]
    });
  });

  it('should be created', inject([EnquiriesService], (service: EnquiriesService) => {
    expect(service).toBeTruthy();
  }));
});
