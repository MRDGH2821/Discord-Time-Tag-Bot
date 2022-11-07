import { Constants } from 'detritus-client';
import { BotEventOptions } from '../botTypes/interfaces';

export default class BotEvent {
  event: Constants.ClientEvents | Constants.GatewayDispatchEvents | string = '';

  on?: boolean = true;

  once?: boolean = false;

  listener(...args: any): any {
    console.log(`"${this.event}" listener ready!`);
    console.log('Args provided:', args);
  }

  constructor(data: BotEventOptions) {
    this.event = data.event;
    if (data.once) {
      this.once = true;
    } else {
      this.on = true;
    }

    this.listener = data.listener;
  }
}
