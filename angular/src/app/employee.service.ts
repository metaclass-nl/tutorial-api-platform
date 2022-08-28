import { Injectable } from '@angular/core';
import { ENTRYPOINT } from "./config/entrypoint";
import { Employee } from './employee/employee';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import {HydraResponse} from "./hydra-response";

const MIME_TYPE = "application/ld+json";

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  employeesUrl = ENTRYPOINT + 'employees';
  httpOptions = {
//    responseType: 'text' as const,
//    observe: 'response' as const,
    headers: new HttpHeaders({
      "Accept": MIME_TYPE,
//      'Content-Type': MIME_TYPE,
    })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  /** GET employees from the server */
  getList(): Observable<HydraResponse> {

    const response = this.http.get<HydraResponse>(this.employeesUrl, this.httpOptions)
      .pipe(
        tap(_ => this.log('fetched employees list')),
        catchError(this.handleError<Object>(this.employeesUrl, []))
      );
//    response.subscribe(found => this.log(JSON.stringify(found)));
    return response;
  }

  /** GET employee by id. Will 404 if id not found */
  getItem(id: number): Observable<Employee> {
    const url = `${this.employeesUrl}/${id}`;
    return this.http.get<Employee>(url, this.httpOptions).pipe(
      tap(_ => this.log(`fetched employee id=${id}`)),
      catchError(this.handleError<Employee>(`get Item id=${id}`))
    );
  }

  /** PUT: update the employee on the server */
  updateItem(item: Employee): Observable<any> {
    return this.http.put(this.employeesUrl, item, this.httpOptions).pipe(
      tap(_ => this.log(`updated employee id=${item['@id']}`)),
      catchError(this.handleError<any>('update Item'))
    );
  }

  /** POST: add a new employee to the server */
  addEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.employeesUrl, employee, this.httpOptions).pipe(
      tap((newEmployee: Employee) => this.log(`added employee w/ id=${newEmployee['@id']}`)),
      catchError(this.handleError<Employee>('add Item'))
    );
  }

  /** DELETE: delete the employee from the server */
  deleteEmployee(item: Employee): Observable<Employee> {
    const id = item['@id'];
    const url = `${this.employeesUrl}/${id}`;

    return this.http.delete<Employee>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted employee id=${id}`)),
      catchError(this.handleError<Employee>('delete Item'))
    );
  }

  /** Log a EmployeeService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`EmployeeService: ${message}`);
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
