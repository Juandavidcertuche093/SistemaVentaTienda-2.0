import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierPagesComponent } from './supplier-pages.component';

describe('SupplierPagesComponent', () => {
  let component: SupplierPagesComponent;
  let fixture: ComponentFixture<SupplierPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierPagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
