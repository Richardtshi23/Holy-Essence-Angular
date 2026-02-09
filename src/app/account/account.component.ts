import { Component, OnInit } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { Router} from '@angular/router';

@Component({
  selector: 'app-account',
  standalone: false,
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit {
  userName: string | null = null;

  constructor(private AuthService: AuthService, private router: Router) { }

  ngOnInit(): void {
    // When the component loads, we attempt to get the logged-in user's details.
    // This is necessary to display their name in the new premium header.
    this.AuthService.getUser().subscribe({
      next: (user: any) => {
        // We check for a 'fullName' or 'username' property on the user object.
        // Adjust 'user.fullName' or 'user.username' if your user object uses a different property name.
        if (user) {
          this.userName = user.fullName || user.username || 'Believer';
        }
      },
      error: (err) => {
        // If there's an error fetching the user (e.g., token is expired or invalid),
        // it's a good security practice to log them out and redirect to the login page.
        console.error('Failed to get user details, redirecting to login.', err);
        this.AuthService.logout(); // It's good practice to clear any invalid tokens
        this.router.navigate(['/login']);
      }
    });
  }

  public logOut(): void {
    this.AuthService.logout().subscribe(response => {
      this.router.navigate(['/']);
    })
  }
}
