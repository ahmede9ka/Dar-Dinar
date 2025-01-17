import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent implements OnInit{
  
  userName: string = 'Guest';
  userPhotoUrl: string = '/assets/default-profile.png'; // Default profile picture

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  // Load user data from localStorage

  loadUserData(): void {
    
    const baseImageUrl = 'http://127.0.0.1:8000/uploads/';
      const user = JSON.parse(localStorage.getItem('user') || '{}'); // Parse the stored user object
      console.log(user);
      if (user) {
      
        this.userName = user.username || 'User';
        
        this.userPhotoUrl = `${baseImageUrl}${user.image}`;
      }
  }

    logout(){
      localStorage.clear();
      this.router.navigateByUrl('/login');
    }
}
