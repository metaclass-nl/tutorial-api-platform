export class HydraResponse {
  public "@id"?: string;
  public "@context"?: string;
  public "@type"?: string;
  public "hydra:member"?: Array<Object>;
  public "hydra:totalItems"?: number;

  constructor(
    _id?: string,
    _context?: string,
    _type?: string,
    hydra_member?: Array<Object>,
    hydra_totalItems?: number,
  ) {
    this["@id"] = _id;
    this["@context"] = _context;
    this["@type"] = _type;
    this["hydra:member"] = hydra_member;
    this["hydra:totalItems"] = hydra_totalItems;

  }
}
