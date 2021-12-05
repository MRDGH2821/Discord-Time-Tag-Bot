const { SlashCommandBuilder } = require('@discordjs/builders');
const { time } = require('@discordjs/builders');
const date = new Date();

const timeString = time(date);
const relative = time(date, 'R');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user_info')
		.setDescription('Display info about yourself.'),
	async execute(interaction) {
		return interaction.reply(
			`Your username: ${interaction.user.username}\nYour ID: ${interaction.user.id}\nThe time on which this command was executed: ${timeString}\ni.e. ${relative}`,
		);
	},
};
