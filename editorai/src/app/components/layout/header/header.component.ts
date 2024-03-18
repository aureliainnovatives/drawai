import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  projectName: string = '';

  constructor(private router:Router){

  }

  saveProject() {
    // Implement project name saving logic here
    console.log('Saving project:', this.projectName);
  }
  
  gotohome(){
    this.router.navigate(["playground"])
  }
  
}
