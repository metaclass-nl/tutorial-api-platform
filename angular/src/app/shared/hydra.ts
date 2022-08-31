export class HydraCollectionResponse {
  public "@id": string;
  public "@context": string;
  public "@type": string;
  public "hydra:member": Array<Object>;
  public "hydra:totalItems": number;

  constructor(
    _id: string,
    _context: string,
    _type: string,
    hydra_member: Array<Object>,
    hydra_totalItems: number,
  ) {
    this["@id"] = _id;
    this["@context"] = _context;
    this["@type"] = _type;
    this["hydra:member"] = hydra_member;
    this["hydra:totalItems"] = hydra_totalItems;

  }
}

export class HydraConstraintViolationResponse {
  public "@context": string;
  public "@type": string;
  public "hydra:description": string;
  public "hydra:title": string;

  constructor(
    _context: string,
    _type: string,
    hydra_description: string,
    hydra_title: string,
    public violations?: Array<ConstraintViolation>,
  ) {
    this["@context"] = _context;
    this["@type"] = _type;
    this["hydra:description"] = hydra_description;
    this["hydra:title"] = hydra_title;
  }
}

export class ConstraintViolation {
  constructor(
    public propertyPath: string,
    public message: string,
    public code: string
  ) {}
}

