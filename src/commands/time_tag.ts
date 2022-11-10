/* eslint-disable no-magic-numbers */
import dayjs from 'dayjs';

import customParseFormat from 'dayjs/plugin/customParseFormat';
import timezone from 'dayjs/plugin/timezone';
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
import { hourMinuteToClock, offSetMinutesToClock } from '../lib/Utilities';

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

interface TimeTagArgs extends ParsedArgs {
  hours?: number;
  minutes?: number;
  meridian?: 'am' | 'pm' | 'h24';
  year?: number;
  month?: number;
  date?: number;
  utc?: number;
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
      required: true,
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

    // const decodedTZ = decodeInvalid(args.utc!);
    // const tz = searchTZ(decodedTZ).length > 0 || searchTZ(args.utc!).length > 0 ? decodedTZ : '0'
    const timeZone = args.utc!;
    // dayjs.tz.setDefault(timeZone.toString());
    const dayObj = dayjs({
      hour: newHours,
      minute: args.minutes,
      year: args.year,
      month: args.month,
      date: args.date,
    }).utcOffset(timeZone, true);

    const time = `${hourMinuteToClock(args.hours!, args.minutes!)} ${
      args.meridian === 'h24' ? '(24-hr)' : args.meridian
    }`;
    // console.log({ dayObj, args });
    if (args.tag_type !== 'let_me_see') {
      await ctx.editOrRespond({
        content: `\`${timestamp(dayObj.toDate(), args.tag_type!)}\``,
      });
      return;
    }
    const format14Row = new ComponentActionRow()
      .addButton({
        label: 'Format 1',
        style: MessageComponentButtonStyles.SECONDARY,
        custom_id: `format1-F-${dayObj.unix()}`,
        customId: `format1-F-${dayObj.unix()}`,
      })
      .addButton({
        label: 'Format 2',
        style: MessageComponentButtonStyles.SECONDARY,
        custom_id: `format2-f-${dayObj.unix()}`,
        customId: `format2-f-${dayObj.unix()}`,
      })
      .addButton({
        label: 'Format 3',
        style: MessageComponentButtonStyles.SECONDARY,
        custom_id: `format3-D-${dayObj.unix()}`,
        customId: `format3-D-${dayObj.unix()}`,
      })
      .addButton({
        label: 'Format 4',
        style: MessageComponentButtonStyles.SECONDARY,
        custom_id: `format4-d-${dayObj.unix()}`,
        customId: `format4-d-${dayObj.unix()}`,
      });

    const format57Row = new ComponentActionRow()
      .addButton({
        label: 'Format 5',
        style: MessageComponentButtonStyles.SECONDARY,
        custom_id: `format5-T-${dayObj.unix()}`,
        customId: `format5-T-${dayObj.unix()}`,
      })
      .addButton({
        label: 'Format 6',
        style: MessageComponentButtonStyles.SECONDARY,
        custom_id: `format6-t-${dayObj.unix()}`,
        customId: `format6-t-${dayObj.unix()}`,
      })
      .addButton({
        label: 'Format 7',
        style: MessageComponentButtonStyles.SECONDARY,
        custom_id: `format7-R-${dayObj.unix()}`,
        customId: `format7-R-${dayObj.unix()}`,
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
          value: `Time Epoch: \`${dayObj.unix()}\` \nDate: ${args.year}/${args.month}/${
            args.date
          } \nTime: ${time} \nUTC: ${offSetMinutesToClock(args.utc!)} (${offSetMinutesToClock(
            dayObj.utcOffset(),
          )})`,
        },
        {
          name: 'Format 1',
          value: `\`${timestamp(dayObj.toDate(), MarkupTimestampStyles.BOTH_LONG)}\` ${timestamp(
            dayObj.toDate(),
            MarkupTimestampStyles.BOTH_LONG,
          )}`,
        },
        {
          name: 'Format 2',
          value: `\`${timestamp(dayObj.toDate(), MarkupTimestampStyles.BOTH_SHORT)}\` ${timestamp(
            dayObj.toDate(),
            MarkupTimestampStyles.BOTH_SHORT,
          )}`,
        },
        {
          name: 'Format 3',
          value: `\`${timestamp(dayObj.toDate(), MarkupTimestampStyles.DATE_LONG)}\` ${timestamp(
            dayObj.toDate(),
            MarkupTimestampStyles.DATE_LONG,
          )}`,
        },
        {
          name: 'Format 4',
          value: `\`${timestamp(dayObj.toDate(), MarkupTimestampStyles.DATE_SHORT)}\` ${timestamp(
            dayObj.toDate(),
            MarkupTimestampStyles.DATE_SHORT,
          )}`,
        },
        {
          name: 'Format 5',
          value: `\`${timestamp(dayObj.toDate(), MarkupTimestampStyles.TIME_LONG)}\` ${timestamp(
            dayObj.toDate(),
            MarkupTimestampStyles.TIME_LONG,
          )}`,
        },
        {
          name: 'Format 6',
          value: `\`${timestamp(dayObj.toDate(), MarkupTimestampStyles.TIME_SHORT)}\` ${timestamp(
            dayObj.toDate(),
            MarkupTimestampStyles.TIME_SHORT,
          )}`,
        },
        {
          name: 'Format 7',
          value: `\`${timestamp(dayObj.toDate(), MarkupTimestampStyles.RELATIVE)}\` ${timestamp(
            dayObj.toDate(),
            MarkupTimestampStyles.RELATIVE,
          )}`,
        },
      ],
    };

    await ctx.editOrRespond({
      embed: tagOutput,
      components: [format14Row, format57Row],
    });
  },
  onError(ctx, err) {
    console.error(err);
  },
});
