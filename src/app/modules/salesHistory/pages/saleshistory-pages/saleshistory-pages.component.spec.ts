import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleshistoryPagesComponent } from './saleshistory-pages.component';

describe('SaleshistoryPagesComponent', () => {
  let component: SaleshistoryPagesComponent;
  let fixture: ComponentFixture<SaleshistoryPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaleshistoryPagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleshistoryPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
