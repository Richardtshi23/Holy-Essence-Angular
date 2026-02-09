import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

  currentYear: number = new Date().getFullYear();

  constructor() { }

  subscribeToNewsletter(): void {
    // This is a placeholder. You would add your API call to your
    // email service (like Klaviyo or Dotdigital) here.
    console.log('Newsletter subscription form submitted!');
    alert('Thank you for subscribing to our blessed community!');
  }
}
