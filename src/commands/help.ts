import { MessageComponentButtonStyles } from 'detritus-client/lib/constants';
import { InteractionCommand } from 'detritus-client/lib/interaction';
import { ComponentActionRow } from 'detritus-client/lib/utils';
import { SimpleEmbed } from '../botTypes/interfaces';
import { COLORS, HAMMER_TIME_LINK, SUPPORT_INVITE } from '../lib/Constants';

import { bugs, homepage, version } from '../../package.json';

const helpEmbed: SimpleEmbed = {
  color: COLORS.EMBED_COLOR,
  title: 'Help Section',
  url: SUPPORT_INVITE,
  description:
    'The help section you get you started!\nThe bot takes in various inputs & generates epoch & time tag for you. The commands are self explanatory and here is a brief overview of the parameters.',

  fields: [
    {
      name: 'Year',
      value: 'Year input should be in `YYYY` format. For example `2021`.',
    },
    {
      name: 'Month',
      value: 'Month input should be in `MM` or `m` format. For example `9` or `09`.',
    },
    {
      name: 'Day',
      value: 'Day input should be in `DD` or `d` format. For example `1` or `28`.',
    },
    { name: 'Hours', value: 'Should be in 12-Hour format.' },
    { name: 'Minutes', value: 'Should be in (0-59)' },
    {
      name: 'Meridian',
      value: 'Ante meridian or Post Meridian (`AM` or `PM`)',
    },
    {
      name: 'UTC',
      value:
        'Takes value in UTC Offset. \nCorrect Examples: \n`+05:00` \n`-06:30` \n`+00:00`.\n\nExamples which will be processed: \n`530` = `+05:30` \n`-4` = `-04:00` \n`0` = `+00:00`\n\nOther than that, time tag will not be generated.',
    },
    {
      name: 'Additional Notes',
      value:
        'Sometimes it may happen that the inputs do not match with the processed output or library output. One common cause can be that, the input value for particular parameter exceeds the range. So in that case, it will jump to next cycle. For example putting Day as `32` will result in increment of month by 1 & excess day will be subtracted. In other cases, please take a screenshot & send it to support server.',
    },
    {
      name: 'Bot still not working?',
      value: `Please join my [server](${SUPPORT_INVITE}) & elaborate how you encountered that problem. Incase you are running out of time you may click [here](${HAMMER_TIME_LINK}). You may also submit an issue at [Github Repository](${bugs.url}) \n\n*Btw this site is not affiliated with bot developer in any way, it was linked here to reduce your wasted time.*`,
    },
    {
      name: 'Regex Credits',
      value: 'https://regex101.com/library/cE5uE3',
    },
    {
      name: 'Bot version',
      value: `${version}`,
    },
  ],
};
const row = new ComponentActionRow()
  .addButton({
    label: 'Join Support Server',
    style: MessageComponentButtonStyles.LINK,
    url: SUPPORT_INVITE,
  })
  .addButton({
    label: 'Hammer Time Website (Unaffiliated)',
    style: MessageComponentButtonStyles.LINK,
    url: HAMMER_TIME_LINK,
  })
  .addButton({
    label: 'Source Code',
    style: MessageComponentButtonStyles.LINK,
    url: homepage,
  })
  .addButton({
    label: 'Invite Bot in your server!',
    style: MessageComponentButtonStyles.LINK,
    url: 'https://discord.com/api/oauth2/authorize?client_id=890243200579694672&permissions=274878188544&scope=bot%20applications.commands',
  });

export default new InteractionCommand({
  name: 'help',
  description: 'The help section to get you started!',
  global: true,
  disableDm: false,
  metadata: {
    help: "This is help command, where you can view individual command's usage",
  },
  run(ctx) {
    ctx.editOrRespond({
      embed: helpEmbed,
      components: [row],
    });
  },
});
