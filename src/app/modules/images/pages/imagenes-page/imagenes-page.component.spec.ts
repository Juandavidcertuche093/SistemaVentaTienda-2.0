import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagenesPageComponent } from './imagenes-page.component';

describe('ImagenesPageComponent', () => {
  let component: ImagenesPageComponent;
  let fixture: ComponentFixture<ImagenesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImagenesPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImagenesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
