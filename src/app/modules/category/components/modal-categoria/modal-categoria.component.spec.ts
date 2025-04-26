import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCategoriaComponent } from './modal-categoria.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('ModalCategoriaComponent', () => {
  let component: ModalCategoriaComponent;
  let fixture: ComponentFixture<ModalCategoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCategoriaComponent],
      providers: [
        provideHttpClientTesting(),
        { provide: MatDialogRef, useValue: jasmine.createSpyObj('MatDialogRef', ['close']) },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalCategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
