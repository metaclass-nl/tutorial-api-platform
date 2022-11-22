export class Item {
  public "@id"?: string;

  constructor(
    _id?: string,
    public label?: string
  ) {
    this["@id"] = _id;
  }
}
