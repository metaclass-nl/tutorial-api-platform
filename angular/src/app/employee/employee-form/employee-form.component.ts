import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, ValidationErrors, Validators } from '@angular/forms';
import {Employee} from "../employee";
import {ConstraintViolation, HydraConstraintViolationResponse} from "../../shared/hydra.types";
import {EmployeeService} from "../employee.service";
import {MessageService} from "../../shared/message/message.service";

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent {

  controls = {
    firstName: new FormControl(''),
    lastName: new FormControl('', Validators.required),

    job: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    zipcode: new FormControl(''),
    city: new FormControl(''), // , Validators.required), left out to test processing of server side validation results
    birthDate: new FormControl('', Validators.required),
    arrival: new FormControl(''),
  }
  employeeForm = new FormGroup(this.controls);
  private _item = new Employee();

  @Input()
  get item() {
    return this._item;
  }
  set item(item: Employee) {
    this._item = item;
      if (this._item) {
        this.controls.firstName.setValue(this._item.firstName ?? '');
        this.controls.lastName.setValue(this._item.lastName ?? '');
        this.controls.job.setValue(this._item.job ?? '');
        this.controls.address.setValue(this._item.address ?? '');
        this.controls.zipcode.setValue(this._item.zipcode ?? '');
        this.controls.city.setValue(this._item.city ?? '');
        this.controls.birthDate.setValue(this._item.birthDate ?? '');
        this.controls.arrival.setValue(this._item.arrival ?? '');
      }
  }

  @Output() itemSubmit = new EventEmitter<Employee>();

  constructor(
    private employeeService: EmployeeService,
    private messageService: MessageService,
  ) {
  }

  onSubmit() {
    const subscriber = (result: Employee|HydraConstraintViolationResponse|undefined) => {
      if (result===undefined) {
        // Error message already passed to messageService
        return;
      }
      const employee = result as Employee;
      if (employee["@id"]) {
        this.itemSubmit.emit(employee);
      } else {
        const violationResponse = result as HydraConstraintViolationResponse;
        if (violationResponse["@type"] && violationResponse["@type"] == "ConstraintViolationList") {
          const violations = violationResponse.violations ?? [];
          this.setViolationsOnForm(violations);
        } else {
          throw new Error('Unexpected response: ' + JSON.stringify(result))
        }
      }
    }

    this.messageService.clear();
    const employee = this.employeeForm.value as Employee;
    if (!employee.arrival) {
      employee.arrival = undefined;
    }
    if (!employee.birthDate) {
      employee.birthDate = undefined;
    }
    if (this._item["@id"]) {
      employee["@id"] = this._item["@id"];
      this.employeeService.updateItem(employee).subscribe(
        subscriber
      )
    } else {
      this.employeeService.addItem(employee).subscribe(
        subscriber
      )
    }
  }

  setViolationsOnForm(violations: Array<ConstraintViolation>) {
    violations.forEach(violation => {
      let control = this.employeeForm.get(violation.propertyPath);
      if (control) {
        control.setErrors(
          {['fromServer']: violation.message}
        );
      } else {
        // use message service
        this.messageService.danger(violation.propertyPath + " invalid: " + violation.message);
      }
    });
  }

  shouldShowErrors(control: FormControl) {
    return control.invalid && (
      control.dirty ||
      control.touched ||
      control.errors && control.errors["fromServer"])
  }
}
