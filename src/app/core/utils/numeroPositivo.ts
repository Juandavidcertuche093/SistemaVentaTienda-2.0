import { AbstractControl, ValidationErrors } from '@angular/forms';

export function numeroPositivo(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value !== null && value !== undefined && value <= 0) {
        return { positivo: true }; // Retorna un error si el número no es positivo
    }
    return null; // Sin errores
}
