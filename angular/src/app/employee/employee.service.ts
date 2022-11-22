import { Injectable } from '@angular/core';
import { ENTRYPOINT } from "../core/entrypoint";
import { Employee } from './employee';
import { Observable, of } from 'rxjs';
import { MessageService } from '../shared/message/message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { HydraCollectionResponse } from "../shared/hydra.types";
import {HydraConstraintViolationResponse} from "../shared/hydra.types";

const MIME_TYPE = "application/ld+json";

@Injectable()
export class EmployeeService {
  typeUri = '/employees';
  httpOptions = {
    headers: new HttpHeaders({
      "Accept": MIME_TYPE,
      'Content-Type': MIME_TYPE,
    })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  /** GET employees from the server */
  getList(): Observable<HydraCollectionResponse|undefined> {

    const response = this.http.get<HydraCollectionResponse|undefined>(`${ENTRYPOINT}${this.typeUri}`, this.httpOptions)
      .pipe(
        //tap(_ =>this.messageService.info('fetched employees list')),
        catchError(this.handleError<undefined>('getList', this.typeUri))
      );
    return response;
  }

  /** GET employee by id. Will 404 if id not found */
  getItem(id: number): Observable<Employee|undefined> {
    const url = `${ENTRYPOINT}${this.typeUri}/${id}`;
    return this.http.get<Employee>(url, this.httpOptions).pipe(
      //tap(_ => this.messageService.info(`fetched employee id=${id}`)),
      catchError(this.handleError<undefined>(`getItem`, `${this.typeUri}/${id}`))
    );
  }

  /** PUT: update the employee on the server */
  updateItem(item: Employee): Observable<Employee|HydraConstraintViolationResponse|undefined> {
    const id = item['@id'];
    return this.http.put<Object>( `${ENTRYPOINT}${id}`, item, this.httpOptions).pipe(
      tap(_ => this.messageService.success(`updated employee id=${id}`)),
      catchError(this.handleError<HydraConstraintViolationResponse|undefined>('updateItem', id))
    );
  }

  /** POST: add a new employee to the server */
  addItem(employee: Employee): Observable<Employee|HydraConstraintViolationResponse|undefined> {
    return this.http.post<Object>(`${ENTRYPOINT}${this.typeUri}`, employee, this.httpOptions).pipe(
      tap((newEmployee: Employee) => this.messageService.success(`added employee w/ id=${newEmployee['@id']}`)),
      catchError(this.handleError<HydraConstraintViolationResponse|undefined>('addItem'))
    );
  }

  /** DELETE: delete the employee from the server */
  deleteItem(item: Employee): Observable<void> {
    const id = item['@id'];
    const url = `${ENTRYPOINT}${id}`;

    return this.http.delete<void>(url, this.httpOptions).pipe(
      tap(_ => this.messageService.success(`deleted employee id=${id}`)),
      catchError(this.handleError<void>('deleteItem', id))
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
  private handleError<T>(operation: string, id?: string, result?: T) {
    return (error: any): Observable<T> => {

      if (error.status == 422) {
        // this.log(JSON.stringify(error.error));
        return of(error.error as T);
      }

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      const quotedId = id ? `'${id}'` : '';
      const statusText = error.statusText;
      this.messageService.danger(`${operation} ${quotedId} failed: ${statusText}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
