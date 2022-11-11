import { getTimeZones } from '@vvo/tzdb';
import { MessageComponentButtonStyles } from 'detritus-client/lib/constants';
import { InteractionContext } from 'detritus-client/lib/interaction';
import { ComponentActionRow, ComponentContext } from 'detritus-client/lib/utils';
import { SimpleEmbed } from '../botTypes/interfaces';

export function offSetMinutesToClock(minute: number) {
  let mins = minute;
  const sign = mins < 0 ? '-' : '+';
  if (sign === '-') {
    mins *= -1;
  }
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const hours = h < 10 ? `0${h}` : h; // (or alternatively) h = String(h).padStart(2, '0')
  const minutes = m < 10 ? `0${m}` : m; // (or alternatively) m = String(m).padStart(2, '0')
  return `${sign}${hours}:${minutes}`;
}

export function hourMinuteToClock(h: number, m: number) {
  const hours = h < 10 ? `0${h}` : h; // (or alternatively) h = String(h).padStart(2, '0')
  const minutes = m < 10 ? `0${m}` : m; // (or alternatively) m = String(m).padStart(2, '0')
  return `${hours}:${minutes}`;
}

const timeZones = getTimeZones({ includeUtc: true });

export function searchTZ(input: string) {
  console.log({ searching: input });
  const results = timeZones.filter((timeZone) => {
    const str = JSON.stringify(timeZone).toString().toLowerCase();
    const matches = str.match(input);
    return !!matches;
  });
  console.log({ resultsFound: results.length });
  return results;
}

export function viewPages(embeds: SimpleEmbed[]): Function {
  return async function next(ctx: ComponentContext | InteractionContext, i = 0): Promise<unknown> {
    if (embeds.length < 1) {
      return ctx.editOrRespond({
        content: 'No help pages found',
        // flags: MessageFlags.EPHEMERAL,
      });
    }

    return ctx.editOrRespond({
      content: embeds[i] ? undefined : '*How about going one step back?*',
      embed: embeds[i],
      // flags: MessageFlags.EPHEMERAL,
      components: [
        new ComponentActionRow()
          .addButton({
            label: 'Previous',
            emoji: '⬅️',
            style: MessageComponentButtonStyles.SECONDARY,
            run(btnCtx) {
              next(btnCtx, i >= 0 ? i - 1 : i);
            },
          })
          .addButton({
            label: 'Next',
            emoji: '➡️',
            style: MessageComponentButtonStyles.PRIMARY,
            run(btnCtx) {
              next(btnCtx, i < embeds.length ? i + 1 : i);
            },
          }),
      ],
    });
  };
}
