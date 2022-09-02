import { Injectable } from '@angular/core';
import { MessageData } from "./message-data";

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messages: MessageData[] = [];

  add(data: MessageData) {
    this.messages.push(data);
  }

  info(message: string, role?: string) {
    this.add({msg: message, className: "alert alert-info"})
  }

  success(message: string, role?: string) {
    this.add({msg: message, className: "alert alert-success"})
  }

  danger(message: string, role?: string) {
    this.add({msg: message, className: "alert alert-danger"})
  }

  warning(message: string, role?: string) {
    this.add({msg: message, className: "alert alert-warning"})
  }

  clear() {
    this.messages = [];
  }
}
