import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import ValidateForm from '../helpers/validate';
import { AuthService } from '../service/auth.service';
import { NgToastService } from 'ng-angular-popup';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
@Component({
  selector: 'app-signup',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  type: string = 'password';
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  signInForm!: FormGroup;
  submitted: boolean = false;
  
  constructor(private fb: FormBuilder, private auth: AuthService, private toast: NgToastService, private toastr: ToastrService,private router:Router) { }

  ngOnInit() {
    this.signInForm = this.fb.group({
       userName: ['', Validators.required],
      password: ['', Validators.required],
     
    })
  }
  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormGroup) {
        this.validateAllFormFields(control); // Recursively validate nested form groups
      } else {
        control?.markAsTouched();
      }
    });
  }
  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = 'fa-eye' : this.eyeIcon = 'fa-eye-slash'
    this.isText ? this.type = 'text' : this.type = 'password'
  }
  isFieldInvalid(fieldName: string): boolean {
    const control = this.signInForm.get(fieldName);
    return !!control && control.dirty && control.hasError('required');
  }
  onLogin() {
    this.submitted = true; // Set the submitted flag to true
    if (this.signInForm.valid) {
      console.log(this.signInForm.value);
      const loginData = {
        userName: this.signInForm.value.userName,
        password: this.signInForm.value.password
      };
      // Send the object to the database
      this.auth.login(loginData)
        .subscribe({
          next: (res) => {
            alert(res.message);
            this.toastr.success('Success', 'Logged in successfully!');
            this.signInForm.reset();
            this.auth.storeToken(res.token);
            this.router.navigate(['home']);
            
          },
          error: (err) => {
            console.error("An error occurred:", err);
            const errorMessage = err?.error?.message || "An error occurred while processing your request.";
            alert(errorMessage);
            this.toastr.error('Error', 'Log In Failed!');
          }
        });
    } else {
      console.log("form is not valid");
      // Throw the error using toaster and with fields
      this.validateAllFormFields(this.signInForm);
      alert("Your form is invalid");
    }
  }


}

