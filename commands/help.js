const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { version } = require('../package.json'),
  helpEmbed = new MessageEmbed()
    .setColor('#F1EFEF')
    .setTitle('Help Section')
    .setURL('https://discord.gg/MPtE9zsBs5')
    .setDescription('The help section you get you started!\nThe bot takes in various inputs & generates epoch & time tag for you. The commands are self explanatory and here is a brief overview of the parameters.')
    .addFields(
      {
        name: 'Year',
        value: 'Year input should be in `YYYY` format. For example `2021`.'
      },
      {
        name: 'Month',
        value:
          'Month input should be in `MM` or `m` format. For example `9` or `09`.'
      },
      {
        name: 'Day',
        value:
          'Day input should be in `DD` or `d` format. For example `1` or `28`.'
      },
      { name: 'Hours',
        value: 'Should be in 12-Hour format.' },
      { name: 'Minutes',
        value: 'Should be in (0-59)' },
      {
        name: 'Meridien',
        value: 'Ante meridien or Post Meridien (`AM` or `PM`)'
      },
      {
        name: 'UTC',
        value:
          'Takes value in UTC Offset. \nCorrect Examples: \n`+05:00` \n`-06:30` \n`+00:00`.\n\nExamples which will be processed: \n`530` = `+05:30` \n`-4` = `-04:00` \n`0` = `+00:00`\n\nOther than that, time tag will not be generated.'
      },
      {
        name: 'Additional Notes',
        value:
          'Sometimes it may happen that the inputs do not match with the processed output or library output. One common cause can be that, the input value for particular parameter exceeds the range. So in that case, it will jump to next cycle. For example putting Day as `32` will result in increment of month by 1 & excess day will be substracted. In other cases, please take a screenshot & send it to support server.'
      },
      {
        name: 'Bot still not working?',
        value:
          'Please join my [server](https://discord.gg/MPtE9zsBs5) & elaborate how you encountered that problem. Incase you are running out of time you may click [here](https://hammertime.djdavid98.art/). You may also submit an issue at [Github Repository](https://github.com/MRDGH2821/Discord-Time-Tag-Bot/issues) \n\n*Btw this site is not affliated with bot developer in any way, it was linked here to reduce your wasted time.*'
      },
      {
        name: 'Regex Credits',
        value: 'https://regex101.com/library/cE5uE3'
      }
    )
    .setFooter(`Bot Version: ${version}`),
  row = new MessageActionRow()
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
      .setURL('https://hammertime.djdavid98.art/'))
    .addComponents(new MessageButton()
      .setLabel('GitHub Repository')
      .setStyle('LINK')
      .setURL('https://github.com/MRDGH2821/Discord-Time-Tag-Bot'))
    .addComponents(new MessageButton()
      .setLabel('Invite Bot in your server!')
      .setStyle('LINK')
      .setURL('https://discord.com/api/oauth2/authorize?client_id=890243200579694672&permissions=274878188544&scope=bot%20applications.commands'));

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('The help section to get you started!'),

  async execute(interaction) {
    await interaction.reply({
      components: [row],
      embeds: [helpEmbed]
    });
  }
};
