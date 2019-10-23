import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebusersComponent } from './webusers.component';

describe('WebusersComponent', () => {
  let component: WebusersComponent;
  let fixture: ComponentFixture<WebusersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebusersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebusersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
