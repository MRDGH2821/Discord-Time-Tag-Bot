module.exports = {
  name: 'interactionCreate',
  // eslint-disable-next-line sort-keys
  execute(interaction) {
    console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);
  }
};
