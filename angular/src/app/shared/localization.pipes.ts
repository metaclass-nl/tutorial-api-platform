import {Inject, LOCALE_ID, Pipe, PipeTransform} from '@angular/core';
import {DATE_PIPE_DEFAULT_TIMEZONE, formatDate} from '@angular/common';

// https://angular.io/api/core/Pipe

@Pipe({name: 'localDate'})
export class LocalDate implements PipeTransform {
  locale;

  constructor(@Inject(LOCALE_ID) locale: string) {
    this.locale = locale;
  }

  transform(value: string|undefined|null, format: string = 'mediumDate') {
    if (value===undefined || value===null) return null;

    return formatDate(value.substring(0, 10), format, this.locale);
  }
}

@Pipe({name: 'localTime'})
export class LocalTime implements PipeTransform {
  locale;

  constructor(@Inject(LOCALE_ID) locale: string) {
    this.locale = locale;
  }

  transform(value: string|undefined|null, format: string = 'shortTime') {
    if (value===undefined || value===null) return null;

    return formatDate(value.substring(0, 19), format, this.locale);
  }
}
