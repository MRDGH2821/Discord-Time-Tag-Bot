const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const helpEmbed = new MessageEmbed()
	.setColor('#0099ff')
	.setTitle('Help Section')
	.setURL('https://discord.gg/MPtE9zsBs5')
	.setDescription('The help section you get you started!\nThe bot takes in various inputs & generates epoch & time tag for you.')
	.addFields(
		{ name: 'Year', value: 'Year input should be in `YYYY` format. For example `2021`. Other formats may confuse the bot.' },
		{ name: 'Month', value: 'Month input should be in `MM` or `m` format. For example `9` or `09`. It supports integer format only & might throw error when wrong format used.' },
		{ name: 'Day', value: 'Same input rules as Month. Do note that if the Day exceeds 30 or 31 for a particular month, it will not throw error. Instead time tag will be generated after computing excess days. For example Input is `2021 09 32` September has only 30 days so the time tag will be generated for `2021 10 2` i.e. `October 2 2021`' },
		{ name: 'Hours', value: 'Same input rules as month' },
		{ name: 'Minutes', value: 'Same input rules as month' },
		{ name: 'Meridien', value: 'Ante meridien or Post Meridien (`AM` or `PM`)' },
		{ name: 'UTC', value: 'Takes value in UTC Offset. For example -> `+05:00` or `-06:30` or `+00:00`. It is syntax sensitive. That means, you have to explictly put sign (`+` or `-`)' },
		{ name: 'Bot still not working?', value: 'Please join my [server](https://discord.gg/MPtE9zsBs5) & elaborate how you encountered that problem' },
	);


module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('The help section to get you started!'),

	async execute(interaction) {
		await interaction.send({ embeds:[helpEmbed] });
	},
};
