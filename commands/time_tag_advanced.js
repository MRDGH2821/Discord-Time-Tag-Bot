const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');
const { DateTimeCheck } = require('../lib/CheckerFunctions.js');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);


module.exports = {
	data: new SlashCommandBuilder()
		.setName('time_tag_advanced')
		.setDescription('Generates Time tag in custom TimeZone!')
		.addIntegerOption(option =>
			option
				.setName('year')
				.setDescription('Enter Year in YYYY format')
				.setRequired(true),
		)
		.addIntegerOption(option =>
			option
				.setName('month')
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
			option
				.setName('day')
				.setDescription('Enter Day in DD format')
				.setRequired(true),
		)
		.addIntegerOption(option =>
			option
				.setName('hours')
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
			option
				.setName('minutes')
				.setDescription('Enter Minutes in MM format')
				.setRequired(true),
		)
		.addStringOption(option =>
			option
				.setName('meridiem')
				.setDescription('Ante or Post meridiem (AM or PM)')
				.setRequired(true)
				.addChoice('am', 'am')
				.addChoice('pm', 'pm'),
		)
		.addStringOption(option =>
			option
				.setName('utc')
				.setDescription(
					'Enter Offset from UTC (for eg -> -05:00 or +06:30 or +00:00)',
				)
				.setRequired(true),
		),

	async execute(interaction) {
		const year = interaction.options.getInteger('year');
		let month = interaction.options.getInteger('month');
		let date = interaction.options.getInteger('day');
		let hour = interaction.options.getInteger('hours');
		let minute = interaction.options.getInteger('minutes');
		const meridiem = interaction.options.getString('meridiem');
		let utcOff = interaction.options.getString('utc');
		const oldUtc = utcOff;
		let utcProcess;

		// TimeZone Validator using Regex
		if (/^([+|-]{1})([0-1]{1}[0-9]{1}):?([0-6]{1}[0-9]{1})/g.test(utcOff)) {
			console.log('Timezone is valid.');
		}
		else {
			if (!/^(\+|-)/gm.test(utcOff)) {
				// if no sign provided, add positive sign by default.
				utcOff = `+${utcOff}`;
			}
			// Extract Sign
			const sign = utcOff.charAt(0);

			// Extract rest of the string for validation
			utcProcess = utcOff.slice(1);
			// console.log(utcProcess);

			if (/:/gm.test(utcProcess)) {
				// removes colon from timezone
				utcProcess = utcProcess.split(':').join();
			}

			if (/^\d{3}$/gm.test(utcProcess)) {
				// /three digit processing
				if (/^[0-1]{1}[0-2]{1}[0-6]{1}$/gm.test(utcProcess)) {
					// if the number lies in between 000-126
					utcProcess = `${utcProcess.slice(0, 2)}:${utcProcess.charAt(2)}0`;
				}
				else {
					// in other cases, first digit will be extracted & rest 2 ill be put in end
					utcProcess = `0${utcProcess.charAt(0)}:${utcProcess.slice(1)}`;
				}
			}

			if (/^\d{2}$/gm.test(utcProcess)) {
				// two digit rocessing
				if (/^[1][0-2]$/gm.test(utcProcess)) {
					// if the two digits are 10,11,12; just append :00
					utcProcess = `${utcProcess}:00`;
				}
				else {
					// for other cases, split in middle & proceed
					utcProcess = `0${utcProcess[0]}:${utcProcess[1]}0`;
				}
			}

			if (/^\d{1}$/gm.test(utcProcess)) {
				// single digit processing
				utcProcess = `0${utcProcess}:00`;
			}

			// Finally assign processed string, free of mistakes.
			utcOff = `${sign}${utcProcess}`;
		}

		// Regex checker for other variables
		if (/^\d{1}$/gm.test(month)) {
			month = `0${month}`;
		}
		if (/^\d{1}$/gm.test(date)) {
			date = `0${date}`;
		}
		if (/^\d{1}$/gm.test(hour)) {
			hour = `0${hour}`;
		}
		if (/^\d{1}$/gm.test(minute)) {
			minute = `0${minute}`;
		}

		const daystr = dayjs(`${year}-${month}-${date} ${hour}:${minute} ${meridiem} ${utcOff}`, 'YYYY-MM-DD hh:mm a Z').utc();
		const datey = `${year}-${month}-${date}`;
		const time = `${hour}:${minute}`;
		const epoch = daystr.unix();

		const tagOutput = {
			color: '0xf1efef',
			title: 'Time Tag Generated!',
			description: 'Click on corresponding button to get the time tag in your desired format! ',
			fields: [
				{
					name: 'Input given',
					value: `Time Epoch: \`${epoch}\` \nDate: ${datey} \nTime: ${time} \nUTC: ${utcOff}`,
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
			footer: {
				text: 'Just click on corresponding button to get time tag!',
			},
		};

		const row1 = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('formatone')
					.setLabel('Format 1')
					.setStyle('PRIMARY'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('formattwo')
					.setLabel('Format 2')
					.setStyle('PRIMARY'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('formatthree')
					.setLabel('Format 3')
					.setStyle('PRIMARY'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('formatfour')
					.setLabel('Format 4')
					.setStyle('PRIMARY'),
			);
		const row2 = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('formatfive')
					.setLabel('Format 5')
					.setStyle('PRIMARY'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('formatsix')
					.setLabel('Format 6')
					.setStyle('PRIMARY'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('formatseven')
					.setLabel('Format 7')
					.setStyle('PRIMARY'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('formateight')
					.setLabel('Format 8')
					.setStyle('PRIMARY'),
			);

		const utcBool = /^([+|-]{1})([0-1]{1}[0-9]{1}):?([0-6]{1}[0-9]{1})/g.test(
			utcOff,
		);
		const dateBool = DateTimeCheck(year, month, date, minute);
		// console.log(month);
		// console.log(dateBool);

		const errRow = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setLabel('Join Support Server')
					.setStyle('LINK')
					.setURL('https://discord.gg/MPtE9zsBs5'),
			)
			.addComponents(
				new MessageButton()
					.setLabel('Submit an Issue at GitHub')
					.setStyle('LINK')
					.setURL('https://github.com/MRDGH2821/Discord-Time-Tag-Bot/issues'),
			)
			.addComponents(
				new MessageButton()
					.setLabel('Backup Time Tag Generator')
					.setStyle('LINK')
					.setURL('https://hammertime.djdavid98.art/'),
			);

		const bkpRow = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setLabel('Backup Time Tag Generator')
					.setStyle('LINK')
					.setURL('https://hammertime.djdavid98.art/'),
			)
			.addComponents(
				new MessageButton()
					.setLabel('Invite Bot in your server!')
					.setStyle('LINK')
					.setURL('https://discord.com/api/oauth2/authorize?client_id=890243200579694672&permissions=274878188544&scope=bot%20applications.commands'),
			);

		try {
			if (utcBool && dateBool) {
				const msg = await interaction.reply({
					embeds: [tagOutput],
					fetchReply: true,
					components: [row1, row2],
				});
				const collector = msg.createMessageComponentCollector({
					componentType: 'BUTTON',
					time: 15000,
				});
				collector.on('collect', i => {
					if (i.customId === 'formatone') {
						i.reply(`\`<t:${epoch}:t>\``);
					}
					else if (i.customId === 'formattwo') {
						i.reply(`\`<t:${epoch}:T>\``);
					}
					else if (i.customId === 'formatthree') {
						i.reply(`\`<t:${epoch}:d>\``);
					}
					else if (i.customId === 'formatfour') {
						i.reply(`\`<t:${epoch}:D>\``);
					}
					else if (i.customId === 'formatfive') {
						i.reply(`\`<t:${epoch}:f>\``);
					}
					else if (i.customId === 'formatsix') {
						i.reply(`\`<t:${epoch}:F>\``);
					}
					else if (i.customId === 'formatseven') {
						i.reply(`\`<t:${epoch}:R>\``);
					}
					else if (i.customId === 'formateight') {
						i.reply(`\`<t:${epoch}>\``);
					}
				});

				collector.on('end', collected => {
					console.log(`Collected ${collected.size} interactions.`);
					tagOutput.footer.text = 'Time out! Re-run the command again.';
					return interaction.editReply({ embeds: [tagOutput], components: [bkpRow] });
				});
			}
			else {
				const errEmb = {
					color: '0xf1efef',
					title: 'Invalid Input!',
					description: 'Please check the inputs you have provided!',
					fields: [
						{
							name: 'Inputs *before* processing',
							value: `Date: \`${year}-${month}-${date}\` \nTime: \`${hour}:${minute} ${meridiem}\` \nTimezone: \`${oldUtc}\``,
						},
						{
							name: 'Inputs *after* processing',
							value: `Date (library): \`${daystr.format('YYYY-MM-DD')}\` \nTime (library): \`${daystr.format('hh:mm a')}\` \nTimezone (processed): \`${utcOff}\` \nTimezone (library):\`${daystr.format('Z')}\``,
						},
						{
							name: 'Regex used for evaluating TimeZone',
							value: '`/^([+|-]{1})([0-1]{1}[0-9]{1}):?([0-6]{1}[0-9]{1})/g`',
						},
						{
							name: 'Library & UTC mode',
							value: `Dayjs Library. UTC Mode: \`${daystr.$u}\``,
						},
						{
							name: 'Possible Reasons for invalid input',
							value: 'Processed timezone is not matching with input provided, Date doesn\'t exist, Minutes exceed 60',
						},
					],
				};

				return await interaction.reply({
					embeds: [errEmb],
					fetchReply: true,
					components:[errRow],
				});
			}
		}
		catch (error) {
			console.error(error);
			return interaction.reply({ contents: `Uhhh, sorry an error occured. Please use \`/help\` command & reach out bot developer with error screenshot.\nError dump: \n\`${error}\``, components:[errRow] },
			);
		}
	},
};
