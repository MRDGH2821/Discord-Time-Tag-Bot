const { version } = require('../package.json');

module.exports = {
	name: 'activity',
	execute(client) {
		const activities = [
			{
				text: `/help in ${client.guild.cache.size} server(s)`,
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
				text: `bot version ${version}`,
				obj: {
					type: 'PLAYING',
				},
			},
		];
		client.user.setActivity(activities[2].text, activities[2].obj);
		console.log('Activities:\n', activities[2].text, activities[2].obj);

		setInterval(() => {
			const act =
        activities[Math.floor(Math.random() * (activities.length - 1) + 1)];
			console.log(act);
			client.user.setActivity(act.text, act.obj);
		}, 5000);
	},
};
