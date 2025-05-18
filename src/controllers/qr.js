import User from "../models/user.js";
import QRCode from "qrcode";
import { AttachmentBuilder, EmbedBuilder } from "discord.js";
import DblTimestampHelper from "../utils/dblTimeStampHelper.js";

export default async function qrCommand(message) {
  const mentionedUser = message.mentions.users.first();
  if (!mentionedUser) {
    return message.reply("Please mention a user to generate a QR code for.");
  }

  const user = await User.findOne({ userId: mentionedUser.id });
  if (!user) {
    return message.reply(`${mentionedUser.username} is not registered yet.`);
  }

  const qrText =
    "4," + user.friendCode + DblTimestampHelper.createDblTimestamp();
  const qrBuffer = await QRCode.toBuffer(qrText, { width: 1000 });

  const attachment = new AttachmentBuilder(qrBuffer, {
    name: `${mentionedUser.username}_qr.png`,
  });

  const embed = new EmbedBuilder()
    .setTitle("🎟️ Friend Code QR")
    .setDescription(
      `**User:** ${mentionedUser.tag}\n**Friend Code:** \`${user.friendCode}\``
    )
    .setColor(0x00bfff)
    .setImage(`attachment://${mentionedUser.username}_qr.png`)
    .setTimestamp();

  return message.reply({ embeds: [embed], files: [attachment] });
}
