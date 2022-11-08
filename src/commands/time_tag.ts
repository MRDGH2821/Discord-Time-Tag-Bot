/* eslint-disable no-magic-numbers */
import dayjs from 'dayjs';

import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import {
  ApplicationCommandOptionTypes,
  MarkupTimestampStyles,
  MessageComponentButtonStyles,
} from 'detritus-client/lib/constants';
import { InteractionCommand, ParsedArgs } from 'detritus-client/lib/interaction';
import { ComponentActionRow } from 'detritus-client/lib/utils';
import { timestamp } from 'detritus-client/lib/utils/markup';
import { SimpleEmbed } from '../botTypes/interfaces';
import { COLORS, HAMMER_TIME_LINK } from '../lib/Constants';
import { utcOption } from '../lib/ReusableComponents';

dayjs.extend(customParseFormat);
dayjs.extend(utc);

interface TimeTagArgs extends ParsedArgs {
  hours?: number;
  minutes?: number;
  meridian?: 'am' | 'pm' | 'h24';
  year?: number;
  month?: number;
  date?: number;
  utc?: string;
  tag_type?: MarkupTimestampStyles | 'let_me_see';
}

export default new InteractionCommand({
  name: 'time_tag',
  description: 'Generates Time tag! (Default in UTC)',
  global: true,
  disableDm: false,
  options: [
    {
      name: 'hours',
      description: 'Enter hours in 12 or 24 hour format',
      type: ApplicationCommandOptionTypes.NUMBER,
      max_value: 23,
      maxValue: 23,
      required: true,
    },
    {
      name: 'minutes',
      description: 'Enter minutes in m format',
      type: ApplicationCommandOptionTypes.NUMBER,
      max_value: 59,
      maxValue: 59,
      required: true,
    },
    {
      name: 'meridian',
      description: 'Enter format type',
      type: ApplicationCommandOptionTypes.STRING,
      choices: [
        {
          name: '12 hour - am',
          value: 'am',
        },
        {
          name: '12 hour - pm',
          value: 'pm',
        },
        {
          name: '24 hour',
          value: 'h24',
        },
      ],
    },
    {
      name: 'year',
      description: 'Enter year in YYYY format (default current year as per UTC)',
      type: ApplicationCommandOptionTypes.NUMBER,
      min_value: 1971,
      minValue: 1971,
      default: new Date().getUTCFullYear(),
    },
    {
      name: 'month',
      description: 'Enter month in MM format (default current month as per UTC)',
      type: ApplicationCommandOptionTypes.NUMBER,
      choices: [
        {
          name: 'January (01)',
          value: 0,
        },
        {
          name: 'February (02)',
          value: 1,
        },
        {
          name: 'March (03)',
          value: 2,
        },
        {
          name: 'April (04)',
          value: 3,
        },
        {
          name: 'May (05)',
          value: 4,
        },
        {
          name: 'June (06)',
          value: 5,
        },
        {
          name: 'July (07)',
          value: 6,
        },
        {
          name: 'August (08)',
          value: 7,
        },
        {
          name: 'September (09)',
          value: 8,
        },
        {
          name: 'October (10)',
          value: 9,
        },
        {
          name: 'November (11)',
          value: 10,
        },
        {
          name: 'December (12)',
          value: 11,
        },
      ],
      default: new Date().getUTCMonth(),
    },
    {
      name: 'date',
      description: 'Enter date in DD format (default current date as per UTC)',
      type: ApplicationCommandOptionTypes.NUMBER,
      min_value: 1,
      minValue: 1,
      max_value: 31,
      maxValue: 31,
      default: new Date().getUTCDate(),
    },
    utcOption,
    {
      name: 'tag_type',
      description: 'Enter tag type to directly get corresponding tag',
      type: ApplicationCommandOptionTypes.STRING,
      choices: [
        {
          name: 'Monday, 7 November 2022 20:35 (Long date & time)',
          value: MarkupTimestampStyles.BOTH_LONG,
        },
        {
          name: '7 November 2022 20:35 (Short date & time)',
          value: MarkupTimestampStyles.BOTH_SHORT,
        },
        {
          name: '7 November 2022 (Long date)',
          value: MarkupTimestampStyles.DATE_LONG,
        },
        {
          name: '07/11/2022 (Short date)',
          value: MarkupTimestampStyles.DATE_SHORT,
        },
        {
          name: '20:35:00 (Long time)',
          value: MarkupTimestampStyles.TIME_LONG,
        },
        {
          name: '20:35 (Short time)',
          value: MarkupTimestampStyles.TIME_SHORT,
        },
        {
          name: 'In 2 days (Relative time)',
          value: MarkupTimestampStyles.RELATIVE,
        },
        {
          name: 'Let me see',
          value: 'let_me_see',
        },
      ],
      default: 'let_me_see',
    },
  ],

  async run(ctx, args: TimeTagArgs) {
    const newHours = args.meridian === 'pm' ? args.hours! + 12 : args.hours!;

    const dayObj = dayjs.tz(
      {
        hour: newHours,
        minute: args.minutes,
        year: args.year,
        month: args.month,
        date: args.date,
      },
      args.utc,
    );
    const epoch = dayObj.unix();
    const time = `${args.hours}:${args.minutes}`;

    if (args.tag_type !== 'let_me_see') {
      return ctx.editOrRespond({
        content: `\`${timestamp(epoch, args.tag_type!)}\``,
      });
    }
    const format14Row = new ComponentActionRow()
      .addButton({
        label: 'Format 1',
        style: MessageComponentButtonStyles.SECONDARY,
        async run(btnCtx) {
          await btnCtx.createMessage({
            content: timestamp(epoch, MarkupTimestampStyles.BOTH_LONG),
          });
        },
      })
      .addButton({
        label: 'Format 2',
        style: MessageComponentButtonStyles.SECONDARY,
        async run(btnCtx) {
          await btnCtx.createMessage({
            content: timestamp(epoch, MarkupTimestampStyles.BOTH_SHORT),
          });
        },
      })
      .addButton({
        label: 'Format 3',
        style: MessageComponentButtonStyles.SECONDARY,
        async run(btnCtx) {
          await btnCtx.createMessage({
            content: timestamp(epoch, MarkupTimestampStyles.DATE_LONG),
          });
        },
      })
      .addButton({
        label: 'Format 4',
        style: MessageComponentButtonStyles.SECONDARY,
        async run(btnCtx) {
          await btnCtx.createMessage({
            content: timestamp(epoch, MarkupTimestampStyles.DATE_SHORT),
          });
        },
      });

    const format57Row = new ComponentActionRow()
      .addButton({
        label: 'Format 5',
        style: MessageComponentButtonStyles.SECONDARY,
        async run(btnCtx) {
          await btnCtx.createMessage({
            content: timestamp(epoch, MarkupTimestampStyles.TIME_LONG),
          });
        },
      })
      .addButton({
        label: 'Format 6',
        style: MessageComponentButtonStyles.SECONDARY,
        async run(btnCtx) {
          await btnCtx.createMessage({
            content: timestamp(epoch, MarkupTimestampStyles.TIME_SHORT),
          });
        },
      })
      .addButton({
        label: 'Format 7',
        style: MessageComponentButtonStyles.SECONDARY,
        async run(btnCtx) {
          await btnCtx.createMessage({
            content: timestamp(epoch, MarkupTimestampStyles.RELATIVE),
          });
        },
      })
      .addButton({
        label: 'Hammer Time website',
        style: MessageComponentButtonStyles.LINK,
        url: HAMMER_TIME_LINK,
      });
    const tagOutput: SimpleEmbed = {
      color: COLORS.EMBED_COLOR,
      title: 'Time Tag Generated!',
      description: 'Click on corresponding button to get the time tag in your desired format!',
      fields: [
        {
          name: 'Input given',
          value: `Time Epoch: \`${epoch}\` \nDate: ${args.date} \nTime: ${time} \nUTC: ${
            args.utc
          } (${dayObj.tz()})`,
        },
        {
          name: 'Format 1',
          value: `\`${timestamp(epoch, MarkupTimestampStyles.BOTH_LONG)}\` ${timestamp(
            epoch,
            MarkupTimestampStyles.BOTH_LONG,
          )}`,
        },
        {
          name: 'Format 2',
          value: `\`${timestamp(epoch, MarkupTimestampStyles.BOTH_SHORT)}\` ${timestamp(
            epoch,
            MarkupTimestampStyles.BOTH_SHORT,
          )}`,
        },
        {
          name: 'Format 3',
          value: `\`${timestamp(epoch, MarkupTimestampStyles.DATE_LONG)}\` ${timestamp(
            epoch,
            MarkupTimestampStyles.DATE_LONG,
          )}`,
        },
        {
          name: 'Format 4',
          value: `\`${timestamp(epoch, MarkupTimestampStyles.DATE_SHORT)}\` ${timestamp(
            epoch,
            MarkupTimestampStyles.DATE_SHORT,
          )}`,
        },
        {
          name: 'Format 5',
          value: `\`${timestamp(epoch, MarkupTimestampStyles.TIME_LONG)}\` ${timestamp(
            epoch,
            MarkupTimestampStyles.TIME_LONG,
          )}`,
        },
        {
          name: 'Format 6',
          value: `\`${timestamp(epoch, MarkupTimestampStyles.TIME_SHORT)}\` ${timestamp(
            epoch,
            MarkupTimestampStyles.TIME_SHORT,
          )}`,
        },
        {
          name: 'Format 7',
          value: `\`${timestamp(epoch, MarkupTimestampStyles.RELATIVE)}\` ${timestamp(
            epoch,
            MarkupTimestampStyles.RELATIVE,
          )}`,
        },
      ],
    };

    return ctx.editOrRespond({
      embed: tagOutput,
      components: [format14Row, format57Row],
    });
  },
});
