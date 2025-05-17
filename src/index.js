import "dotenv/config";
import { Client, GatewayIntentBits } from "discord.js";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import path from "path";

import setupMessageHandler from "./events/messageCreate.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

setupMessageHandler(client);

client.login(process.env.BOT_TOKEN);
