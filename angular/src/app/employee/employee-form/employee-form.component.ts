import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {Employee} from "../employee";
import {Item} from "../../shared/item";
import {EmployeeService} from "../employee.service";
import {MessageService} from "../../shared/message/message.service";
import * as inputLoc from '../../shared/input-localization.functions';
import {ItemFormController} from "../../shared/item-form.controller";

const controllerFactory = (itemService: EmployeeService, messageService: MessageService) =>
  new ItemFormController(
    {
      birthDate: inputLoc.formatDate,
      arrival: inputLoc.formatTime,
    },
    {
      arrival: inputLoc.normalizeTime,
      birthDate: inputLoc.normalizeDate,
    },
    itemService,
    messageService,
  );

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css'],
  providers: [{
      provide: ItemFormController,
      useFactory: controllerFactory,
      deps: [EmployeeService, MessageService]
    },
  ]
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
  itemForm = new FormGroup(this.controls);
  private _item: Item = new Employee();

  @Input()
  get item() {
    return this._item;
  }
  set item(item: Item) {
    this._item = item;

    if (this._item) {
      this.controller.setControlsValues(this.controls, this._item);
    }
  }

  @Output() itemSubmit = new EventEmitter<Employee>();

  constructor(private controller: ItemFormController) {
  }

  onSubmit() {
    return this.controller.onSubmit(this.itemForm, this._item, this.itemSubmit);
  }

  shouldShowErrors(control: FormControl) {
    return control.invalid && (
      control.dirty ||
      control.touched ||
      control.errors && control.errors["fromServer"])
  }
}
