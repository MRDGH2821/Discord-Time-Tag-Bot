require('custom-env').env('prod');

const clientId = process.env.DISCORD_CLIENT_ID;
const guildId = process.env.DISCORD_GUILD_ID;
const token = process.env.DISCORD_TOKEN;

module.exports = {
  clientId,
  guildId,
  token,
};
