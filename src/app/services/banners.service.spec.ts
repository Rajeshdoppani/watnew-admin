import { TestBed, inject } from '@angular/core/testing';

import { BannersService } from './banners.service';

describe('BannersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BannersService]
    });
  });

  it('should be created', inject([BannersService], (service: BannersService) => {
    expect(service).toBeTruthy();
  }));
});
