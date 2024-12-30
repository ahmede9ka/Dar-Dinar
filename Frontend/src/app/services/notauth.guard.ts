import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const notauthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router); // Inject Router service
  const user = localStorage.getItem('user');

  if (!user) {
    return true; // Allow access if no user is present
  }

  // Navigate to the current route the user was trying to access
  router.navigate(['/dashboard']); 
  return false; // Deny access
};
