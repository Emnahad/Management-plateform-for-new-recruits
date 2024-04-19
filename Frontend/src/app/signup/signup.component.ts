import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import ValidateForm from '../helpers/validate';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  type: string = 'password';
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  signUpForm!: FormGroup;
  submitted: boolean = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private toastr: ToastrService) { }

  ngOnInit() {
    this.signUpForm = this.fb.group({
      fullName: ['', Validators.required],
      userName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      jobPosition: ['', Validators.required]
    })
  }

  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = 'fa-eye' : this.eyeIcon = 'fa-eye-slash'
    this.isText ? this.type = 'text' : this.type = 'password'
  }
  isFieldInvalid(fieldName: string): boolean {
    const control = this.signUpForm.get(fieldName);
    return !!control && control.dirty && control.hasError('required');
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
  onSignUp() {
    if (this.signUpForm.valid) {
      console.log(this.signUpForm.value);
      // Perform logic for sign up
      this.auth.signUp(this.signUpForm.value)
        .subscribe({
          next: (res => {
            alert(res.message);
            this.toastr.success('Success', 'Account created successfully!');
            this.router.navigate(['signin']);
            
            
          }),
          error: (err => {
            console.error(err); // Log the error for debugging
            alert(err?.error?.message || "An error occurred"); // Fix the error message
          })
        });
    } else {
      console.log("form is not valid");
      // Throw the error using toaster and with fields
      this.validateAllFormFields(this.signUpForm);
      alert("Your form is invalid");
    }
  }

  }

