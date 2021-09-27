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
				.addChoice('01', 1)
				.addChoice('02', 2)
				.addChoice('03', 3)
				.addChoice('04', 4)
				.addChoice('05', 5)
				.addChoice('06', 6)
				.addChoice('07', 7)
				.addChoice('08', 8)
				.addChoice('09', 9)
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

		const tagOutput = {
			color: 0x0099ff,
			title: 'Time Tag Generated!',
			description: 'React with/Click on corresponding emoji to get the time tag in your desired format! ',
			fields: [
				{
					name: 'Input given',
					value: `Time Epoch: \`${epoch}\` \n${year}-${month}-${day} \nTime: ${hour}:${min} ${meridiem} \nUTC: ${utcOff}`,
				},
				{
					name: 'Format 1',
					value: `\`<t:${epoch}:t>\` <t:${epoch}:t>`,
				},
				{
					name: 'Format 2',
					value: `\`<t:${epoch}:T>\` <t:${epoch}:T>`,
				},
				{
					name: 'Format 3',
					value: `\`<t:${epoch}:d>\` <t:${epoch}:d>`,
				},
				{
					name: 'Format 4',
					value: `\`<t:${epoch}:D>\` <t:${epoch}:D>`,
				},
				{
					name: 'Format 5',
					value: `\`<t:${epoch}:f>\` <t:${epoch}:f>`,
				},
				{
					name: 'Format 6',
					value: `\`<t:${epoch}:F>\` <t:${epoch}:F>`,
				},
				{
					name: 'Format 7',
					value: `\`<t:${epoch}:R>\` <t:${epoch}:R>`,
				},
				{
					name: 'Format 8',
					value: `\`<t:${epoch}>\` <t:${epoch}>`,
				},
			],
			timestamp: new Date(),
			footer: {
				text: 'Just click on corresponding emoji to get time tag!',
			},
		};


		try {
			const msg = await interaction.reply({ embeds:[tagOutput], fetchReply: true });
			msg.react('<a:1_excited:892092443942600776>');
			await msg.react('<a:2_excited:892092443955175427>');
			await msg.react('<a:3_excited:892092444429135972>');
			await msg.react('<a:4_excited:892092444320075926> ');
			await msg.react('<a:5_excited:892092444282351656>');
			await msg.react('<a:6_excited:892092444437544960>');
			await msg.react('<a:7_excited:892092444760477726>');
			await msg.react('<a:8_excited:892092445322518588> ');

			const filter = (reaction, user) => {
				return ['<a:1_excited:892092443942600776>', '<a:2_excited:892092443955175427> ', '<a:3_excited:892092444429135972> ', '<a:4_excited:892092444320075926> ', '<a:5_excited:892092444282351656> ', '<a:6_excited:892092444437544960> ', '<a:7_excited:892092444760477726> ', '<a:8_excited:892092445322518588>'].includes(reaction.emoji.name) && user.id === interaction.user.id;
			};

			msg.awaitReactions({ filter, max: 1, time: 60000, errors: ['time'] })
				.then(collected => {
					const reaction = collected.first();

					if (reaction.emoji.name === '<a:1_excited:892092443942600776>') {
						msg.reply(`<t:${epoch}:t>`);
					}
					else if (reaction.emoji.name === '<a:2_excited:892092443955175427>') {
						msg.reply(`<t:${epoch}:T>`);
					}
					else if (reaction.emoji.name === '<a:3_excited:892092444429135972>') {
						msg.reply(`<t:${epoch}:d>`);
					}
					else if (reaction.emoji.name === '<a:4_excited:892092444320075926>') {
						msg.reply(`<t:${epoch}:D>`);
					}
					else if (reaction.emoji.name === '<a:5_excited:892092444282351656>') {
						msg.reply(`<t:${epoch}:f>`);
					}
					else if (reaction.emoji.name === '<a:6_excited:892092444437544960>') {
						msg.reply(`<t:${epoch}:F>`);
					}
					else if (reaction.emoji.name === '<a:7_excited:892092444760477726>') {
						msg.reply(`<t:${epoch}:R>`);
					}
					else if (reaction.emoji.name === '<a:8_excited:892092445322518588>') {
						msg.reply(`<t:${epoch}>`);
					}
				})
				.catch(collected => {
					interaction.followUp('Did not select option? Run the command again!');
				});
		}
		catch (error) {
			console.error(error);
			return interaction.reply(`Uhhh, sorry an error occured. Please use /help command & reach out bot developer with error screenshot.\nError dump: ${error}`);
		}
	},
};


/*
await interaction.reply(`Time String: ${daystr} \nTime Epoch: \`${epoch}\` \n<t:${epoch}> \n Year: ${year} Month: ${month} Day: ${day} Hour: ${hour} Minute: ${min} ${meridiem} UTC: ${utcOff}`);
await interaction.followUp(`\`<t:${epoch}>\``);
*/
