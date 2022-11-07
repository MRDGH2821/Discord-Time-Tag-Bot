import { GatewayClientEvents } from 'detritus-client';
import { ClientEvents } from 'detritus-client/lib/constants';
import BotEvent from '../lib/BotEvent';

const { version } = require('../../package.json');

export default new BotEvent({
  event: ClientEvents.GATEWAY_READY,
  listener(args) {
    console.log(args);
    const client: GatewayClientEvents.ClusterEvent['shard'] = args.shard;
    const gatewayRaw: GatewayClientEvents.GatewayReady['raw'] = args.raw;
    console.log(`Ready! Logged in as ${gatewayRaw.user.username}#${gatewayRaw.user.discriminator}`);

    const activities = [
      {
        msg: `bot version ${version}`,
        obj: {
          type: 'PLAYING',
        },
      },
      {
        msg: `/help in ${client.guilds.cache.size} server(s)`,
        obj: {
          type: 'LISTENING',
        },
      },
      {
        msg: 'a new event happen',
        obj: {
          type: 'WATCHING',
        },
      },
      {
        msg: `an event in one of ${client.guilds.cache.size} server(s)`,
        obj: {
          type: 'PLAYING',
        },
      },
      {
        msg: 'an event manager',
        obj: {
          type: 'LISTENING',
        },
      },
    ];
    const delay = 30000;
    // console.log(activities);
    /*
    client.user.setActivity(activities[0].msg, activities[0].obj);
    // console.log('Activities:\n', activities[2].msg, activities[2].obj);
    setInterval(() => {
      const act = activities[Math.floor(Math.random() * activities.length)];
      console.log(act);
      client.user.setActivity(act.msg, act.obj);
    }, delay);
    */
  },
});
