import { RequestTypes } from 'detritus-client-rest';
import { InteractionCommand } from 'detritus-client/lib/interaction';
import { COLORS } from '../lib/Constants';

export default new InteractionCommand({
  name: 'ping',
  description: 'Shows bot ping',
  global: true,
  disableDm: false,
  metadata: {
    help: 'Shows bot ping',
  },
  async run(context) {
    const { gateway, rest } = await context.client.ping();

    await context.editOrRespond('Pinging...');

    const pingEmb: RequestTypes.CreateChannelMessageEmbed = {
      title: '**Pong!**',
      color: COLORS.EMBED_COLOR,
      description: `Gateway Ping: ${gateway}ms\nREST Ping: ${rest}ms`,
    };

    await context.editOrRespond({
      embeds: [pingEmb],
    });
  },
  onRunError(ctw) {
    console.log(ctw);
  },
});
