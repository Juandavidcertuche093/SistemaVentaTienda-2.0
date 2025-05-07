import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetalleCompraComponent } from './modal-detalle-compra.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


describe('ModalDetalleCompraComponent', () => {
  let component: ModalDetalleCompraComponent;
  let fixture: ComponentFixture<ModalDetalleCompraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalDetalleCompraComponent],
      providers: [
        provideHttpClientTesting(),
  { provide: MatDialogRef, useValue: jasmine.createSpyObj('MatDialogRef', ['close']) },
  { provide: MAT_DIALOG_DATA, useValue: {} }
]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalDetalleCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
