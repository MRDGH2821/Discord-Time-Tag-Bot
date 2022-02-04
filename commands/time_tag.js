/* eslint-disable no-magic-numbers */
const dayjs = require('dayjs');
const { bkpRow, errRow } = require('../lib/RowButtons.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { dateTimeCheck } = require('../lib/CheckerFunctions.js');
const utc = require('dayjs/plugin/utc');
const customParseFormat = require('dayjs/plugin/customParseFormat');
const { MessageEmbed } = require('discord.js');
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
      .setDescription('Enter Minutes')
      .setRequired(true)
      .setMinValue(0)
      .setMaxValue(59))
    .addStringOption((option) => option
      .setName('meridiem')
      .setDescription('Ante or Post meridiem (AM or PM)')
      .setRequired(true)
      .addChoice('am', 'am')
      .addChoice('pm', 'pm')),

  async execute(interaction) {
    const meridiem = interaction.options.getString('meridiem'),
      year = interaction.options.getInteger('year');
    let day = interaction.options.getInteger('day'),
      hour = interaction.options.getInteger('hours'),
      min = interaction.options.getInteger('minutes'),
      month = interaction.options.getInteger('month');

    // regex validations for double digit parameters
    if ((/^\d{1}$/gmu).test(month)) {
      month = `0${month}`;
    }
    if ((/^\d{1}$/gmu).test(day)) {
      day = `0${day}`;
    }
    if ((/^\d{1}$/gmu).test(hour)) {
      hour = `0${hour}`;
    }
    if ((/^\d{1}$/gmu).test(min)) {
      min = `0${min}`;
    }

    // eslint-disable-next-line one-var
    const daystr = dayjs(
        `${year}-${month}-${day} ${hour}:${min} ${meridiem} +00:00`,
        'YYYY-MM-DD hh:mm a Z'
      ).utc(),
      epoch = daystr.unix(),
      tagOutput = new MessageEmbed()
        .setColor('f1efef')
        .setTitle('Time Tag Generated!')
        .setDescription('Following are the inputs given!')
        .addFields([
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
        ]);

    try {
      if (dateTimeCheck(year, month, day)) {
        await interaction.reply({
          components: [bkpRow],
          embeds: [tagOutput]
        });
        await interaction.followUp(`\`<t:${epoch}>\``);
      }
      else {
        const errEmb = new MessageEmbed()
          .setColor('f1efef')
          .setTitle('Invalid Input!')
          .setDescription('Please check the inputs you have provided!')
          .addFields([
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
              value: 'Date doesn\'t exist.'
            }
          ]);

        await interaction.reply({
          components: [errRow],
          embeds: [errEmb]
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
