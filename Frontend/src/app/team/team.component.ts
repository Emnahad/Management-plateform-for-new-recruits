import { Component } from '@angular/core';
import { Employee } from '../Model/Employee.Model';

import { EmployeesServiceService } from '../service/employees-service.service';



@Component({

  selector: 'app-team',

  templateUrl: './team.component.html',

  styleUrls: ['./team.component.css']

})

export class TeamComponent {

  iconPath = 'assets/div.png';

  show = false;

  employees: Employee[] = [];


  constructor(private employeesServiceService: EmployeesServiceService) { }




  ngOnInit(): void {

    this.employeesServiceService.getAllEmployees().subscribe({

      next: (employees) => {

        this.employees = employees;

      },

      error: (response) => {

        console.log(response);

      }

    })


  }




  openpopup() {

    this.show = true;

  }

  close() {

    this.show = false;

  }

}