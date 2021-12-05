let token;
let clientId;
let guildId;
const prodConfig = require('../config.json');
try {
	const betaConfig = require('../betaconfig.json');

	const betaMode = false;

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
	guildId,
};
