import { ENTRYPOINT } from "../core/entrypoint";
import { Item } from './item';
import { Observable, of } from 'rxjs';
import { MessageService } from './message/message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { HydraCollectionResponse, HydraConstraintViolationResponse } from "./hydra.types";
import {ItemServiceInterface} from "./item.service.interface";

const MIME_TYPE = "application/ld+json";

export class ItemService implements ItemServiceInterface {
  typeName = `Item`;
  typeUri = '/definedBySubclass';
  httpOptions = {
    headers: new HttpHeaders({
      "Accept": MIME_TYPE,
      'Content-Type': MIME_TYPE,
    })
  };

  constructor(
    protected http: HttpClient,
    protected messageService: MessageService) { }

  /** GET entities from the server */
  getList(queryString: string = ""): Observable<HydraCollectionResponse|undefined> {
    const url = `${this.typeUri}?${queryString}`;
    const response = this.http.get<HydraCollectionResponse>(`${ENTRYPOINT}${url}`, this.httpOptions)
      .pipe(
        //tap(_ =>this.messageService.info('fetched entity list')),
        catchError(this.handleError<undefined>('getList', `${url}`))
      );
    return response;
  }

  /** GET entity by id. Will 404 if id not found */
  getItem(id: number): Observable<Item|undefined> {
    const url = `${ENTRYPOINT}${this.typeUri}/${id}`;
    return this.http.get<Item>(url, this.httpOptions).pipe(
      //tap(_ => this.messageService.info(`fetched ${this.typeUri}${id}`)),
      catchError(this.handleError<undefined>("getItem", `${this.typeUri}/${id}`))
    );
  }

  /** PUT: update the employee on the server */
  updateItem(item: Item): Observable<Item|HydraConstraintViolationResponse|undefined> {
    const id = item['@id'];
    const label = item.label ?? id;
    return this.http.put<Object>( `${ENTRYPOINT}${id}`, item, this.httpOptions).pipe(
      tap(_ => this.messageService.success($localize `:@@item.updated:${this.typeName} ${label} updated`)),
      catchError(this.handleError<HydraConstraintViolationResponse|undefined>("updateItem", id))
    );
  }

  /** POST: add a new employee to the server */
  addItem(item: Item): Observable<Item|HydraConstraintViolationResponse|undefined> {
    return this.http.post<Object>(`${ENTRYPOINT}${this.typeUri}`, item, this.httpOptions).pipe(
      tap((newItem: Item) => {
        const label = newItem.label ?? newItem['@id'];
        this.messageService.success($localize `:@@item.added:${this.typeName} ${label} added`)
      }),
      catchError(this.handleError<HydraConstraintViolationResponse|undefined>("addItem"))
    );
  }

