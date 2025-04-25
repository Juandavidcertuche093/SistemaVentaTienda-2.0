import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesPagesComponent } from './sales-pages.component';

describe('SalesPagesComponent', () => {
  let component: SalesPagesComponent;
  let fixture: ComponentFixture<SalesPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesPagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
