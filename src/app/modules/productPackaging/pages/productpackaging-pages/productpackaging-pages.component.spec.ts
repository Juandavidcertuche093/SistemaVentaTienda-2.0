import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductpackagingPagesComponent } from './productpackaging-pages.component';

describe('ProductpackagingPagesComponent', () => {
  let component: ProductpackagingPagesComponent;
  let fixture: ComponentFixture<ProductpackagingPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductpackagingPagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductpackagingPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
