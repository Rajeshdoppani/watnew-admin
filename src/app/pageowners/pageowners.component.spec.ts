import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageownersComponent } from './pageowners.component';

describe('PageownersComponent', () => {
  let component: PageownersComponent;
  let fixture: ComponentFixture<PageownersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageownersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageownersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
