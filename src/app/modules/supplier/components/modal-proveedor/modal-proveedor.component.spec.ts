import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalProveedorComponent } from './modal-proveedor.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('ModalProveedorComponent', () => {
  let component: ModalProveedorComponent;
  let fixture: ComponentFixture<ModalProveedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ModalProveedorComponent
      ],
      providers: [
        provideHttpClientTesting(),
        { provide: MatDialogRef, useValue: jasmine.createSpyObj('MatDialogRef', ['close']) },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
