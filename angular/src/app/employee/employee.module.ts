import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeShowComponent } from './employee-show/employee-show.component';
import { EmployeeCreateComponent } from './employee-create/employee-create.component';
import { EmployeeUpdateComponent } from './employee-update/employee-update.component';
import { EmployeeFormComponent } from './employee-form/employee-form.component';
import { EmployeeListComponent } from "./employee-list/employee-list.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppRoutingModule } from '../app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { LocalDate, LocalTime } from '../shared/localization.pipes';
import {EmployeeService} from "./employee.service";

@NgModule({
  declarations: [
    EmployeeListComponent,
    EmployeeShowComponent,
    EmployeeCreateComponent,
    EmployeeUpdateComponent,
    EmployeeFormComponent,
    LocalDate,
    LocalTime,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    AppRoutingModule,
    ReactiveFormsModule,
  ],
  providers: [
    EmployeeService
  ]
})
export class EmployeeModule { }
