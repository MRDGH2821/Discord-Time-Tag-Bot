const { SlashCommandBuilder } = require('@discordjs/builders');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('time_tag_advanced')
		.setDescription('Generates Time tag in custom TimeZone!')
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
		)
		.addStringOption(option =>
			option.setName('meridiem')
				.setDescription('Ante or Post meridiem (AM or PM)')
				.setRequired(true)
				.addChoice('am', 'am')
				.addChoice('pm', 'pm'),
		)
		.addStringOption(option =>
			option.setName('utc')
				.setDescription('Enter Offset from UTC (for eg -> -05:00 or +06:30 or +00:00)')
				.setRequired(true),
		),
	async execute(interaction) {

		const year = interaction.options.getInteger('year');
		const month = interaction.options.getInteger('month');
		const day = interaction.options.getInteger('day');
		const hour = interaction.options.getInteger('hours');
		const min = interaction.options.getInteger('minutes');
		const meridiem = interaction.options.getString('meridiem');
		const utcOff = interaction.options.getString('utc');

		const daystr = year + ' ' + month + ' ' + day + ' ' + hour + ' ' + min + ' ' + meridiem + ' ' + utcOff;
		const epoch = dayjs(daystr, 'YYYY M D HH m a Z').unix();

		try {
			await interaction.reply(`Time String: ${daystr} \nTime Epoch: \`${epoch}\` \n<t:${epoch}> \n Year: ${year} Month: ${month} Day: ${day} Hour: ${hour} Minute: ${min} ${meridiem} UTC: ${utcOff}`);
			await interaction.followUp(`\`<t:${epoch}>\``);
		}
		catch (error) {
			console.error(error);
			return interaction.reply(`Uhhh, sorry an error occured. Please use /help command & reach out bot developer with error screenshot.\nError dump: ${error}`);
		}
	},
};
