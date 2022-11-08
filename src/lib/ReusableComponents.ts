import {
  ApplicationCommandOptionTypes,
  MessageComponentButtonStyles,
} from 'detritus-client/lib/constants';
import { InteractionCommandOptionOptions } from 'detritus-client/lib/interaction';
import { ComponentActionRow } from 'detritus-client/lib/utils';
import { encodeInvalid, offSetMinutesToClock, searchTZ } from './Utilities';

export const bkpRow = new ComponentActionRow().addButton({
  label: 'Backup Time Tag Generator',
  style: MessageComponentButtonStyles.LINK,
  url: 'https://hammertime.djdavid98.art/',
});

export const errRow = new ComponentActionRow()
  .addButton({
    label: 'Join Support Server',
    style: MessageComponentButtonStyles.LINK,
    url: 'https://discord.gg/HeFAqYgGr8',
  })
  .addButton({
    label: 'Backup Time Tag Generator',
    style: MessageComponentButtonStyles.LINK,
    url: 'https://hammertime.djdavid98.art/',
  });

export const utcOption: InteractionCommandOptionOptions = {
  name: 'utc',
  description: 'Enter timezone in UTC (default Etc/UTC i.e. +00:00)',
  type: ApplicationCommandOptionTypes.NUMBER,
  default: 0,
  async onAutoComplete(ctx) {
    const input = ctx.value.toLowerCase();
    console.log({ input, actual: ctx.value });
    const foundTZ = searchTZ(input);

    const parsedTZ = foundTZ
      .map((timeZone) => ({
        name: encodeInvalid(
          `${encodeInvalid(timeZone.name)} ${timeZone.abbreviation} ${offSetMinutesToClock(
            timeZone.rawOffsetInMinutes,
          )}`,
        ),
        value: timeZone.rawOffsetInMinutes,
      }))
      .slice(0, 23);

    parsedTZ.push({
      name: '+00:00 Coordinated Universal Time (UTC)',
      value: 0,
    });
    console.log({ found: foundTZ.length, parsedTZ });
    ctx.respond({
      choices: parsedTZ,
    });
  },
};
