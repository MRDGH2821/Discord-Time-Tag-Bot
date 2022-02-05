require('custom-env').env();

const clientId = process.env.DISCORD_CLIENT_ID,
  guildId = process.env.DISCORD_GUILD_ID,
  token = process.env.DISCORD_TOKEN;

module.exports = {
  clientId,
  guildId,
  token
};
