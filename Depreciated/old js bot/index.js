const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');

const client = new Discord.Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', () => {
	console.log('Ready!');
});

client.login(token);
