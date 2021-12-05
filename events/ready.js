const { version } = require('../package.json');

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		const activities = [
			{
				text: `bot version ${version}`,
				obj: {
					type: 'PLAYING',
				},
			},
			{
				text: `/help in ${client.guilds.cache.size} server(s)`,
				obj: {
					type: 'LISTENING',
				},
			},
			{
				text: 'a new event happen',
				obj: {
					type: 'WATCHING',
				},
			},
			{
				text: `an event in one of ${client.guilds.cache.size} server(s)`,
				obj: {
					type: 'PLAYING',
				},
			},
			{
				text: 'an event manager',
				obj: {
					type: 'LISTENING',
				},
			},
		];
		// console.log(activities);
		client.user.setActivity(activities[0].text, activities[0].obj);
		// console.log('Activities:\n', activities[2].text, activities[2].obj);
		setInterval(() => {
			const act = activities[Math.floor(Math.random() * activities.length)];
			console.log(act);
			client.user.setActivity(act.text, act.obj);
		}, 30000);
	},
};
