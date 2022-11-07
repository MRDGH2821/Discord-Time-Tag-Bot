import { getTimeZones } from '@vvo/tzdb';
import {
  ApplicationCommandOptionTypes,
  MessageComponentButtonStyles,
} from 'detritus-client/lib/constants';
import { InteractionCommandOptionOptions } from 'detritus-client/lib/interaction';
import { ComponentActionRow } from 'detritus-client/lib/utils';

export const timeZones = getTimeZones({ includeUtc: true });
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
  type: ApplicationCommandOptionTypes.STRING,
  default: 'Etc/UTC',
  async onAutoComplete(ctx) {
    const input = ctx.value.toLowerCase();
    return timeZones
      .filter((timeZone) => {
        if (
          Object.values(timeZone)
            .flat()
            .some((val) => val.includes(input))
        ) {
          return {
            name: `${timeZone.rawFormat} ${timeZone.abbreviation}`,
            value: timeZone.name,
          };
        }

        return {
          name: '+00:00 Coordinated Universal Time (UTC)',
          value: 'Etc/UTC',
        };
      })
      .slice(0, 25);
  },
};
