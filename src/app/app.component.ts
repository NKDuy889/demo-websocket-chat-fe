import { OnDestroy } from '@angular/core';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatServiceService } from './chat-service.service';
import { User } from './user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  title = 'demo-websocket-fe';
  user: User = {
    name: "",
    context: ""
  }
  listChat: User[] = [];

  webSocketAPI: ChatServiceService | any;
  greeting: any;
  name: string | any;
  content: string | any;

  constructor(){

  }

  ngOnInit() {
    this.webSocketAPI = new ChatServiceService(new AppComponent());
    this.connect();
  }

  ngOnDestroy() {
    this.disconnect();
  }

  connect(){
    this.webSocketAPI._connect();
  }

  disconnect(){
    this.webSocketAPI._disconnect();
  }

  sendMessage(){
    const data = {
      textMessage: this.content,
      idConversation: 2
    }
    this.webSocketAPI._send(data);
  }

  handleMessage(message: any){
    this.greeting = message;
  }

}
