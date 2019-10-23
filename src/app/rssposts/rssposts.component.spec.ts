import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RsspostsComponent } from './rssposts.component';

describe('RsspostsComponent', () => {
  let component: RsspostsComponent;
  let fixture: ComponentFixture<RsspostsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RsspostsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RsspostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
