export class Employee {
  public "@id"?: string;

  constructor(
    _id?: string,
    public firstName?: string,
    public lastName?: string,
    public job?: string,
    public address?: string,
    public zipcode?: string,
    public city?: string,
    public birthDate?: Date,
    public arrival?: Date,
    public label?: string
  ) {
    this["@id"] = _id;
  }
}
