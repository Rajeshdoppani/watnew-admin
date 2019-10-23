import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroimagesComponent } from './heroimages.component';

describe('HeroimagesComponent', () => {
  let component: HeroimagesComponent;
  let fixture: ComponentFixture<HeroimagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeroimagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroimagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
