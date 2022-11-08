import { GatewayClientEvents } from 'detritus-client';
import { ActivityTypes, ClientEvents } from 'detritus-client/lib/constants';
import BotEvent from '../lib/BotEvent';
import EnvConfig from '../lib/EnvConfig';

const { version } = require('../../package.json');

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
    // const delay = 30000;
    // shardClient.user?.presence?.activity = activities[0];
    // console.log(activities);
    /*
    client.user.setActivity(activities[0].name, activities[0].obj);
    // console.log('Activities:\n', activities[2].name, activities[2].obj);
    setInterval(() => {
      const act = activities[Math.floor(Math.random() * activities.length)];
      console.log(act);
      client.user.setActivity(act.name, act.obj);
    }, delay);
    */
  },
});
