# Discord Time Tag Bot

Generating Discord Time Tags made easy!

~~Currently the Bot is in development.~~ Bot development is supposedly finished. And can be used publicly!

Hosted on ~~my personal Raspberry Pi 2B+.~~ Google Cloud VM Instance.

You may invite the bot via this [link](https://discord.com/api/oauth2/authorize?client_id=890243200579694672&permissions=274878188544&scope=bot%20applications.commands)

Join my server - <https://discord.gg/MPtE9zsBs5>

Bot Permissions -

![Bot permissions for Time Tag Bot](https://i.imgur.com/V3UVDuT.png)

## Hosting

1.  Clone this repo.
2.  Create a copy of the file `.env.sample` and rename it to `.env`.
3.  Put relevant data in the `.env.prod` file -

```env
DISCORD_CLIENT_ID = insert client ID
DISCORD_TOKEN = insert bot token
DISCORD_GUILD_ID = insert test server ID
```

3.  Install dependencies by using `npm install`.
4.  Use `npm start` to run the bot code.

For more info click [here](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot) & [here](https://discordjs.guide/creating-your-bot/)

You may also use pm2. Check the guide [here](https://discordjs.guide/improving-dev-environment/pm2.html)

```bash
pm2 start time-tag.config.js
```

## How to update self-hosted version?/How to reset the Bot code?

Use the following command:

```bash
git pull
```

## License

[MIT](./LICENSE)

Feel free to make your own improved version of the bot!

## Icon

Icon was made using Canva.
See here in [High resolution](https://www.canva.com/design/DAErTZ1ecBg/BPsoFLzK_b1pytITetgrww/view?utm_content=DAErTZ1ecBg&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink)
