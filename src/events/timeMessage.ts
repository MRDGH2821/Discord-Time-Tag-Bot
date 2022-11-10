import { GatewayClientEvents } from 'detritus-client';
import { ClientEvents, MessageComponentInputTextStyles } from 'detritus-client/lib/constants';
import { InteractionDataComponent } from 'detritus-client/lib/structures';
import {
  ComponentActionRow,
  ComponentInputText,
  InteractionModal,
} from 'detritus-client/lib/utils';
import BotEvent from '../lib/BotEvent';

export default new BotEvent({
  event: ClientEvents.INTERACTION_CREATE,
  async listener(payload: GatewayClientEvents.InteractionCreate) {
    const { interaction } = payload;

    if (!interaction.isFromMessageComponent) {
      return;
    }

    const componentData = interaction.data as InteractionDataComponent;

    if (!componentData.customId.includes('sendMessage')) {
      return;
    }
    const [, type, epoch] = componentData.customId.split('-');

    const timeTag = `<t:${epoch}:${type}>`;

    /*
    const channelList = await interaction.guild?.channels
      .filter((channel) => [
        ChannelTypes.GUILD_NEWS,
        ChannelTypes.GUILD_PUBLIC_THREAD,
        ChannelTypes.GUILD_PRIVATE_THREAD,
        ChannelTypes.GUILD_NEWS_THREAD,
      ].includes(channel.type))
      .map((channel) => ({
        label: channel.name,
        value: channel.id,
      }));
    await interaction
      .editOrRespond({
        // content: timeTag,
        components: [
          {
            type: MessageComponentTypes.ACTION_ROW,
            components: [
              {
                type: 3, // channel select menu
                label: 'Select Channel',
                customId: 'channel-select-menu',
                // @ts-ignore
                channel_types: [
                  ChannelTypes.GUILD_TEXT,
                  ChannelTypes.GUILD_NEWS,
                  ChannelTypes.GUILD_PUBLIC_THREAD,
                  ChannelTypes.GUILD_PRIVATE_THREAD,
                  ChannelTypes.GUILD_NEWS_THREAD,
                ],
                channelTypes: [
                  ChannelTypes.GUILD_TEXT,
                  ChannelTypes.GUILD_NEWS,
                  ChannelTypes.GUILD_PUBLIC_THREAD,
                  ChannelTypes.GUILD_PRIVATE_THREAD,
                  ChannelTypes.GUILD_NEWS_THREAD,
                ],
                async run(selectCtx: ComponentContext) {
                  console.log(selectCtx);
                },
                options: [
                  {
                    label: 'sample',
                    value: 'sample',
                  },
                  {
                    label: 'sample2',
                    value: 'sample2',
                  },
                ],
              },
            ],
          },
        ],
      })
      .catch((err) => {
        console.error(JSON.stringify(err, null, 2));
        console.error(err);
      });
*/
    const modal = new InteractionModal({
      title: `Send tag as message (${timeTag})`,
      custom_id: `modal-${type}-${epoch}`,
      customId: `modal-${type}-${epoch}`,
      components: [
        new ComponentActionRow({
          components: [
            new ComponentInputText({
              type: 4,
              custom_id: 'custom-text',
              customId: 'custom-text',
              style: MessageComponentInputTextStyles.PARAGRAPH,
              label: 'Enter Custom text',
              placeholder:
                'Put "{tag}" to make the tag appear at that location. Default: At the end of text.',
            }),
          ],
        }),
        new ComponentActionRow({
          components: [
            new ComponentInputText({
              type: 4,
              custom_id: 'custom-channel',
              customId: 'custom-channel',
              style: MessageComponentInputTextStyles.SHORT,
              label: 'Enter Channel ID',
              value: interaction.channel?.id,
              placeholder: 'Default current channel',
            }),
          ],
        }),
      ],
      async run(txtCtx) {
        console.log(JSON.stringify(txtCtx));
        const customTextRow = txtCtx.data.components.get(0);
        const customTextInput = customTextRow?.components.get(
          'custom-text',
        ) as unknown as ComponentInputText;
        let customText = customTextInput.value;

        if (customText?.includes('{tag}')) {
          customText.replace('{tag}', timeTag);
        } else {
          customText = `${customText} ${timeTag}`;
        }

        const customChannelRow = txtCtx.data.components.get(0);
        const customChannelInput = customChannelRow?.components.get(
          'custom-text',
        ) as unknown as ComponentInputText;
        const customChannelId = customChannelInput.value!;

        const sendToChannel = interaction.guild?.channels.get(customChannelId) || interaction.channel;

        sendToChannel?.createMessage({
          content: customText,
        });
      },
    });

    await interaction.editOrRespond(modal);
  },
});
