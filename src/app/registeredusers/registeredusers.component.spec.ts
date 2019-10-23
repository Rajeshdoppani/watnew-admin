import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisteredusersComponent } from './registeredusers.component';

describe('RegisteredusersComponent', () => {
  let component: RegisteredusersComponent;
  let fixture: ComponentFixture<RegisteredusersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisteredusersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisteredusersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
