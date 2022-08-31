import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { Location } from '@angular/common';
import { EmployeeService } from '../employee.service';
import { Employee } from "../employee";

@Component({
  selector: 'app-employee-show',
  templateUrl: './employee-show.component.html',
  styleUrls: ['./employee-show.component.css']
})
export class EmployeeShowComponent implements OnInit {

  item?: Employee;

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getItem();
  }

  getItem(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.employeeService.getItem(id)
      .subscribe(item => this.item = item);
  }

  delete(item: Employee): void {
    this.employeeService.deleteItem(item).subscribe();
    this.router.navigate(["/employees"])
  }
}
