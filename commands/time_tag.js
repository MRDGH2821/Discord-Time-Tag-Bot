const dayjs = require('dayjs');
const { MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { DateTimeCheck } = require('../lib/CheckerFunctions.js');
const utc = require('dayjs/plugin/utc');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);
dayjs.extend(utc);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('time_tag')
    .setDescription('Generates Time tag in UTC! Simple & Easy!')
    .addIntegerOption((option) => option
      .setName('year')
      .setDescription('Enter Year in YYYY format')
      .setRequired(true))
    .addIntegerOption((option) => option
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
      .addChoice('12', 12))
    .addIntegerOption((option) => option
      .setName('day')
      .setDescription('Enter Day in DD format')
      .setRequired(true))
    .addIntegerOption((option) => option
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
      .addChoice('12', 12))
    .addIntegerOption((option) => option
      .setName('minutes')
      .setDescription('Enter Minutes')
      .setRequired(true))
    .addStringOption((option) => option
      .setName('meridiem')
      .setDescription('Ante or Post meridiem (AM or PM)')
      .setRequired(true)
      .addChoice('am', 'am')
      .addChoice('pm', 'pm')),

  async execute(interaction) {
    const year = interaction.options.getInteger('year');
    let month = interaction.options.getInteger('month'),
      day = interaction.options.getInteger('day'),
      hour = interaction.options.getInteger('hours'),
      min = interaction.options.getInteger('minutes');
    const meridiem = interaction.options.getString('meridiem');

    // regex validations for double digit parameters
    if ((/^\d{1}$/gm).test(month)) {
      month = `0${month}`;
    }
    if ((/^\d{1}$/gm).test(day)) {
      day = `0${day}`;
    }
    if ((/^\d{1}$/gm).test(hour)) {
      hour = `0${hour}`;
    }
    if ((/^\d{1}$/gm).test(min)) {
      min = `0${min}`;
    }

    const daystr = dayjs(
        `${year}-${month}-${day} ${hour}:${min} ${meridiem} +00:00`,
        'YYYY-MM-DD hh:mm a Z'
      ).utc(),
      epoch = daystr.unix(),
      tagOutput = {
        color: '0xf1efef',
        title: 'Time Tag Generated!',
        description: 'Following are the inputs given!',
        fields: [
          {
            name: 'Time Epoch',
            value: `\`${epoch}\``
          },
          {
            name: 'Time Tag',
            value: `<t:${epoch}>`
          },
          {
            name: 'Date',
            value: `${year}-${month}-${day}`
          },
          {
            name: 'Time',
            value: `${hour}:${min} ${meridiem} (In UTC)`
          }
        ]
      },
      errRow = new MessageActionRow()
        .addComponents(new MessageButton()
          .setLabel('Join Support Server')
          .setStyle('LINK')
          .setURL('https://discord.gg/MPtE9zsBs5'))
        .addComponents(new MessageButton()
          .setLabel('Submit an Issue at GitHub')
          .setStyle('LINK')
          .setURL('https://github.com/MRDGH2821/Discord-Time-Tag-Bot/issues'))
        .addComponents(new MessageButton()
          .setLabel('Backup Time Tag Generator')
          .setStyle('LINK')
          .setURL('https://hammertime.djdavid98.art/')),

      bkpRow = new MessageActionRow()
        .addComponents(new MessageButton()
          .setLabel('Backup Time Tag Generator')
          .setStyle('LINK')
          .setURL('https://hammertime.djdavid98.art/'))
        .addComponents(new MessageButton()
          .setLabel('Invite Bot in your server!')
          .setStyle('LINK')
          .setURL('https://discord.com/api/oauth2/authorize?client_id=890243200579694672&permissions=274878188544&scope=bot%20applications.commands'));
    try {
      if (DateTimeCheck(year, month, day, min)) {
        await interaction.reply({ embeds: [tagOutput],
          components: [bkpRow] });
        await interaction.followUp(`\`<t:${epoch}>\``);
      }
      else {
        const errEmb = {
          color: '0xf1efef',
          title: 'Invalid Input!',
          description: 'Please check the inputs you have provided!',
          fields: [
            {
              name: 'Inputs *before* processing',
              value: `Date: \`${year}-${month}-${day}\` \nTime: \`${hour}:${min} ${meridiem}\``
            },
            {
              name: 'Inputs *after* processing',
              value: `Date (library): \`${daystr.format('YYYY-MM-DD')}\` \nTime (library): \`${daystr.format('hh:mm a')}\``
            },
            {
              name: 'Library & UTC mode',
              value: `Dayjs Library. UTC Mode: \`${daystr.$u}\``
            },
            {
              name: 'Possible Reasons for invalid input',
              value: 'Date doesn\'t exist or Minutes exceed 60'
            }
          ]
        };
        await interaction.reply({ embeds: [errEmb],
          components: [errRow] });
      }
    }
    catch (error) {
      console.error(error);
      return interaction.reply({
        contents: `Uhhh, sorry an error occured. Please use \`/help\` command & reach out bot developer with error screenshot.\nError dump: \n\`${error}\``,
        components: [errRow]
      });
    }
  }
};
