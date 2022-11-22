import { Component, OnInit, OnDestroy } from '@angular/core';
import {Employee} from "../employee";
import { EmployeeService } from '../employee.service';
import {Router} from "@angular/router";
import {MessageService} from "../../shared/message/message.service";

@Component({
  selector: 'app-employee-create',
  templateUrl: './employee-create.component.html',
  styleUrls: ['./employee-create.component.css']
})
export class EmployeeCreateComponent implements OnInit, OnDestroy {

  item = new Employee();
  private clearMessagesOnDistroy = true;

  constructor(
    private employeeService: EmployeeService,
    private messageService: MessageService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.clearMessagesOnDistroy = true
  }

  ngOnDestroy(): void {
    if (this.clearMessagesOnDistroy) {
      this.messageService.clear();
    }
  }

  itemCreated(item: Employee) {
    this.clearMessagesOnDistroy = false;
    this.router.navigate(["/employees"])
  }
}
