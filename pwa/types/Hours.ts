import { Item } from "./item";

export class Hours implements Item {
  public "@id"?: string;

  constructor(
    _id?: string,
    public nHours?: number,
    public start?: string,
    public onInvoice?: boolean,
    public description?: string,
    public employee?: string,
    public label?: string,
    public day?: string
  ) {
    this["@id"] = _id;
  }
}
