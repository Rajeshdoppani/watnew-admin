import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbusepostsComponent } from './abuseposts.component';

describe('AbusepostsComponent', () => {
  let component: AbusepostsComponent;
  let fixture: ComponentFixture<AbusepostsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbusepostsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbusepostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
