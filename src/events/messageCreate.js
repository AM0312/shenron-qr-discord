import helpCommand from "../controllers/help.js";
import registerCommand from "../controllers/register.js";
import editCommand from "../controllers/edit.js";
import qrCommand from "../controllers/qr.js";
import { OWNER_ID } from "../config.js";
import Settings from "../models/settings.js";

async function isQrEnabled() {
  const setting = await Settings.findOne({ key: "qrEnabled" });
  return setting?.value ?? true; // default: true
}

async function toggleQr() {
  let setting = await Settings.findOne({ key: "qrEnabled" });

  if (setting) {
    setting.value = !setting.value;
    await setting.save();
  } else {
    setting = new Settings({ key: "qrEnabled", value: false });
    await setting.save();
  }

  return setting.value;
}

export default function setupMessageHandler(client) {
  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    if (message.content.startsWith("!sh-toggle-qr")) {
      if (message.author.id !== OWNER_ID) {
        return message.reply("You are not authorized to use this command.");
      }

      const newState = await toggleQr();
      return message.channel.send(
        `QR functionality is now ${newState ? "**ENABLED**" : "**DISABLED**"}.`
      );
    }

    if (message.content.startsWith("!sh-help")) helpCommand(message);
    else if (message.content.startsWith("!sh-register"))
      registerCommand(message);
    else if (message.content.startsWith("!sh-edit")) editCommand(message);
    else if (message.content.startsWith("!sh-qr")) {
      const enabled = await isQrEnabled();
      if (!enabled) {
        return message.reply("QR code functionality is currently disabled.");
      }
      qrCommand(message);
    }
  });
}
