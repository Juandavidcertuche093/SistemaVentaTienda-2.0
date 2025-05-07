import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetalleVentaComponent } from './modal-detalle-venta.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


describe('ModalDetalleVentaComponent', () => {
  let component: ModalDetalleVentaComponent;
  let fixture: ComponentFixture<ModalDetalleVentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalDetalleVentaComponent],
      providers: [
        provideHttpClientTesting(),
  { provide: MatDialogRef, useValue: jasmine.createSpyObj('MatDialogRef', ['close']) },
  { provide: MAT_DIALOG_DATA, useValue: {} }
]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalDetalleVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
