import { Component, OnInit, OnDestroy } from '@angular/core';

import { Employee } from '../employee';
import { EmployeeService } from '../employee.service';
import { faSearch, faPencil } from '@fortawesome/free-solid-svg-icons';
import {MessageService} from "../../shared/message/message.service";

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit, OnDestroy {
  icons = { faSearch, faPencil };
  selectedItem?: Employee;

  items: Employee[] = [];

  constructor(
    private itemService: EmployeeService,
    private messageService: MessageService,
    ) { }

  ngOnInit(): void {
    this.getEmployees();
  }

  ngOnDestroy(): void {
      this.messageService.clear();
  }

  getEmployees(): void {
    this.itemService.getList()
      .subscribe(response => {
        this.items = response
          ? response["hydra:member"] as Employee[]
          : [];
      });
  }

  delete(item: Employee): void {
    this.items = this.items.filter(h => h !== item);
    this.itemService.deleteItem(item).subscribe();
  }
}
