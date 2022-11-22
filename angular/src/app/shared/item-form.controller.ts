import { Injectable, Inject, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import {Item} from "./item";
import {ConstraintViolation, HydraConstraintViolationResponse} from "./hydra.types";
import {ItemService} from "./item.service";
import {MessageService} from "./message/message.service";

/**
 * Use a factory provider if you need to specify formatters and normalizers
 */
export class ItemFormController {

  constructor(
    @Inject({}) private formatters: {[key: string]: (v?: string) => string},
    @Inject({}) private normalizers: {[key: string]: (v?: string|null) => string|number|null},
    private itemService: ItemService,
    private messageService: MessageService,
  ) {
  }

  setControlsValues(controls: {[key: string]: FormControl}, item: Item) {
    for (let key in controls) {
      const control = controls[key];
      control.setValue(this.formatControlValue(key, item));
    }
  }

  formatControlValue(key: string, item: Item) {
    if (this.formatters[key]) {
      return this.formatters[key](item[key as keyof Item]);
    }

    return (item[key as keyof Item] ?? '') as string;
  }

  onSubmit(itemForm: FormGroup, item: Item, itemSubmit: EventEmitter<Item>) {
    const subscriber = (result: Item|HydraConstraintViolationResponse|undefined) => {
      if (result===undefined) {
        // Error message already passed to messageService
        return;
      }
      const resultItem = result as Item;
      if (resultItem["@id"]) {
        // Success
        itemSubmit.emit(resultItem);
      } else {
        const violationResponse = result as HydraConstraintViolationResponse;
        if (violationResponse["@type"] && violationResponse["@type"] == "ConstraintViolationList") {
          const violations = violationResponse.violations ?? [];
          this.setViolationsOnForm(violations, itemForm);
        } else {
          throw new Error('Unexpected violation response: ' + JSON.stringify(result))
        }
      }
    }

    this.messageService.clear();
    const values = itemForm.value;

    for (let key in itemForm.controls) {
      const value = values[key as keyof typeof values];
      item[key as keyof Item] = this.normalize(key, value);
    }

    if (item["@id"]) {
      this.itemService.updateItem(item).subscribe(subscriber);
    } else {
      this.itemService.addItem(item).subscribe(subscriber);
    }
  }

  normalize(key: string, value: any) {
    if (this.normalizers[key]) {
      return this.normalizers[key](value);
    }

    return value ?? null;
  }

  setViolationsOnForm(violations: Array<ConstraintViolation>, itemForm: FormGroup) {
    violations.forEach(violation => {
      let control = itemForm.get(violation.propertyPath);
      if (control) {
        control.setErrors(
          {['fromServer']: violation.message}
        );
      } else {
      // use message service
      this.messageService.danger($localize `:@@violationMessage:${violation.propertyPath} invalid: ${violation.message}`);
      }
    });
  }

}
