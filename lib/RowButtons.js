const { MessageActionRow, MessageButton } = require('discord.js'),
  bkpRow = new MessageActionRow().addComponents(new MessageButton()
    .setLabel('Backup Time Tag Generator')
    .setStyle('LINK')
    .setURL('https://hammertime.djdavid98.art/')),
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
      .setURL('https://hammertime.djdavid98.art/'));

module.exports = {
  bkpRow,
  errRow
};
