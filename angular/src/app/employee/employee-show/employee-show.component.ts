import { Component, OnInit, OnDestroy } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { Location } from '@angular/common';
import { EmployeeService } from '../employee.service';
import { Employee } from "../employee";
import {MessageService} from "../../shared/message/message.service";

@Component({
  selector: 'app-employee-show',
  templateUrl: './employee-show.component.html',
  styleUrls: ['./employee-show.component.css']
})
export class EmployeeShowComponent implements OnInit {

  item?: Employee;
  private clearMessagesOnDistroy = true;

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private messageService: MessageService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.clearMessagesOnDistroy = true;
    this.getItem();
  }

  ngOnDestroy(): void {
    if (this.clearMessagesOnDistroy) {
      this.messageService.clear();
    }
  }

  getItem(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.employeeService.getItem(id)
      .subscribe(item => this.item = item);
  }

  delete(item: Employee): void {
    if (!window.confirm("Are you sure you want to delete this item?"))
      return;

    this.messageService.clear();
    this.employeeService.deleteItem(item).subscribe();
    this.clearMessagesOnDistroy = false;
    this.router.navigate(["/employees"])
  }
}
