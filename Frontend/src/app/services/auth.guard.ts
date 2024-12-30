import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router); // Inject the Router service
  const user = localStorage.getItem('user');

  if (user) {
    try {
      const parsedUser = JSON.parse(user);
      if (
        parsedUser.username &&
        parsedUser.email &&
        parsedUser.id
      ) {
        return true; // Allow access
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }

  router.navigate(['/']); // Redirect to home or login page if access is denied
  return false; // Deny access
};
