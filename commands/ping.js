const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with bot latency!'),
  async execute(interaction) {
    const sent = await interaction.reply({
      content: 'Pinging...',
      fetchReply: true
    });
    return interaction.editReply(`Roundtrip latency: ${
      sent.createdTimestamp - interaction.createdTimestamp
    }ms`);
  }
};
