let clientId,
  guildId,
  token;
const prodConfig = require('../config.json');
try {
  const betaConfig = require('../betaconfig.json'),

    betaMode = false;

  if (betaMode) {
    token = betaConfig.token;
    clientId = betaConfig.clientId;
    guildId = betaConfig.guildId;
  }
}
catch {
  token = prodConfig.token;
  clientId = prodConfig.clientId;
  guildId = prodConfig.guildId;
}

module.exports = {
  token,
  clientId,
  guildId
};
