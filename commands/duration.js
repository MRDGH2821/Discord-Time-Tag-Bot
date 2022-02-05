const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');
dayjs.extend(duration);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('duration')
    .setDescription('Generates Duration Time tag!')
    .addIntegerOption((option) => option
      .setName('minutes')
      .setDescription('Enter Minutes')
      .setRequired(true))
    .addIntegerOption((option) => option.setName('hours').setDescription('Enter hours')),

  async execute(interaction) {
    const newDuration = dayjs().add(dayjs.duration({
      hours: await interaction.options.getInteger('hours'),
      minutes: await interaction.options.getInteger('minutes')
    }));

    // eslint-disable-next-line one-var
    const newDurationEpoch = newDuration.unix(),
      // eslint-disable-next-line sort-vars
      durationEmbed = new MessageEmbed()
        .setColor('f1efef')
        .setTitle('Duration Tag Generated!')
        .setDescription(`Timestamp: <t:${newDurationEpoch}> \`<t:${newDurationEpoch}>\`\n\nDuration stamp: <t:${newDurationEpoch}:R> \`<t:${newDurationEpoch}:R>\``);

    await interaction.reply({
      embeds: [durationEmbed]
    });
    await interaction.followUp(`\`<t:${newDurationEpoch}:R>\``);
  }
};
