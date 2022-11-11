import { RequestTypes } from 'detritus-client-rest';
import { ClientEvents } from 'detritus-client/lib/constants';
import { COLORS } from '../lib/Constants';

export interface BotEventOptions {
  event: ClientEvents;
  on?: boolean;
  once?: boolean;
  listener(...payload: any): any;
}
export interface SimpleEmbed extends RequestTypes.CreateChannelMessageEmbed {
  color: COLORS;
}
