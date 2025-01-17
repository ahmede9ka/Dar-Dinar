import { Component } from '@angular/core';
import { SideBarComponent } from "../side-bar/side-bar.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [SideBarComponent, CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'] // Corrected property name
})
export class ProfileComponent {
  isModalVisible = false;
  profilePhoto: string = 'https://via.placeholder.com/150'; // Default profile photo
  profileImageUrl: string = 'https://via.placeholder.com/150'; // Default profile image URL
  coverImageUrl: string = 'https://images.unsplash.com/photo-1449844908441-8829872d2607?crop=entropy&cs=tinysrgb&fit=max&fm=jpg'; // Default cover image URL

  userName: string | undefined;
  userPhotoUrl: string | undefined;
  useremail: string | undefined;
  usersex: string | undefined;
  userbirth: string | undefined;

  constructor() {
    this.loadProfile(); // Call loadProfile on component initialization
  }

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
    if (fileInput) {
      fileInput.click();
    }
  }

  loadProfile() {
    const userData = localStorage.getItem('user');
    const baseImageUrl = 'http://127.0.0.1:8000/uploads/'; // Update with your actual base image URL
  
    if (userData) {
      const user = JSON.parse(userData);
  
      this.userName = user.username || 'Guest User';
      this.useremail = user.email || 'Not Provided';
      this.usersex = user.sex || 'Not Specified';
      this.userbirth = user.date?.date || 'Unknown';
  
      // Construct the full URL for the user image
      if (user.image) {
        this.userPhotoUrl = `${baseImageUrl}${user.image}`;
      } else {
        this.userPhotoUrl = 'https://via.placeholder.com/150'; // Default image
      }
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
