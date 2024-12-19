import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent {
    constructor(private router:Router){}
    logout(){
      localStorage.clear();
      this.router.navigateByUrl('/login');
    }
}
