import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriPageComponent } from './categori-page.component';

describe('CategoriPageComponent', () => {
  let component: CategoriPageComponent;
  let fixture: ComponentFixture<CategoriPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
