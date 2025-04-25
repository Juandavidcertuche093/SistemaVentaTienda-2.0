import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuysPagesComponent } from './buys-pages.component';

describe('BuysPagesComponent', () => {
  let component: BuysPagesComponent;
  let fixture: ComponentFixture<BuysPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuysPagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuysPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
