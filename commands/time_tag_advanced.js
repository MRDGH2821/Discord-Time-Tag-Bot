const { SlashCommandBuilder } = require("@discordjs/builders");
const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);
const { MessageActionRow, MessageButton } = require("discord.js");

function validateDateString(day, month, year) {
  day = Number(day);
  month = Number(month) - 1; //bloody 0-indexed month
  year = Number(year);

  let d = new Date(year, month, day);

  let yearMatches = d.getUTCFullYear() === year;
  let monthMatches = d.getUTCMonth() === month;
  let dayMatches = d.getUTCDate() === day;

  return yearMatches && monthMatches && dayMatches;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("time_tag_advanced")
    .setDescription("Generates Time tag in custom TimeZone!")
    .addIntegerOption(option =>
      option
        .setName("year")
        .setDescription("Enter Year in YYYY format")
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName("month")
        .setDescription("Enter Month in MM format")
        .setRequired(true)
        .addChoice("1", 1)
        .addChoice("2", 2)
        .addChoice("3", 3)
        .addChoice("4", 4)
        .addChoice("5", 5)
        .addChoice("6", 6)
        .addChoice("7", 7)
        .addChoice("8", 8)
        .addChoice("9", 9)
        .addChoice("10", 10)
        .addChoice("11", 11)
        .addChoice("12", 12)
    )
    .addIntegerOption(option =>
      option
        .setName("day")
        .setDescription("Enter Day in DD format")
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName("hours")
        .setDescription("Enter Hours in 12-hour format")
        .setRequired(true)
        .addChoice("1", 1)
        .addChoice("2", 2)
        .addChoice("3", 3)
        .addChoice("4", 4)
        .addChoice("5", 5)
        .addChoice("6", 6)
        .addChoice("7", 7)
        .addChoice("8", 8)
        .addChoice("9", 9)
        .addChoice("10", 10)
        .addChoice("11", 11)
        .addChoice("12", 12)
    )
    .addIntegerOption(option =>
      option
        .setName("minutes")
        .setDescription("Enter Minutes in MM format")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("meridiem")
        .setDescription("Ante or Post meridiem (AM or PM)")
        .setRequired(true)
        .addChoice("am", "am")
        .addChoice("pm", "pm")
    )
    .addStringOption(option =>
      option
        .setName("utc")
        .setDescription(
          "Enter Offset from UTC (for eg -> -05:00 or +06:30 or +00:00)"
        )
        .setRequired(true)
    ),
  async execute(interaction) {
    const year = interaction.options.getInteger("year");
    let month = interaction.options.getInteger("month");
    let day = interaction.options.getInteger("day");
    let hour = interaction.options.getInteger("hours");
    let min = interaction.options.getInteger("minutes");
    const meridiem = interaction.options.getString("meridiem");
    let utcOff = interaction.options.getString("utc");
    const oldUtc = utcOff;
    let utcProcess;

    //TimeZone Validator using Regex
    if (/^([+|-]{1})([0-1]{1}[0-9]{1}):?([0-6]{1}[0-9]{1})/g.test(utcOff)) {
      console.log("Timezone is valid.");
    } else {
      let sign;
      if (!/^(\+|-)/gm.test(utcOff)) {
        //if no sign provided, add positive sign by default.
        utcOff = `+${utcOff}`;
      }
      //Extract Sign
      sign = utcOff.charAt(0);

      //Extract rest of the string for validation
      utcProcess = utcOff.slice(1);
      console.log(utcProcess);

      if (/:/gm.test(utcProcess)) {
        //removes colon from timezone
        utcProcess = utcProcess.split(":").join();
      }

      if (/^\d{3}$/gm.test(utcProcess)) {
        ///three digit processing
        if (/^[0-1]{1}[0-2]{1}[0-6]{1}$/gm.test(utcProcess)) {
          //if the number lies in between 000-126
          utcProcess = `${utcProcess.slice(0, 2)}:${utcProcess.charAt(2)}0`;
        } else {
          //in other cases, first digit will be extracted & rest 2 ill be put in end
          utcProcess = `0${utcProcess.charAt(0)}:${utcProcess.slice(1)}`;
        }
      }

      if (/^\d{2}$/gm.test(utcProcess)) {
        //two digit rocessing
        if (/^[1][0-2]$/gm.test(utcProcess)) {
          //if the two digits are 10,11,12; just append :00
          utcProcess = `${utcProcess}:00`;
        } else {
          //for other cases, split in middle & proceed
          utcProcess = `0${utcProcess[0]}:${utcProcess[1]}0`;
        }
      }

      if (/^\d{1}$/gm.test(utcProcess)) {
        //single digit processing
        utcProcess = `0${utcProcess}:00`;
      }

      //Finally assign processed string, free of mistakes.
      utcOff = `${sign}${utcProcess}`;
    }

    //Regex checker for other variables
    if (/^\d{1}$/gm.test(month)) {
      month = `0${month}`;
    }
    if (/^\d{1}$/gm.test(day)) {
      day = `0${day}`;
    }
    if (/^\d{1}$/gm.test(hour)) {
      hour = `0${hour}`;
    }
    if (/^\d{1}$/gm.test(min)) {
      min = `0${min}`;
    }

    const daystr = `${year} ${month} ${day} ${hour} ${min} ${meridiem} ${utcOff}`;
    console.log(daystr);
    const epoch = dayjs(daystr, "YYYY M D HH m a Z").unix();
    const date = `${year}-${month}-${day}`;
    const time = `${hour}:${min}`;
    const tagOutput = {
      color: "0xf1efef",
      title: "Time Tag Generated!",
      description:
        "Click on corresponding button to get the time tag in your desired format! ",
      fields: [
        {
          name: "Input given",
          value: `Time Epoch: \`${epoch}\` \nDate: ${date} \nTime: ${time} ${meridiem} \nUTC: ${utcOff}`
        },
        {
          name: "Format 1",
          value: `\`<t:${epoch}:t>\` <t:${epoch}:t>`
        },
        {
          name: "Format 2",
          value: `\`<t:${epoch}:T>\` <t:${epoch}:T>`
        },
        {
          name: "Format 3",
          value: `\`<t:${epoch}:d>\` <t:${epoch}:d>`
        },
        {
          name: "Format 4",
          value: `\`<t:${epoch}:D>\` <t:${epoch}:D>`
        },
        {
          name: "Format 5",
          value: `\`<t:${epoch}:f>\` <t:${epoch}:f>`
        },
        {
          name: "Format 6",
          value: `\`<t:${epoch}:F>\` <t:${epoch}:F>`
        },
        {
          name: "Format 7",
          value: `\`<t:${epoch}:R>\` <t:${epoch}:R>`
        },
        {
          name: "Format 8",
          value: `\`<t:${epoch}>\` <t:${epoch}>`
        }
      ],
      footer: {
        text: "Just click on corresponding button to get time tag!"
      }
    };

    const row1 = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId("formatone")
          .setLabel("Format 1")
          .setStyle("PRIMARY")
      )
      .addComponents(
        new MessageButton()
          .setCustomId("formattwo")
          .setLabel("Format 2")
          .setStyle("PRIMARY")
      )
      .addComponents(
        new MessageButton()
          .setCustomId("formatthree")
          .setLabel("Format 3")
          .setStyle("PRIMARY")
      )
      .addComponents(
        new MessageButton()
          .setCustomId("formatfour")
          .setLabel("Format 4")
          .setStyle("PRIMARY")
      );
    const row2 = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId("formatfive")
          .setLabel("Format 5")
          .setStyle("PRIMARY")
      )
      .addComponents(
        new MessageButton()
          .setCustomId("formatsix")
          .setLabel("Format 6")
          .setStyle("PRIMARY")
      )
      .addComponents(
        new MessageButton()
          .setCustomId("formatseven")
          .setLabel("Format 7")
          .setStyle("PRIMARY")
      )
      .addComponents(
        new MessageButton()
          .setCustomId("formateight")
          .setLabel("Format 8")
          .setStyle("PRIMARY")
      );
    const utcBool = /^([+|-]{1})([0-1]{1}[0-9]{1}):?([0-6]{1}[0-9]{1})/g.test(
      utcOff
    );
    const dateBool = validateDateString(day, month, year);
    const timeBool = /^((0?[1-9]{1})|(1{1}[0-2]{1}))((:[0-5][0-9])?)$/gm.test(
      time
    );
    try {
      if (utcBool && dateBool && timeBool) {
        const msg = await interaction.reply({
          embeds: [tagOutput],
          fetchReply: true,
          components: [row1, row2]
        });
        const collector = msg.createMessageComponentCollector({
          componentType: "BUTTON",
          time: 15000
        });
        collector.on("collect", i => {
          if (i.customId === "formatone") {
            i.reply(`\`<t:${epoch}:t>\``);
          } else if (i.customId === "formattwo") {
            i.reply(`\`<t:${epoch}:T>\``);
          } else if (i.customId === "formatthree") {
            i.reply(`\`<t:${epoch}:d>\``);
          } else if (i.customId === "formatfour") {
            i.reply(`\`<t:${epoch}:D>\``);
          } else if (i.customId === "formatfive") {
            i.reply(`\`<t:${epoch}:f>\``);
          } else if (i.customId === "formatsix") {
            i.reply(`\`<t:${epoch}:F>\``);
          } else if (i.customId === "formatseven") {
            i.reply(`\`<t:${epoch}:R>\``);
          } else if (i.customId === "formateight") {
            i.reply(`\`<t:${epoch}>\``);
          }
        });

        collector.on("end", collected => {
          console.log(`Collected ${collected.size} interactions.`);
          tagOutput.footer.text = "Time out! Re-run the command again.";
          return interaction.editReply({ embeds: [tagOutput], components: [] });
        });
      } else {
        const errEmb = {
          color: "0xf1efef",
          title: "Invalid Input!",
          description: `Please check the inputs you have provided!\n\nPossible reasons for incorrect inputs:\nTimezone was incorrect (even after processing) \nDate is invalid (Day \`${day}\` doesn't exist in Month \`${month}\` in the Year \`${year}\`) \nTime is invalid (Incorrect minute \`${min}\`)`,
          fields: [
            {
              name: `Correct Timezone examples`,
              value: `\`+05:30\` \n\`-04:00\` \n\`+00:00\``
            },
            {
              name: `Examples which will be processed`,
              value: `\`530\` = \`+05:30\` \n\`-4\` = \`-04:00\` \n\`0\` = \`+00:00\``
            },
            {
              name: `Your Timezone Input *before* processing`,
              value: `\`${oldUtc}\``
            },
            {
              name: `Your Timezone Input *after* processing`,
              value: `\`${utcOff}\``
            },
            {
              name: `Your Date input (YYYY-MM-DD)`,
              value: `\`${date}\``
            },
            {
              name: `Your Time input (HH:MM)`,
              value: `\`${time}\``
            },
            {
              name: `Regex used for evaluating TimeZone`,
              value: `\`/^([+|-]{1})([0-1]{1}[0-9]{1}):?([0-6]{1}[0-9]{1})/g\``
            },
            {
              name: `Regex used for evaluating Time`,
              value: `\`/^((0?[1-9]{1})|(1{1}[0-2]{1}))((:[0-5][0-9])?)$/gm\``
            }
          ]
        };

        return await interaction.reply({
          embeds: [errEmb],
          fetchReply: true
        });
      }
    } catch (error) {
      console.error(error);
      return interaction.reply(
        `Uhhh, sorry an error occured. Please use \`/help\` command & reach out bot developer with error screenshot.\nError dump: \`${error}\``
      );
    }
  }
};
