import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalLoginComponent } from './modal-login.component';
import { AuthUsuarioService } from '../../services/auth-usuario.service';
import { UtilidadService } from '../../../../services/utilidad.service';
import { MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';

import { provideHttpClientTesting } from '@angular/common/http/testing';

fdescribe('ModalLoginComponent', () => {
  let component: ModalLoginComponent;
  let fixture: ComponentFixture<ModalLoginComponent>;
  let authUsuarioServiceSpy: jasmine.SpyObj<AuthUsuarioService>;
  let utilidadServiceSpy: jasmine.SpyObj<UtilidadService>;
  let matDialogRefSpy: jasmine.SpyObj<MatDialogRef<ModalLoginComponent>>;

  beforeEach(async () => {
    authUsuarioServiceSpy = jasmine.createSpyObj('AuthUsuarioService', ['login', 'redirectBasedOnRole']);
    utilidadServiceSpy = jasmine.createSpyObj('UtilidadService', ['mostrarAlerta']);
    matDialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [ModalLoginComponent],
      providers: [
        provideHttpClientTesting(),
        { provide: AuthUsuarioService, useValue: authUsuarioServiceSpy },
        { provide: UtilidadService, useValue: utilidadServiceSpy },
        { provide: MatDialogRef, useValue: matDialogRefSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when empty', () => {
    component.formulariLogin.setValue({ name: '', password: '' });
    expect(component.formulariLogin.invalid).toBeTrue();
  });

  it('should not call login service if form is invalid', () => {
    component.formulariLogin.setValue({ name: '', password: '' });
    component.login();
    expect(authUsuarioServiceSpy.login).not.toHaveBeenCalled();
  });

  it('should show alert on invalid-credentials', () => {
    component.formulariLogin.setValue({ name: 'user', password: '123456' });
    authUsuarioServiceSpy.login.and.returnValue(of('invalid-credentials'));
    component.login();
    expect(utilidadServiceSpy.mostrarAlerta).toHaveBeenCalledWith(
      "contraseña incorrecta. Por favor, verifique sus credenciales e inténtelo nuevamente.",
      "error"
    );
  });

  it('should show alert on user-not-found', () => {
    component.formulariLogin.setValue({ name: 'nouser', password: '123456' });
    authUsuarioServiceSpy.login.and.returnValue(of('user-not-found'));
    component.login();
    expect(utilidadServiceSpy.mostrarAlerta).toHaveBeenCalledWith(
      "El usuario no existe. Verifique el nombre ingresado.",
      "error"
    );
  });

  it('should close modal on server-error', () => {
    component.formulariLogin.setValue({ name: 'user', password: '123456' });
    authUsuarioServiceSpy.login.and.returnValue(of('server-error'));
    component.login();
    expect(matDialogRefSpy.close).toHaveBeenCalled();
  });

  it('should redirect and close modal on success', () => {
    component.formulariLogin.setValue({ name: 'user', password: '123456' });
    authUsuarioServiceSpy.login.and.returnValue(of('success'));
    component.login();
    expect(authUsuarioServiceSpy.redirectBasedOnRole).toHaveBeenCalled();
    expect(matDialogRefSpy.close).toHaveBeenCalledWith('success');
  });
});

