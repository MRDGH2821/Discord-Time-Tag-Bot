import dayjs from 'dayjs';
import CustomParseFormat from 'dayjs/plugin/customParseFormat';
import duration from 'dayjs/plugin/duration';
import ObjectSupport from 'dayjs/plugin/objectSupport';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import {
  ApplicationCommandOptionTypes,
  MarkupTimestampStyles,
} from 'detritus-client/lib/constants';
import { InteractionCommand, ParsedArgs } from 'detritus-client/lib/interaction';
import { timestamp } from 'detritus-client/lib/utils/markup';

dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(CustomParseFormat);
dayjs.extend(timezone);
dayjs.extend(ObjectSupport);

interface CountDownArgs extends ParsedArgs {
  hours?: number;
  minutes?: number;
}
export default new InteractionCommand({
  name: 'count_down',
  description: 'Generates a countdown tag!',
  global: true,
  disableDm: false,
  metadata: {
    help: 'Enter hours & minutes from now for a countdown. For more control over time, use /time_tag command',
  },
  options: [
    {
      name: 'hours',
      description: 'Enter Number of hours from now',
      type: ApplicationCommandOptionTypes.NUMBER,
      required: true,
    },
    {
      name: 'minutes',
      description: 'Enter number of minutes from now',
      type: ApplicationCommandOptionTypes.NUMBER,
      max_value: 59,
      maxValue: 59,
      //  required: true,
    },
  ],

  async run(ctx, args: CountDownArgs) {
    const date = dayjs().add(args);
    /*
    date.add(args.hours!, 'hours');
    date.add(args.minutes!, 'minutes');
  */

    ctx.editOrRespond({
      content: `${timestamp(date.toDate(), MarkupTimestampStyles.RELATIVE)} (${timestamp(
        date.toDate(),
        MarkupTimestampStyles.BOTH_LONG,
      )})`,
    });
  },
});
