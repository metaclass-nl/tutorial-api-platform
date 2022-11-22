import {Item} from "../shared/item";

export class Employee extends Item {

  constructor(
    _id?: string,
    public firstName?: string,
    public lastName?: string,
    public job?: string,
    public address?: string,
    public zipcode?: string,
    public city?: string,
    public birthDate?: string,
    public arrival?: string,
    label?: string
  ) {
    super(_id, label);
  }
}
