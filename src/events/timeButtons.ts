import { GatewayClientEvents } from 'detritus-client';
import { ClientEvents, InteractionCallbackTypes } from 'detritus-client/lib/constants';
import { InteractionDataComponent } from 'detritus-client/lib/structures';
import BotEvent from '../lib/BotEvent';

export default new BotEvent({
  event: ClientEvents.INTERACTION_CREATE,
  listener(payload: GatewayClientEvents.InteractionCreate) {
    const { interaction } = payload;

    if (!interaction.isFromMessageComponent) {
      return;
    }

    const componentData = interaction.data as InteractionDataComponent;

    if (!componentData.customId.includes('format')) {
      return;
    }

    const [, type, epoch] = componentData.customId.split('-');
    console.log({ type, epoch });
    interaction.createResponse(InteractionCallbackTypes.CHANNEL_MESSAGE_WITH_SOURCE, {
      content: `\`<t:${epoch}:${type}>\``,
    });
  },
});
