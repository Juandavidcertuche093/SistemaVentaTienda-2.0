import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncioPagesComponent } from './incio-pages.component';

describe('IncioPagesComponent', () => {
  let component: IncioPagesComponent;
  let fixture: ComponentFixture<IncioPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncioPagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncioPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
