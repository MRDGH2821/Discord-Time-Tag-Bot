const { SlashCommandBuilder } = require('@discordjs/builders');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('time_tag')
		.setDescription('Generates Time tag in your local TimeZone! Simple & Easy!')
		.addIntegerOption(option =>
			option.setName('year')
				.setDescription('Enter Year in YYYY format')
				.setRequired(true))
		.addIntegerOption(option =>
			option.setName('month')
				.setDescription('Enter Month in MM format')
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
				.setDescription('Enter Day in DD format')
				.setRequired(true),
		)
		.addIntegerOption(option =>
			option.setName('hours')
				.setDescription('Enter Hours in 12-hour format')
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
			option.setName('minutes')
				.setDescription('Enter Minutes')
				.setRequired(true),
		).addStringOption(option =>
			option.setName('meridiem')
				.setDescription('Ante or Post meridiem (AM or PM)')
				.setRequired(true)
				.addChoice('am', 'am')
				.addChoice('pm', 'pm'),
		),

	async execute(interaction) {

		const year = interaction.options.getInteger('year');
		const month = interaction.options.getInteger('month');
		const day = interaction.options.getInteger('day');
		const hour = interaction.options.getInteger('hours');
		const min = interaction.options.getInteger('minutes');
		const meridiem = interaction.options.getString('meridiem');

		const daystr = year + ' ' + month + ' ' + day + ' ' + hour + ' ' + min + ' ' + meridiem;
		const epoch = dayjs(daystr, 'YYYY M D HH m a').unix();

		try {

			await interaction.reply(`Time Epoch: \`${epoch}\` \nTime Tag: <t:${epoch}> \nYear: ${year} Month: ${month} Day: ${day} Hour: ${hour} Minute: ${min} ${meridiem}`);
			await interaction.followUp(`\`<t:${epoch}>\``);
		}
		catch (error) {
			console.error(error);
			return interaction.reply(`Uhhh, sorry an error occured. Please use /help command & reach out bot developer with error screenshot.\nError dump: ${error}`);

		}
	},
};

/* Timezone Choices from time.is site

.addIntegerOption(option =>
	option.setName('timezone')
		.setDescription('Enter TimeZone Offset (By default it is in your local TimeZone)')
		.addChoice('-12', 1)
		.addChoice('-11', 2)
		.addChoice('-10', 3)
		.addChoice('-9:30', 4)
		.addChoice('-9', 5)
		.addChoice('-8', 6)
		.addChoice('-7', 7)
		.addChoice('-6', 8)
		.addChoice('-5', 9)
		.addChoice('-4', 10)
		.addChoice('-3', 11)
		.addChoice('-2:30', 12)
		.addChoice('-2', 13)
		.addChoice('-1', 14)
		.addChoice('0', 15)
		.addChoice('+1', 16)
		.addChoice('+2', 17)
		.addChoice('+3', 18)
		.addChoice('+3:30', 19)
		.addChoice('+4', 20)
		.addChoice('+4:30', 21)
		.addChoice('+5', 22)
		.addChoice('+5:30', 23)
		.addChoice('+5:45', 24)
		.addChoice('+6', 25)
		.addChoice('+6:30', 26)
		.addChoice('+7', 27)
		.addChoice('+8', 28)
		.addChoice('+8:45', 29)
		.addChoice('+9', 30)
		.addChoice('+9:30', 31)
		.addChoice('+10', 32)
		.addChoice('+10:30', 33)
		.addChoice('+11', 34)
		.addChoice('+12', 35)
		.addChoice('+12:45', 36)
		.addChoice('+13', 37)
		.addChoice('+14', 38),

		*/

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
