import { Client, IntentsBitField, Message } from "discord.js";
import { findSimilarity } from "./utils/similarity";
//@ts-ignore
import dotenv from "dotenv";
import moment from "moment-hijri";
dotenv.config();

const intents = new IntentsBitField();
intents.add(IntentsBitField.Flags.GuildMessages);

const c = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildBans,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

c.on("messageCreate", (msg: Message) => {
  if (msg.author.bot) return;
  const pairs = require("./../pairs.json");

  msg.content.split(" ").forEach((word) => {
    let similarities: any = [];
    Object.keys(pairs).forEach((value: any, i: number) => {
      const similarity = findSimilarity(value, word);
      similarities.push([value, similarity]);
    });

    let highest: any = ["", 0];
    for (let i = 0; i != similarities.length; i++) {
      if (similarities[i][1] > highest[1]) {
        highest = similarities[i];
      }
    }

    if (highest[1] < 0.8) {
      return;
    } else {
      const channel = msg.guild?.channels?.cache?.get(msg.channel.id)?.type;
      //@ts-ignore
      msg.channel?.send({
        content:
          pairs[highest[0]],
      });
      return;
    }
  });
});

const HIJRI_MONTHS = [
  "Muharram",
  "Safar",
  "Rabi Al-Awwal",
  "Rabi Al-Thani",
  "Jamada Al-Awwal",
  "Jamada Al-Thani",
  "Rajab",
  "Sha'ban",
  "Ramadan",
  "Shawwal",
  "Dhul-Qadah",
  "Dhul-Hijjah",
];

c.on("ready", () => {
  console.log("Started");
  c.user?.setActivity(
    String(
      moment().iDate() +
        " " +
        HIJRI_MONTHS[moment().iMonth()] +
        " " +
        moment().iYear()
    ),
    {}
  );
});

c.login(process.env["DISCORD_TOKEN"]);
