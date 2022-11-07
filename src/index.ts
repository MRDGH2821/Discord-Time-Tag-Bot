import { ClusterClient, InteractionCommandClient } from 'detritus-client';
import EnvConfig from './lib/EnvConfig';

(async () => {
  const clusterBot = new ClusterClient(EnvConfig.token, {
    cache: {
      channels: { enabled: true, limit: 10 },
    },
  });

  await clusterBot.run();

  const interactionBot = new InteractionCommandClient(clusterBot);
  interactionBot.addMultipleIn('./commands/');
  await interactionBot.run().then(() => {});
})().catch(console.error);
