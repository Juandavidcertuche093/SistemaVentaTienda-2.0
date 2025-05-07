import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalImagenproductoComponent } from './modal-imagenproducto.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('ModalImagenproductoComponent', () => {
  let component: ModalImagenproductoComponent;
  let fixture: ComponentFixture<ModalImagenproductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalImagenproductoComponent],
      providers: [
        provideHttpClientTesting(),
        { provide: MatDialogRef, useValue: jasmine.createSpyObj('MatDialogRef', ['close']) },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalImagenproductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
