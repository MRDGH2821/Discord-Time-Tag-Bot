/* eslint-disable max-len */
import { InteractionCommand } from 'detritus-client/lib/interaction';
import { version } from '../../package.json';
import { SimpleEmbed } from '../botTypes/interfaces';
import { COLORS } from '../lib/Constants';
import { viewPages } from '../lib/Utilities';

/*
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
*/
export default new InteractionCommand({
  name: 'help',
  description: 'The help section to get you started!',
  global: true,
  disableDm: false,
  metadata: {
    help: "This is help command, where you can view individual command's usage",
  },

  async run(ctx) {
    const commands = [
      {
        name: 'count_down',
        description: 'Generates a countdown tag!',
        metadata: {
          help: 'Enter hours & minutes from now for a countdown. For more control over time, use /time_tag command',
        },
      },
      {
        name: 'help',
        description: 'The help section to get you started!',
        metadata: {
          help: "This is help command, where you can view individual command's usage",
        },
      },
      {
        name: 'ping',
        description: 'Shows bot ping',
        metadata: {
          help: 'Shows bot ping',
        },
      },
      {
        name: 'time_tag',
        description: 'Generates Time tag! (Default in UTC)',
        metadata: {
          help: `Enter Hours, Minutes, Year (optional), Month (optional), Date (optional), Timezone (optional) & Tag type (optional) to get a time tag.\n\nYear, Month, Date if not provided, take values as per today's date by default. \nCurrent default as per UTC+0 - ${new Date().toUTCString()}. \nDefault Timezone is UTC +00:00. \nTag type is optional, but if provided, will directly give you the tag. \n\n\nNote: the \`utc\` parameter takes in timezone offset (in minutes). So you can directly put offset in minutes. For example your timezone is UTC +05:30, then the offset in minutes will be \`5*60 + 30 = 330\`.\nIf it is UTC -09:45, then offset is \`(-9)*60 + 45 = (-495)\`\nYou can directly enter offset (without brackets) in \`utc\` parameter by this way.`,
        },
      },
    ];
    const pages: SimpleEmbed[] = [];
    commands?.forEach((command) => {
      pages.push({
        title: `**${command.name}**`,
        color: COLORS.EMBED_COLOR,
        description: command.description,
        fields: [
          {
            name: 'Help section',
            value: command.metadata.help,
          },
        ],
        footer: {
          text: `Bot version: ${version}`,
        },
      });
    });
    const pager = viewPages(pages);
    await pager(ctx);
  },
});
