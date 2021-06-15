import { Injectable } from '@angular/core';
import { AppComponent } from './app.component';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import { Message } from '@stomp/stompjs';
import { Subscription } from 'rxjs';
import {map} from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class ChatServiceService {
  webSocketEndPoint: string = 'http://localhost:8080/ws';
  // topic: string = "/topic/" + 23 + '/message';
  topic: string = "/topic/greetings";
  stompClient: any;
  appComponent: AppComponent;
  subscriptions: Subscription = new Subscription();

  constructor(appComponent: AppComponent) {
    this.appComponent = appComponent;
  }

  listMessage: Message[] = [];
  _connect() {
    console.log("Initialize WebSocket Connection");
    let ws = new SockJS(this.webSocketEndPoint);
    this.stompClient = Stomp.over(ws);
    const stomp = this.stompClient;
    stomp.connect({}, (frame: any) => {
      this.getMessage();
    }, this.errorCallBack);
  };

  getMessage() {
    this.subscriptions.add(this.stompClient.subscribe(this.topic, (sdkEvent: any) => {
      console.log("sdk",sdkEvent.body);
      this.listMessage = JSON.parse(sdkEvent.body);
      console.log("list",this.listMessage);
      this.onMessageReceived(sdkEvent);
      
    }));
  }

  _disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
      this.subscriptions.unsubscribe();
    }
    console.log("Disconnected");
  }

  // on error, schedule a reconnection attempt
  errorCallBack(error: any) {
    console.log("errorCallBack -> " + error)
    setTimeout(() => {
      this._connect();
    }, 5000);
  }

  /**
  * Send message to sever via web socket
  * @param {*} message 
  */
  _send(message: any) {
    console.log("calling logout api via web socket");
    this.stompClient.send("/app/message", {}, JSON.stringify(message));
  }

  onMessageReceived(message: []) {
    console.log("Message Recieved from Server :: " + message);
    this.appComponent.handleMessage(JSON.stringify(message));
  }


}
