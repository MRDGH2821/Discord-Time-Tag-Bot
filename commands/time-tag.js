const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('time-tag')
		.setDescription('Generates Time tag!')
		.addIntegerOption(option =>
			option.setName('year')
				.setDescription('Year in 4 digits')
				.setRequired(true)),

	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};
