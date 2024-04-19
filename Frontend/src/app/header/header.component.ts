import { ElementRef } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';

import { ApiService } from '../service/api.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  imageSrc = 'assets/images/Logo.png';
  iconPath = 'assets/images/user.png';
  iconPath2 = 'assets/images/Ho.png';
  iconPath3 = 'assets/images/User-Profile1.png'
  user: any;
  userId: number = 1;
  Isloggedin: boolean = false;
  public users: any = [];
  public role!: string;
  AfficheCard = false;


  public fullName: string = "";

  constructor(private elementRef: ElementRef, private router: Router, private auth: AuthService,private api: ApiService) { }

  ngOnInit() {
    this.checkLoggedInStatus();
    this.fetchUserDetails();
  
  }
  

  checkLoggedInStatus() {
    // Check if the user is logged in using the AuthService
    this.Isloggedin = this.auth.isLoggedIn();
    if (this.Isloggedin) {
      this.user = this.auth.getUserInfoFromToken();
      console.log('User information from token:', this.user);

    }
  }

  logout() {
    this.auth.signOut();
  }
  show() {
    this.AfficheCard = true;
  }
  close() {
    this.AfficheCard = false;
  }
  fetchUserDetails() {
    const userIdFromToken = this.auth.getUserInfoFromToken(); // Get the user ID from the token
    const idname = userIdFromToken.nameid; // Corrected variable name
    console.log(idname); 
    
    this.api.getUserById(idname).subscribe(
        (user: any) => {
          this.user = user;
          console.log(user);
        },
        (error: any) => {
          console.error('Error fetching user details:', error);
        }
      );
    }
  }




