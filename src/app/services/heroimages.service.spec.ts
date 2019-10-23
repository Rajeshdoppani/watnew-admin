import { TestBed, inject } from '@angular/core/testing';

import { HeroimagesService } from './heroimages.service';

describe('HeroimagesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HeroimagesService]
    });
  });

  it('should be created', inject([HeroimagesService], (service: HeroimagesService) => {
    expect(service).toBeTruthy();
  }));
});
