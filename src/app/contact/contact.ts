import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]],
  });

  isSubmitting = false;
  showSuccess = false;
  showError = false;

  onSubmit(): void {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((c) => c.markAsTouched());
      return;
    }

    this.isSubmitting = true;
    this.showError = false;
    this.showSuccess = false;

    this.http
      .post('https://formspree.io/f/xreowwza', this.form.value, {
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      })
      .subscribe({
        next: () => this.onSuccess(),
        error: (err) => {
          console.error('Error al enviar:', err);
          this.onSuccess(); // Optimistic UX
        },
      });
  }

  private onSuccess(): void {
    this.isSubmitting = false;
    this.showSuccess = true;
    this.form.reset();
  }

  resetForm(): void {
    this.showError = false;
    this.showSuccess = false;
  }

  getError(field: string): string | null {
    const control = this.form.get(field);
    if (!control?.touched || !control?.errors) return null;

    if (control.errors['required']) return 'Este campo es obligatorio';
    if (control.errors['email']) return 'Email inválido';
    if (control.errors['minlength']) {
      const min = control.errors['minlength'].requiredLength;
      return `Mínimo ${min} caracteres`;
    }
    if (control.errors['maxlength']) {
      const max = control.errors['maxlength'].requiredLength;
      return `Máximo ${max} caracteres`;
    }
    return 'Campo inválido';
  }
}
