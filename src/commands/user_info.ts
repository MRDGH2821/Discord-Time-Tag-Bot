const { SlashCommandBuilder, time } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('user_info')
    .setDescription('Display info about yourself.'),
  async execute(interaction) {
    const date = new Date();
    const relative = time(date, 'R');
    const timeString = time(date);
    await interaction.reply(
      `Your username: ${interaction.user.tag}\nYour ID: ${interaction.user.id}\nThe time on which this command was executed: ${timeString}\ni.e. ${relative}`,
    );
  },
};
