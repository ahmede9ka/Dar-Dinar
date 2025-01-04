import { Component } from '@angular/core';
import { SideBarComponent } from "../side-bar/side-bar.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [SideBarComponent,CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  isModalVisible = false;
  profilePhoto = 'https://via.placeholder.com/150';
  userName: any;
  userPhotoUrl: any;
  useremail: any;
  usersex: any;
  userbirth: any;
  constructor() {
    this.loadProfile(); // Call loadProfile on component initialization
  }
  profileImageUrl: string = 'https://via.placeholder.com/150'; // Default profile image URL
  coverImageUrl: string = 'https://images.unsplash.com/photo-1449844908441-8829872d2607?crop=entropy&cs=tinysrgb&fit=max&fm=jpg'; // Default cover image URL

  // Method to handle profile photo change
  onProfileImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImageUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  // Method to handle cover photo change
  onCoverImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.coverImageUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
  onChangePhoto() {
    // Trigger file input to change profile photo
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    fileInput.click();
  }
  loadProfile() {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);

      this.userName = user.username || this.userName;
      this.useremail = user.email || this.useremail;
      this.usersex = user.sex || this.usersex;
      this.userbirth = user.birth || this.userbirth;
      this.userPhotoUrl = user.photo || this.userPhotoUrl;
    } else {
      console.warn('No user data found in localStorage.');
    }
  }
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profilePhoto = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onEditProfile() {
    // Simulate profile editing logic and show success modal
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
  }
}
