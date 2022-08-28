import { Component, OnInit } from '@angular/core';

import { Employee } from '../employee/employee';
import { EmployeeService } from '../employee.service';
import { faSearch, faPencil } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  icons = { faSearch, faPencil };
  selectedItem?: Employee;

  items: Employee[] = [];

  constructor(private itemService: EmployeeService) { }

  ngOnInit(): void {
    this.getEmployees();
  }

  getEmployees(): void {
    this.itemService.getList()
      .subscribe(response => {
        this.items = response["hydra:member"] as Employee[];
      });
  }

  delete(item: Employee): void {
    this.items = this.items.filter(h => h !== item);
    this.itemService.deleteEmployee(item).subscribe();
  }
}