  /** DELETE: delete the employee from the server */
  deleteItem(item: Item): Observable<void> {
    const id = item['@id'];
    const label = item.label ?? id;
    const url = `${ENTRYPOINT}${id}`;

    return this.http.delete<void>(url, this.httpOptions).pipe(
      tap(_ => this.messageService.success($localize `:@@item.deleted:Deleted ${this.typeName} ${label}`)),
      catchError(this.handleError<void>("deleteItem", id))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param id - Identifier or query string passed with the operation
   * @param result - optional value to return as the observable result
   */
  protected handleError<T>(operation: string, id?: string, result?: T) {
    return (error: any): Observable<T> => {

      if (error.status == 422) {
        // this.log(JSON.stringify(error.error));
        // Error will be reported by the form
        return of(error.error as T);
      }

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // If locale nl statusText is allways OK:
      // {"headers":{"normalizedNames":{},"lazyUpdate":null},"status":404,"statusText":"OK","url":"https://localhost/employees/111","ok":false,"name":"HttpErrorResponse","message":"Http failure response for https://localhost/employees/111: 404 OK","error":{"@context":"/contexts/Error","@type":"hydra:Error","hydra:title":"An error occurred","hydra:description":"Not Found","trace":

      // hydra:description ignores accept language
      // const statusText = error.error && error.error["hydra:description"]
      //   ? error.error["hydra:description"]
      //   : getStatusText(error.status);

      const quotedId = id ? `'${id}'` : '';
      const statusText = getStatusText(error.status);
      const label = this.getOperationLabel(operation);
      this.messageService.danger($localize `:@@item.service.error:${label} ${quotedId} failed: ${statusText}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  protected getOperationLabel(operation: string) {
    if ('getList'===operation) return $localize `:@@item.service.operation.getList:Getting ${this.typeName} list`;
    if ('getItem'===operation) return $localize `:@@item.service.operation.getItem:Getting ${this.typeName}`;
    if ('updateItem'===operation) return $localize `:@@item.service.operation.updateItem:Updating ${this.typeName}`;
    if ('addItem'===operation) return $localize `:@@item.service.operation.addItem:Adding ${this.typeName}`;
    if ('deleteItem'===operation) return $localize `:@@item.service.operation.deleteItem:Deleting ${this.typeName}`;
    return `${operation} ${this.typeName}`;
  }
}

// Maybe factor out to a separate file
function getStatusText(statusCode: number) {

  if (400=== statusCode) return $localize `:@@http.status.400:Bad Request`;
  if (401=== statusCode) return $localize `:@@http.status.401:Unauthorized`;
  if (402=== statusCode) return $localize `:@@http.status.402:Payment Required`;
  if (403=== statusCode) return $localize `:@@http.status.403:Forbidden`;
  if (404=== statusCode) return $localize `:@@http.status.404:Not Found`;
  if (405=== statusCode) return $localize `:@@http.status.405:Method Not Allowed`;
  if (500=== statusCode) return $localize `:@@http.status.500:Internal Server Error`;
  if (501=== statusCode) return $localize `:@@http.status.501:Not Implemented`;
  if (502=== statusCode) return $localize `:@@http.status.502:Bad Gateway`;
  if (503=== statusCode) return $localize `:@@http.status.503:Service Unavailable`;
  if (504=== statusCode) return $localize `:@@http.status.504:Gateway Timeout`;
  if (505=== statusCode) return $localize `:@@http.status.505:HTTP Version Not Supported`;

  if (100=== statusCode) return $localize `:@@http.status.100:Continue`;
  if (101=== statusCode) return $localize `:@@http.status.101:Switching Protocols`;
  if (102=== statusCode) return $localize `:@@http.status.102:Processing`;            // RFC2518
  if (103=== statusCode) return $localize `:@@http.status.103:Early Hints`;
  if (200=== statusCode) return $localize `:@@http.status.200:OK`;
  if (201=== statusCode) return $localize `:@@http.status.201:Created`;
  if (202=== statusCode) return $localize `:@@http.status.202:Accepted`;
  if (203=== statusCode) return $localize `:@@http.status.203:Non-Authoritative Information`;
  if (204=== statusCode) return $localize `:@@http.status.204:No Content`;
  if (205=== statusCode) return $localize `:@@http.status.205:Reset Content`;
  if (206=== statusCode) return $localize `:@@http.status.206:Partial Content`;
  if (207=== statusCode) return $localize `:@@http.status.207:Multi-Status`;          // RFC4918
  if (208=== statusCode) return $localize `:@@http.status.208:Already Reported`;      // RFC5842
  if (226=== statusCode) return $localize `:@@http.status.209:IM Used`;               // RFC3229
  if (300=== statusCode) return $localize `:@@http.status.300:Multiple Choices`;
  if (301=== statusCode) return $localize `:@@http.status.301:Moved Permanently`;
  if (302=== statusCode) return $localize `:@@http.status.302:Found`;
  if (303=== statusCode) return $localize `:@@http.status.303:See Other`;
  if (304=== statusCode) return $localize `:@@http.status.304:Not Modified`;
  if (305=== statusCode) return $localize `:@@http.status.305:Use Proxy`;
  if (307=== statusCode) return $localize `:@@http.status.307:Temporary Redirect`;
  if (308=== statusCode) return $localize `:@@http.status.308:Permanent Redirect`;    // RFC7238
  if (406=== statusCode) return $localize `:@@http.status.406:Not Acceptable`;
  if (407=== statusCode) return $localize `:@@http.status.407:Proxy Authentication Required`;
  if (408=== statusCode) return $localize `:@@http.status.408:Request Timeout`;
  if (409=== statusCode) return $localize `:@@http.status.409:Conflict`;
  if (410=== statusCode) return $localize `:@@http.status.410:Gone`;
  if (411=== statusCode) return $localize `:@@http.status.411:Length Required`;
  if (412=== statusCode) return $localize `:@@http.status.412:Precondition Failed`;
  if (413=== statusCode) return $localize `:@@http.status.413:Content Too Large`;                                           // RFC-ietf-httpbis-semantics
  if (414=== statusCode) return $localize `:@@http.status.414:URI Too Long`;
  if (415=== statusCode) return $localize `:@@http.status.415:Unsupported Media Type`;
  if (416=== statusCode) return $localize `:@@http.status.416:Range Not Satisfiable`;
  if (417=== statusCode) return $localize `:@@http.status.417:Expectation Failed`;
  if (418=== statusCode) return $localize `:@@http.status.418:I\'m a teapot`;                                               // RFC2324
  if (421=== statusCode) return $localize `:@@http.status.421:Misdirected Request`;                                         // RFC7540
  if (422=== statusCode) return $localize `:@@http.status.422:Unprocessable Content`;                                       // RFC-ietf-httpbis-semantics
  if (423=== statusCode) return $localize `:@@http.status.423:Locked`;                                                      // RFC4918
  if (424=== statusCode) return $localize `:@@http.status.424:Failed Dependency`;                                           // RFC4918
  if (425=== statusCode) return $localize `:@@http.status.425:Too Early`;                                                   // RFC-ietf-httpbis-replay-04
  if (426=== statusCode) return $localize `:@@http.status.426:Upgrade Required`;                                            // RFC2817
  if (428=== statusCode) return $localize `:@@http.status.428:Precondition Required`;                                       // RFC6585
  if (429=== statusCode) return $localize `:@@http.status.429:Too Many Requests`;                                           // RFC6585
  if (431=== statusCode) return $localize `:@@http.status.431:Request Header Fields Too Large`;                             // RFC6585
  if (451=== statusCode) return $localize `:@@http.status.451:Unavailable For Legal Reasons`;                               // RFC7725
  if (506=== statusCode) return $localize `:@@http.status.506:Variant Also Negotiates`;                                     // RFC2295
  if (507=== statusCode) return $localize `:@@http.status.507:Insufficient Storage`;                                        // RFC4918
  if (508=== statusCode) return $localize `:@@http.status.508:Loop Detected`;                                               // RFC5842
  if (510=== statusCode) return $localize `:@@http.status.510:Not Extended`;                                                // RFC2774
  if (511=== statusCode) return $localize `:@@http.status.511:Network Authentication Required`;                             // RFC6585

  return $localize `:@@http.status.unknown:Unknown http status code: ${statusCode}`;
}
