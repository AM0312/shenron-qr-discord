const { Client, GatewayIntentBits } = require("discord.js");
const mongoose = require("mongoose");
const QRCode = require("qrcode");
const User = require("./userModel");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

const mongoURI = process.env.MONGO_URI;
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

const token = process.env.BOT_TOKEN;

class DblTimestampHelper {
  static timestampEncoding = [
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "J",
    "K",
    "M",
    "N",
    "P",
    "Q",
    "R",
    "S",
    "T",
  ];

  static createDblTimestamp() {
    let creationDate = Date.now().toString(16);
    let encodedTimestamp = "";

    for (let i = 0; i < creationDate.length; i++) {
      encodedTimestamp +=
        DblTimestampHelper.timestampEncoding[parseInt(creationDate[i], 16)];
    }

    return encodedTimestamp;
  }
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith("!sh-help")) {
    const helpMessage = `
  **Bot Commands:**
  \`!sh-register\` - Register your friend code.
  \`!sh-qr @user\` - Generate a QR code for the mentioned user.
  \`!sh-edit\` - Edit your friend code.
  \`!sh-help\` - Display this help message.
  `;
    message.channel.send(helpMessage);
  }

  if (message.content.startsWith("!sh-register")) {
    let user = await User.findOne({ userId: message.author.id });
    if (user) {
      message.channel.send(
        "You are already registered. Use !sh-edit to update your friend code."
      );
      return;
    }

    const filter = (m) => m.author.id === message.author.id;
    message.channel.send("Please enter your friend code:");
    const collected = await message.channel.awaitMessages({
      filter,
      max: 1,
      time: 60000,
      errors: ["time"],
    });
    const friendCode = collected.first().content;

    const friendCodePattern = /^[a-zA-Z0-9]{8}$/;
    if (!friendCodePattern.test(friendCode)) {
      message.channel.send(
        "Invalid friend code format. The format is 8 alphanumeric characters."
      );
      return;
    }

    // Save to database
    user = new User({
      username: message.author.username,
      userId: message.author.id,
      friendCode: friendCode,
    });
    await user.save();
    message.channel.send("You have been registered successfully!");
  }

  if (message.content.startsWith("!sh-qr")) {
    const mentionedUser = message.mentions.users.first();
    if (!mentionedUser) {
      message.channel.send("Please mention a user to generate a QR code for.");
      return;
    }

    const user = await User.findOne({ userId: mentionedUser.id });
    if (!user) {
      message.reply(`${mentionedUser.username} hasn't registered yet.`);
      return;
    }

    const qrText =
      "4," + user.friendCode + DblTimestampHelper.createDblTimestamp();
    const qrCodeBuffer = await QRCode.toBuffer(qrText, { width: 1000 });

    message.channel.send({
      content: `Here is the QR code for ${mentionedUser.username}:`,
      files: [
        {
          attachment: qrCodeBuffer,
          name: `${mentionedUser.username}_qr.png`,
        },
      ],
    });
  }

  if (message.content.startsWith("!sh-edit")) {
    const user = await User.findOne({ userId: message.author.id });
    if (!user) {
      message.channel.send(
        "You are not registered yet. Use !sh-register to register first."
      );
      return;
    }

    const filter = (m) => m.author.id === message.author.id;
    message.channel.send("Please enter your new friend code:");
    const collected = await message.channel.awaitMessages({
      filter,
      max: 1,
      time: 60000,
      errors: ["time"],
    });
    const newFriendCode = collected.first().content;

    const friendCodePattern = /^[a-zA-Z0-9]{8}$/;
    if (!friendCodePattern.test(newFriendCode)) {
      message.channel.send(
        "Invalid friend code format. The format is 8 alphanumeric characters."
      );
      return;
    }

    user.friendCode = newFriendCode;
    await user.save();
    message.channel.send("Your friend code has been updated successfully!");
  }
});

client.login(token);
