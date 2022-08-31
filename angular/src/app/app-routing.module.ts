import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { EmployeeListComponent } from "./employee/employee-list/employee-list.component";
import { EmployeeShowComponent } from "./employee/employee-show/employee-show.component";
import { EmployeeCreateComponent } from "./employee/employee-create/employee-create.component";
import { EmployeeUpdateComponent } from './employee/employee-update/employee-update.component';

const routes: Routes = [
  { path: '', component: WelcomeComponent, pathMatch: 'full' },
  { path: 'employees', component: EmployeeListComponent },
  { path: 'employees/create', component: EmployeeCreateComponent, pathMatch: 'full' },
  { path: 'employees/:id', component: EmployeeShowComponent, pathMatch: 'full' },
  { path: 'employees/:id/edit', component: EmployeeUpdateComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
