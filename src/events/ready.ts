import { GatewayClientEvents } from 'detritus-client';
import { ActivityTypes, ClientEvents } from 'detritus-client/lib/constants';
import { version } from '../../package.json';
import BotEvent from '../lib/BotEvent';
import EnvConfig from '../lib/EnvConfig';

export default new BotEvent({
  event: ClientEvents.GATEWAY_READY,
  async listener(args) {
    //  console.log(args);
    const shardClient: GatewayClientEvents.ClusterEvent['shard'] = args.shard;
    const gatewayRaw: GatewayClientEvents.GatewayReady['raw'] = args.raw;
    console.log(`Ready! Logged in as ${gatewayRaw.user.username}#${gatewayRaw.user.discriminator}`);
    console.log(
      'Guild commands: ',
      await shardClient.rest.fetchApplicationGuildCommands(
        shardClient.applicationId,
        EnvConfig.guildId,
      ),
    );

    console.log(
      'Global commands: ',
      await shardClient.rest.fetchApplicationCommands(shardClient.applicationId),
    );
    const activities = [
      {
        name: `bot version ${version}`,
        type: ActivityTypes.PLAYING,
      },
      {
        name: `/help in ${shardClient.guilds.cache.size} server(s)`,
        type: ActivityTypes.LISTENING,
      },
      {
        name: 'a new event happen',
        type: ActivityTypes.WATCHING,
      },
      {
        name: `an event in one of ${shardClient.guilds.cache.size} server(s)`,
        type: ActivityTypes.PLAYING,
      },
      {
        name: 'an event manager',
        type: ActivityTypes.LISTENING,
      },
    ];
    shardClient.gateway.setPresence({
      activity: activities[0],
    });
    const delay = 30000;

    setInterval(() => {
      const act = activities[Math.floor(Math.random() * activities.length)];
      console.log(act);
      shardClient.gateway.setPresence({ activity: act });
    }, delay);
  },
});
