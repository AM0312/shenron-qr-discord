import QRCode from "qrcode";
import { AttachmentBuilder, EmbedBuilder } from "discord.js";
import DblTimestampHelper from "../utils/dblTimeStampHelper.js";

export default async function qrCodeCommand(message, args) {
  if (!args.length) {
    return message.reply(
      "❌ Please provide a friend code. Usage: `!sh-qr-code <friend_code>`"
    );
  }

  const friendCode = args[0];

  if (!/^[a-z0-9]{8}$/i.test(friendCode)) {
    return message.reply(
      "❌ Invalid friend code format. It must be exactly 8 alphanumeric characters."
    );
  }

  const qrText = "4," + friendCode + DblTimestampHelper.createDblTimestamp();

  try {
    const qrBuffer = await QRCode.toBuffer(qrText, { width: 1000 });
    const attachment = new AttachmentBuilder(qrBuffer, {
      name: `${friendCode}_qr.png`,
    });

    const embed = new EmbedBuilder()
      .setTitle("🎟️ Friend Code QR")
      .setDescription(`**Friend Code:** \`${friendCode}\``)
      .setColor(0x00bfff)
      .setImage(`attachment://${friendCode}_qr.png`)
      .setTimestamp();

    await message.reply({ embeds: [embed], files: [attachment] });
  } catch (error) {
    console.error("Error generating QR code:", error);
    return message.reply(
      "❌ Failed to generate QR code. Please try again later."
    );
  }
}
