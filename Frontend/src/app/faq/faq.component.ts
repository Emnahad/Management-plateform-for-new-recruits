import { Component } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent {

  toggleQuestion(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const question = target.closest('.question');

    if (question) {
      const answer = question.querySelector('p');

      if (answer) {
        if (question.classList.contains('active')) {
          question.classList.remove('active');
          answer.classList.remove('show');
        } else {
          question.classList.add('active');
          answer.classList.add('show');
        }
      }
    }
  }
}
