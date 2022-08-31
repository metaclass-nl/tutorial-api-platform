import { Component, OnInit } from '@angular/core';
import {Employee} from "../employee";
import { EmployeeService } from '../employee.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-employee-create',
  templateUrl: './employee-create.component.html',
  styleUrls: ['./employee-create.component.css']
})
export class EmployeeCreateComponent implements OnInit {

  item = new Employee();

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
  ) {}

  ngOnInit(): void {
  }

  itemCreated(item: Employee) {
    this.router.navigate(["/employees"])
  }
}
