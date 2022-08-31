import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../employee.service';
import { Employee } from "../employee";

@Component({
  selector: 'app-employee-update',
  templateUrl: './employee-update.component.html',
  styleUrls: ['./employee-update.component.css']
})
export class EmployeeUpdateComponent implements OnInit {

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
  }

  itemUpdated(item: Employee) {
    //this.item = item;
    this.router.navigate(["/employees"])
  }
}
