const { version } = require('../package.json');

module.exports = {
  name: 'ready',
  once: true,
  // eslint-disable-next-line sort-keys
  execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    const activities = [
        {
          msg: `bot version ${version}`,
          obj: {
            type: 'PLAYING'
          }
        },
        {
          msg: `/help in ${client.guilds.cache.size} server(s)`,
          obj: {
            type: 'LISTENING'
          }
        },
        {
          msg: 'a new event happen',
          obj: {
            type: 'WATCHING'
          }
        },
        {
          msg: `an event in one of ${client.guilds.cache.size} server(s)`,
          obj: {
            type: 'PLAYING'
          }
        },
        {
          msg: 'an event manager',
          obj: {
            type: 'LISTENING'
          }
        }
      ],
      delay = 30000;
    // console.log(activities);
    client.user.setActivity(activities[0].msg, activities[0].obj);
    // console.log('Activities:\n', activities[2].msg, activities[2].obj);
    setInterval(() => {
      const act = activities[Math.floor(Math.random() * activities.length)];
      console.log(act);
      client.user.setActivity(act.msg, act.obj);
    }, delay);
  }
};
