import { Injectable } from '@angular/core';
import {ItemService} from "../shared/item.service";
import {HttpClient} from "@angular/common/http";
import {MessageService} from "../shared/message/message.service";

const MIME_TYPE = "application/ld+json";

/**
 * Could have added typeName and typeUri to ItemService constructor
 * and use factory providers to configure them but extension allows for
 * future overrides and extra methods specific to this service
 */
@Injectable()
export class EmployeeService extends ItemService {
  override typeName = $localize `:@@employee.item:Employee`;
  override typeUri = '/employees';

  constructor(
    http: HttpClient,
    messageService: MessageService) {
    super(http, messageService);
  }

}
