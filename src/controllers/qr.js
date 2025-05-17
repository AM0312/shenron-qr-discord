import QRCode from "qrcode";
import User from "../models/user.js";
import DblTimestampHelper from "../utils/dblTimeStampHelper.js";

export default async function qrCommand(message) {
  const mentionedUser = message.mentions.users.first();
  if (!mentionedUser) {
    return message.reply("Please mention a user.");
  }

  const user = await User.findOne({ userId: mentionedUser.id });
  if (!user) {
    return message.reply(`${mentionedUser.username} hasn't registered yet.`);
  }

  const qrText =
    "4," + user.friendCode + DblTimestampHelper.createDblTimestamp();
  const qrBuffer = await QRCode.toBuffer(qrText, { width: 1000 });

  message.reply({
    content: `QR code for ${mentionedUser.username}:`,
    files: [{ attachment: qrBuffer, name: `${mentionedUser.username}_qr.png` }],
  });
}
