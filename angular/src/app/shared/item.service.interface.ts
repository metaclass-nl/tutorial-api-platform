import { Item } from './item';
import { Observable } from 'rxjs';
import {HydraCollectionResponse, HydraConstraintViolationResponse} from "./hydra.types";

export declare interface ItemServiceInterface {
  getList(queryString: string): Observable<HydraCollectionResponse|undefined>;
  getItem(id: number): Observable<Item|undefined>;
  updateItem(item: Item): Observable<Item|HydraConstraintViolationResponse|undefined>;
  addItem(item: Item): Observable<Item|HydraConstraintViolationResponse|undefined>;
  deleteItem(item: Item): Observable<void>;
}
