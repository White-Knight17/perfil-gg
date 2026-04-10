import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  contactForm = {
    name: '',
    email: '',
    subject: '',
    message: '',
  };

  isSubmitting = false;
  showSuccess = false;
  showError = false;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {}

  onSubmit() {
    this.isSubmitting = true;
    this.showError = false;
    this.showSuccess = false;
    this.cdr.detectChanges();

    // Enviamos el formulario a Formspree (fire and forget)
    this.http
      .post('https://formspree.io/f/xreowwza', this.contactForm, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })
      .subscribe({
        next: () => {
          console.log('Email enviado correctamente');
        },
        error: (error) => {
          console.error('Error al enviar:', error);
        },
      });

    // Mostramos éxito después de 2 segundos (UX optimista)
    setTimeout(() => {
      this.isSubmitting = false;
      this.showSuccess = true;
      this.contactForm = { name: '', email: '', subject: '', message: '' };
      this.cdr.detectChanges();
    }, 2000);
  }

  resetForm() {
    this.showError = false;
    this.showSuccess = false;
    this.cdr.detectChanges();
  }
}
