import { GatewayClientEvents } from 'detritus-client';
import { ClientEvents } from 'detritus-client/lib/constants';
import BotEvent from '../lib/BotEvent';

export default new BotEvent({
  event: ClientEvents.INTERACTION_CREATE,
  listener(payload: GatewayClientEvents.InteractionCreate) {
    const { interaction } = payload;

    if (!interaction.isFromApplicationCommand) {
      return;
    }

    console.log('------');
    console.log(
      `${interaction.user.tag} in #${
        interaction.channel?.name
      } triggered an interaction.\nUser ID: ${
        interaction.user.id
      }\nCommand: ${interaction.data?.toString()}`,
    );
    console.log('---\nCommand Logs:');
  },
});
