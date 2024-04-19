import { Component } from '@angular/core';
import { ContactService } from '../service/contact.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {

  contactData = {
    username: '',
    email: '',
    message: '',
    subject:''
  };

  constructor(private contactService: ContactService, private toastr: ToastrService) { }

  onSubmit() {
    this.contactService.sendContactForm(this.contactData)
      .subscribe(
        response => {
          console.log(this.contactData);
          console.log('Contact form submitted successfully', response);
          // Display or handle the success message
          console.log('Success message:', response);
          this.toastr.success('Success', 'Contact form submitted successfully');

          // Clear the form after submission
          this.contactData = {
            username: '',
            email: '',
            message: '',
            subject: ''
          };
        },
        error => {
          console.error('Error submitting contact form', error);
        }
      );
  }

}
