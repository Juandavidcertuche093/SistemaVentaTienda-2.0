import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalProductoempaqueComponent } from './modal-productoempaque.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe('ModalProductoempaqueComponent', () => {
  let component: ModalProductoempaqueComponent;
  let fixture: ComponentFixture<ModalProductoempaqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ModalProductoempaqueComponent,
        provideHttpClientTesting() // <-- aquí, no en providers
      ],
      providers: [
        { provide: MatDialogRef, useValue: jasmine.createSpyObj('MatDialogRef', ['close']) },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalProductoempaqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
