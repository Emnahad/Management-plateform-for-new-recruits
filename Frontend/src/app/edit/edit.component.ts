import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { AuthService } from '../service/auth.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  eyeIcon: string = "fa-eye-slash";
  isText: boolean = true; // Initialize isText
  type: string = "password"; // Initialize type
  EditForm!: FormGroup;
  selectedImage: any; // Holds the selected image

  constructor(private router: Router, private fb: FormBuilder, private apiService: ApiService, private auth: AuthService, private toastr: ToastrService) { }

  ngOnInit() {
    this.EditForm = this.fb.group({
      fullName: ['', Validators.required],
      userName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      jobPosition: ['', Validators.required]
    });
  }

  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = 'fa-eye' : this.eyeIcon = 'fa-eye-slash';
    this.isText ? this.type = 'text' : this.type = 'password';
  }

  handleImageInput(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedImage = e.target?.result;

        // Set the value of 'im' property in the EditForm to the data URL
        console.log(this.selectedImage);

        
      };
      reader.readAsDataURL(file);
    }
  }


  updateUserProfile() {
    const userId = this.auth.getUserInfoFromToken();
    const idname = userId.nameid;
    const decodedUsername = userId.unique_name;

    if (this.EditForm.valid) {
      if (this.EditForm.value.userName !== decodedUsername) {
        this.toastr.error('Error', 'Username does not match the authenticated user.');
        return;
      }

      const updatedUser = {
        id: idname,
        fullName: this.EditForm.value.fullName,
        userName: this.EditForm.value.userName,
        email: this.EditForm.value.email,
        password: this.EditForm.value.password,
        jobPosition: this.EditForm.value.jobPosition,
        im: this.selectedImage, // This should now contain the data URL
        Role: "user",
      };

      this.apiService.updateUserProfile(idname, updatedUser).subscribe(
        response => {
          console.log('User profile updated successfully:', response);
          this.toastr.success('Success', 'User profile updated successfully:');
          this.router.navigate(['home']);
        },
        error => {
          console.error('Error updating user profile:', error);
          this.toastr.error('Error', 'Update Failed!');
        }
      );
    } else {
      console.log('Form is not valid');
      this.toastr.error('Error', 'Form is not valid!');
    }
  }


}