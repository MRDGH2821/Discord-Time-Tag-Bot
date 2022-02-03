const { SlashCommandBuilder, time } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('user_info')
    .setDescription('Display info about yourself.'),
  async execute(interaction) {
    const date = new Date(),
      timeString = time(date),
      relative = time(date, 'R');
    return interaction.reply(`Your username: ${interaction.user.tag}\nYour ID: ${interaction.user.id}\nThe time on which this command was executed: ${timeString}\ni.e. ${relative}`);
  }
};
