import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendingcategoriesComponent } from './trendingcategories.component';

describe('TrendingcategoriesComponent', () => {
  let component: TrendingcategoriesComponent;
  let fixture: ComponentFixture<TrendingcategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrendingcategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrendingcategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
