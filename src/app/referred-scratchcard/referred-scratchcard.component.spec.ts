import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferredScratchcardComponent } from './referred-scratchcard.component';

describe('ReferredScratchcardComponent', () => {
  let component: ReferredScratchcardComponent;
  let fixture: ComponentFixture<ReferredScratchcardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferredScratchcardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferredScratchcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
