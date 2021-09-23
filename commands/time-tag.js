const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('time-tag')
		.setDescription('Generates Time tag!')
		.addIntegerOption(option =>
			option.setName('year')
				.setDescription('Year in 4 digits')
				.setRequired(true))
		.addIntegerOption(option =>
			option.setName('month')
				.setDescription('Month in 2 digits')
				.setRequired(true)
				.addChoice('1', 1)
				.addChoice('2', 2)
				.addChoice('3', 3)
				.addChoice('4', 4)
				.addChoice('5', 5)
				.addChoice('6', 6)
				.addChoice('7', 7)
				.addChoice('8', 8)
				.addChoice('9', 9)
				.addChoice('10', 10)
				.addChoice('11', 11)
				.addChoice('12', 12),
		)
		.addIntegerOption(option =>
			option.setName('day')
				.setDescription('Day in 2 digits')
				.setRequired(true),
		)
		.addIntegerOption(option =>
			option.setName('hour')
				.setDescription('Hour in 2 digits')
				.setRequired(true))
		.addIntegerOption(option =>
			option.setName('min')
				.setDescription('Minutes in 2 digits')
				.setRequired(true)),
	async execute(interaction) {

		const year = interaction.options.getInteger('year');
		const month = interaction.options.getInteger('month');
		const day = interaction.options.getInteger('day');
		const hour = interaction.options.getInteger('hour');
		const min = interaction.options.getInteger('min');
		const epoch = new Date(year, month - 1, day, hour, min).valueOf() / 1000;
		if (epoch) return interaction.reply(`Time Tag: \`${epoch}\` \n<t:${epoch}> \n Year: ${year} Month: ${month} Day: ${day} Hour: ${hour} Minute: ${min}`);
		return interaction.reply('uhhh');
	},
};

/*  Date choices

.addChoice('1', 1)
	.addChoice('2', 2)
	.addChoice('3', 3)
	.addChoice('4', 4)
	.addChoice('5', 5)
	.addChoice('6', 6)
	.addChoice('7', 7)
	.addChoice('8', 8)
	.addChoice('9', 9)
	.addChoice('10', 10)
	.addChoice('11', 11)
	.addChoice('12', 12)
	.addChoice('13', 13)
	.addChoice('14', 14)
	.addChoice('15', 15)
	.addChoice('16', 16)
	.addChoice('17', 17)
	.addChoice('18', 18)
	.addChoice('19', 19)
	.addChoice('20', 20)
	.addChoice('21', 21)
	.addChoice('22', 22)
	.addChoice('23', 23)
	.addChoice('24', 24)
	.addChoice('25', 25)
	.addChoice('26', 26)
	.addChoice('27', 27)
	.addChoice('28', 28)
	.addChoice('29', 29)
	.addChoice('30', 30)
	.addChoice('31', 31)*/
