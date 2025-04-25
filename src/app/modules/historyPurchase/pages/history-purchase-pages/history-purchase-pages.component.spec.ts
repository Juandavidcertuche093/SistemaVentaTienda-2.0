import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryPurchasePagesComponent } from './history-purchase-pages.component';

describe('HistoryPurchasePagesComponent', () => {
  let component: HistoryPurchasePagesComponent;
  let fixture: ComponentFixture<HistoryPurchasePagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryPurchasePagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoryPurchasePagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
