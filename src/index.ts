import { ClusterClient, InteractionCommandClient } from 'detritus-client';
import interactionCreate from './events/interactionCreate';
import ready from './events/ready';
import EnvConfig from './lib/EnvConfig';

(async () => {
  const clusterBot = new ClusterClient(EnvConfig.token, {
    cache: {
      channels: { enabled: true, limit: 10 },
    },
  });
  clusterBot.on(ready.event, ready.listener);
  clusterBot.on(interactionCreate.event, interactionCreate.listener);

  await clusterBot.run();

  const interactionBot = new InteractionCommandClient(clusterBot);
  /*
  await interactionBot.rest.bulkOverwriteApplicationCommands(EnvConfig.clientId, []);
  await interactionBot.rest.bulkOverwriteApplicationGuildCommands(
    EnvConfig.clientId,
    EnvConfig.guildId,
    [],
  );
  */
  await interactionBot.addMultipleIn('./commands/');
  await interactionBot.run();
})().catch(console.error);
