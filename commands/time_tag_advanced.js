/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines */
const dayjs = require('dayjs');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { bkpRow, errRow } = require('../lib/RowButtons.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { dateTimeCheck } = require('../lib/CheckerFunctions.js');
const utc = require('dayjs/plugin/utc');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);
dayjs.extend(utc);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('time_tag_advanced')
    .setDescription('Generates Time tag in custom TimeZone!')
    .addIntegerOption((option) => option
      .setName('year')
      .setDescription('Enter Year in YYYY format')
      .setRequired(true))
    .addIntegerOption((option) => option
      .setName('month')
      .setDescription('Enter Month in MM format')
      .setRequired(true)
      .setMinValue(1)
      .setMaxValue(12))
    .addIntegerOption((option) => option
      .setName('day')
      .setDescription('Enter Day in DD format')
      .setRequired(true)
      .setMinValue(1)
      .setMaxValue(31))
    .addIntegerOption((option) => option
      .setName('hours')
      .setDescription('Enter Hours in 12-hour format')
      .setRequired(true)
      .setMinValue(1)
      .setMaxValue(12))
    .addIntegerOption((option) => option
      .setName('minutes')
      .setDescription('Enter Minutes in MM format')
      .setRequired(true)
      .setMinValue(0)
      .setMaxValue(59))
    .addStringOption((option) => option
      .setName('meridiem')
      .setDescription('Ante or Post meridiem (AM or PM)')
      .setRequired(true)
      .addChoice('am', 'am')
      .addChoice('pm', 'pm'))
    .addStringOption((option) => option
      .setName('utc')
      .setDescription('Enter Offset from UTC (for eg -> -05:00 or +06:30 or +00:00)')
      .setRequired(true)),

  async execute(interaction) {
    let date = interaction.options.getInteger('day'),
      hour = interaction.options.getInteger('hours'),
      minute = interaction.options.getInteger('minutes'),
      month = interaction.options.getInteger('month'),
      utcOff = interaction.options.getString('utc'),
      utcProcess = '';
    const meridiem = interaction.options.getString('meridiem'),
      oldUtc = utcOff,
      year = interaction.options.getInteger('year');

    // timeZone Validator using Regex
    if ((/^([+|-]{1})([0-1]{1}[0-9]{1}):?([0-6]{1}[0-9]{1})/gu).test(utcOff)) {
      console.log('Timezone is valid.');
    }
    else {
      if (!(/^(\+|-)/gmu).test(utcOff)) {
        // if no sign provided, add positive sign by default.
        utcOff = `+${utcOff}`;
      }
      // extract Sign
      // eslint-disable-next-line no-magic-numbers
      const sign = utcOff.charAt(0);

      // extract rest of the string for validation
      // eslint-disable-next-line no-magic-numbers
      utcProcess = utcOff.slice(1);
      // console.log(utcProcess);

      if ((/:/gmu).test(utcProcess)) {
        // removes colon from timezone
        utcProcess = utcProcess.split(':').join();
      }

      if ((/^\d{3}$/gmu).test(utcProcess)) {
        // /three digit processing
        if ((/^[0-1]{1}[0-2]{1}[0-6]{1}$/gmu).test(utcProcess)) {
          // if the number lies in between 000-126
          // eslint-disable-next-line no-magic-numbers
          utcProcess = `${utcProcess.slice(0, 2)}:${utcProcess.charAt(2)}0`;
        }
        else {
          // in other cases, first digit will be extracted & rest 2 ill be put in end
          // eslint-disable-next-line no-magic-numbers
          utcProcess = `0${utcProcess.charAt(0)}:${utcProcess.slice(1)}`;
        }
      }

      if ((/^\d{2}$/gmu).test(utcProcess)) {
        // two digit rocessing
        if ((/^[1][0-2]$/gmu).test(utcProcess)) {
          // if the two digits are 10,11,12; just append :00
          utcProcess = `${utcProcess}:00`;
        }
        else {
          // for other cases, split in middle & proceed
          utcProcess = `0${utcProcess[0]}:${utcProcess[1]}0`;
        }
      }

      if ((/^\d{1}$/gmu).test(utcProcess)) {
        // single digit processing
        utcProcess = `0${utcProcess}:00`;
      }

      // finally assign processed string, free of mistakes.
      utcOff = `${sign}${utcProcess}`;
    }

    // regex checker for other variables
    if ((/^\d{1}$/gmu).test(month)) {
      month = `0${month}`;
    }
    if ((/^\d{1}$/gmu).test(date)) {
      date = `0${date}`;
    }
    if ((/^\d{1}$/gmu).test(hour)) {
      hour = `0${hour}`;
    }
    if ((/^\d{1}$/gmu).test(minute)) {
      minute = `0${minute}`;
    }

    // eslint-disable-next-line one-var
    const daystr = dayjs(
        `${year}-${month}-${date} ${hour}:${minute} ${meridiem} ${utcOff}`,
        'YYYY-MM-DD hh:mm a Z'
      ).utc(),
      // eslint-disable-next-line sort-vars
      datey = `${year}-${month}-${date}`,
      epoch = daystr.unix(),
      time = `${hour}:${minute}`,
      // eslint-disable-next-line sort-vars
      tagOutput = new MessageEmbed()
        .setColor('f1efef')
        .setTitle('Time Tag Generated!')
        .setDescription('Click on corresponding button to get the time tag in your desired format!')
        .addFields([
          {
            name: 'Input given',
            value: `Time Epoch: \`${epoch}\` \nDate: ${datey} \nTime: ${time} \nUTC: ${utcOff}`
          },
          {
            name: 'Format 1',
            value: `\`<t:${epoch}:t>\` <t:${epoch}:t>`
          },
          {
            name: 'Format 2',
            value: `\`<t:${epoch}:T>\` <t:${epoch}:T>`
          },
          {
            name: 'Format 3',
            value: `\`<t:${epoch}:d>\` <t:${epoch}:d>`
          },
          {
            name: 'Format 4',
            value: `\`<t:${epoch}:D>\` <t:${epoch}:D>`
          },
          {
            name: 'Format 5',
            value: `\`<t:${epoch}:f>\` <t:${epoch}:f>`
          },
          {
            name: 'Format 6',
            value: `\`<t:${epoch}:F>\` <t:${epoch}:F>`
          },
          {
            name: 'Format 7',
            value: `\`<t:${epoch}:R>\` <t:${epoch}:R>`
          },
          {
            name: 'Format 8',
            value: `\`<t:${epoch}>\` <t:${epoch}>`
          }
        ]),
      // eslint-disable-next-line sort-vars
      row1 = new MessageActionRow()
        .addComponents(new MessageButton()
          .setCustomId('formatone')
          .setLabel('Format 1')
          .setStyle('PRIMARY'))
        .addComponents(new MessageButton()
          .setCustomId('formattwo')
          .setLabel('Format 2')
          .setStyle('PRIMARY'))
        .addComponents(new MessageButton()
          .setCustomId('formatthree')
          .setLabel('Format 3')
          .setStyle('PRIMARY'))
        .addComponents(new MessageButton()
          .setCustomId('formatfour')
          .setLabel('Format 4')
          .setStyle('PRIMARY')),
      // eslint-disable-next-line sort-vars
      row2 = new MessageActionRow()
        .addComponents(new MessageButton()
          .setCustomId('formatfive')
          .setLabel('Format 5')
          .setStyle('PRIMARY'))
        .addComponents(new MessageButton()
          .setCustomId('formatsix')
          .setLabel('Format 6')
          .setStyle('PRIMARY'))
        .addComponents(new MessageButton()
          .setCustomId('formatseven')
          .setLabel('Format 7')
          .setStyle('PRIMARY'))
        .addComponents(new MessageButton()
          .setCustomId('formateight')
          .setLabel('Format 8')
          .setStyle('PRIMARY')),
      utcBool = (/^([+|-]{1})([0-1]{1}[0-9]{1}):?([0-6]{1}[0-9]{1})/gu).test(utcOff),
      // eslint-disable-next-line sort-vars
      dateBool = dateTimeCheck(year, month, date);

    /*
     * console.log(month);
     * console.log(dateBool);
     */

    try {
      if (utcBool && dateBool) {
        const msg = await interaction.reply({
            components: [
              row1,
              row2
            ],
            embeds: [tagOutput],
            fetchReply: true
          }),
          msgcollector = msg.createMessageComponentCollector({
            componentType: 'BUTTON',
            time: 15000
          });
        msgcollector.on('collect', (interacted) => {
          if (interacted.customId === 'formatone') {
            interacted.reply(`\`<t:${epoch}:t>\``);
          }
          else if (interacted.customId === 'formattwo') {
            interacted.reply(`\`<t:${epoch}:T>\``);
          }
          else if (interacted.customId === 'formatthree') {
            interacted.reply(`\`<t:${epoch}:d>\``);
          }
          else if (interacted.customId === 'formatfour') {
            interacted.reply(`\`<t:${epoch}:D>\``);
          }
          else if (interacted.customId === 'formatfive') {
            interacted.reply(`\`<t:${epoch}:f>\``);
          }
          else if (interacted.customId === 'formatsix') {
            interacted.reply(`\`<t:${epoch}:F>\``);
          }
          else if (interacted.customId === 'formatseven') {
            interacted.reply(`\`<t:${epoch}:R>\``);
          }
          else if (interacted.customId === 'formateight') {
            interacted.reply(`\`<t:${epoch}>\``);
          }
        });

        msgcollector.on('end', (collected) => {
          console.log(`Collected ${collected.size} interactions.`);
          return interaction.editReply({
            components: [bkpRow],
            embeds: [tagOutput]
          });
        });
      }
      else {
        const errEmb = new MessageEmbed()
          .setColor('f1efef')
          .setTitle('Invalid Input!')
          .setDescription('Please check the inputs you have provided!')
          .addFields([
            {
              name: 'Inputs *before* processing',
              value: `Date: \`${year}-${month}-${date}\` \nTime: \`${hour}:${minute} ${meridiem}\` \nTimezone: \`${oldUtc}\``
            },
            {
              name: 'Inputs *after* processing',
              value: `Date (library): \`${daystr.format('YYYY-MM-DD')}\` \nTime (library): \`${daystr.format('hh:mm a')}\` \nTimezone (processed): \`${utcOff}\` \nTimezone (library):\`${daystr.format('Z')}\``
            },
            {
              name: 'Regex used for evaluating TimeZone',
              value: '`/^([+|-]{1})([0-1]{1}[0-9]{1}):?([0-6]{1}[0-9]{1})/g`'
            },
            {
              name: 'Library & UTC mode',
              value: `Dayjs Library. UTC Mode: \`${daystr.$u}\``
            },
            {
              name: 'Possible Reasons for invalid input',
              value:
                'Processed timezone is not matching with input provided, Date doesn\'t exist.'
            }
          ]);
        await interaction.reply({
          components: [errRow],
          embeds: [errEmb],
          fetchReply: true
        });
      }
    }
    catch (error) {
      console.error(error);
      await interaction.reply({
        components: [errRow],
        contents: `Uhhh, sorry an error occured. Please use \`/help\` command & reach out bot developer with error screenshot.\nError dump: \n\`${error}\``
      });
    }
  }
};
