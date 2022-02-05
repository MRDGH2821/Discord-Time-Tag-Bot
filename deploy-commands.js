const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./lib/ConfigManager.js'),
  commandFiles = fs
    .readdirSync('./commands')
    .filter((file) => file.endsWith('.js')),
  commands = [].map((command) => command.toJSON()),
  rest = new REST({ version: '9' }).setToken(token);
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

(async() => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(clientId, guildId), {
      body: commands
    });

    /*
     *await rest.put(
     *Routes.applicationGuildCommands(clientId, guildId),
     *{ body: commands },
     *);
     */
    console.log('Successfully registered application (/) commands.');
  }
  catch (error) {
    console.error(error);
  }
})();
