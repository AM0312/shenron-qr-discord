import QRCode from "qrcode";
import { AttachmentBuilder, EmbedBuilder } from "discord.js";
import DblTimestampHelper from "./dblTimeStampHelper.js";

export async function generateQrEmbed({ friendCode, label }) {
  const qrText = "4," + friendCode + DblTimestampHelper.createDblTimestamp();
  const qrBuffer = await QRCode.toBuffer(qrText, { width: 1000 });

  const filename = `${label}_qr.png`;
  const attachment = new AttachmentBuilder(qrBuffer, { name: filename });

  const embed = new EmbedBuilder()
    .setTitle("🎟️ Friend Code QR")
    .setDescription(`**User:** ${label}\n**Friend Code:** \`${friendCode}\``)
    .setColor(0x00bfff)
    .setImage(`attachment://${filename}`)
    .setTimestamp();

  return { embed, attachment };
}
