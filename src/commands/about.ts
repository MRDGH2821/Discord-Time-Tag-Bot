import { InteractionCommand } from 'detritus-client/lib/interaction';
import { COLORS } from '../lib/Constants';
import { supportRow } from '../lib/ReusableComponents';

export default new InteractionCommand({
  name: 'about',
  description: 'About the bot!',
  global: true,
  disableDm: false,
  metadata: {
    help: 'Know more about the bot!',
  },
  async run(ctx) {
    const { gateway, rest } = await ctx.client.ping();
    ctx.editOrRespond({
      embed: {
        title: 'About the Bot',
        color: COLORS.EMBED_COLOR,
        description: `Generate Time tags with ease!\n\nGateway Ping: ${gateway}ms\nREST Ping: ${rest}ms\nShard number: ${ctx.client.shardId}\nTotal Shards: ${ctx.client.shardCount}`,
      },
      components: [supportRow],
    });
  },
});
