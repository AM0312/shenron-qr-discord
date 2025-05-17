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

      const nickname = newState
        ? "QR Bot | All Features"
        : "QR Bot | Registration Only";

      await message.guild.members.me.setNickname(nickname);

      const statusEmbed = {
        title: "🛰 QR Functionality Status",
        color: newState ? 0x00ff88 : 0xff5555,
        description: newState
          ? "✅ QR is currently **ENABLED**.\nUsers can register, edit friend codes, and generate QR codes."
          : "❌ QR is currently **DISABLED**.\nUsers can still register and edit friend codes, but **QR generation is blocked**.",
        timestamp: new Date().toISOString(),
        footer: {
          text: `Toggled by ${message.author.tag}`,
        },
      };

      const sentMessage = await message.channel.send({ embeds: [statusEmbed] });

      try {
        await sentMessage.pin();

        const pinned = await message.channel.messages.fetchPinned();
        for (const msg of pinned.values()) {
          if (
            msg.author.id === client.user.id &&
            msg.id !== sentMessage.id &&
            msg.embeds.length &&
            msg.embeds[0].title === "🛰 QR Functionality Status"
          ) {
            await msg.unpin();
          }
        }
      } catch (err) {
        console.error("Error pinning/unpinning status message:", err);
      }

      return; // no additional reply
    }

    if (message.content.startsWith("!sh-help")) {
      await helpCommand(message);
    } else if (message.content.startsWith("!sh-register")) {
      await registerCommand(message);
    } else if (message.content.startsWith("!sh-edit")) {
      await editCommand(message);
    } else if (message.content.startsWith("!sh-qr")) {
      const enabled = await isQrEnabled();
      if (!enabled) {
        return message.reply("🚫 QR code functionality is currently disabled.");
      }
      await qrCommand(message);
    }
  });
}
