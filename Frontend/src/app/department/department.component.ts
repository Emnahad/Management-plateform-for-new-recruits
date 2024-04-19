import { Component } from '@angular/core';
import { Employee } from '../Model/Employee.Model';
import { EmployeesServiceService } from '../service/employees-service.service';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})

export class DepartmentComponent {
  iconPath = 'assets/div.png';
  searchTerm: string = ''; // Assurez-vous que searchTerm est initialisé avec une chaîne vide
  filteredEmployees: Employee[] = []; // Liste filtrée des employés en fonction du terme de recherche
  show = false;
  selectedEmployee: Employee = {} as Employee; 
  employees: Employee[] = [];
  constructor(private employeesServiceService: EmployeesServiceService) { }
  ngOnInit(): void {

    this.getAllEmployees();
  }


  getAllEmployees(): void {
    this.employeesServiceService.getAllEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
        this.onSearch();
      },
      error: (response) => {
        console.log(response);
      }
    });
  }

  openPopup(employee: Employee) {
    this.show = true;
    this.selectedEmployee = employee;
  }

  close() {
    this.show = false;
  }

  onSearch(): void {
    // Assurez-vous que searchTerm est toujours une chaîne non vide avant d'appeler toLowerCase()
    if (this.searchTerm) {
      this.employeesServiceService.searchEmployeesByName(this.searchTerm).subscribe({
        next: (employees) => {
          this.filteredEmployees = employees;
        },
        error: (response) => {
          console.log(response);
        }
      });
    } else {
      // Si searchTerm est vide, affichez tous les employés sans filtre
      this.filteredEmployees = this.employees;
    }

  }

  onInputChange(): void {

    this.onSearch(); // Appeler onSearch à chaque changement dans l'input de recherche

  }

}