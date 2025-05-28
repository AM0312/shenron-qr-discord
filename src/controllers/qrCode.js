import { generateQrEmbed } from "../utils/generateQrEmbed.js";

export default async function qrCodeCommand(message) {
  const args = message.content.trim().split(/\s+/).slice(1).slice(0, 3); // up to 3 codes

  if (args.length === 0) {
    return message.reply("Please provide up to 3 friend codes.");
  }

  if (args.length < 3) {
    await message.reply(
      `💡 Tip: You can now generate QR codes for up to **3 users/codes** in one command!`
    );
  }

  for (const code of args) {
    if (!/^[a-zA-Z0-9]{8}$/.test(code)) {
      await message.reply(`❌ \`${code}\` is not a valid friend code.`);
      continue;
    }

    const { embed, attachment } = await generateQrEmbed({
      friendCode: code,
      label: code,
    });

    await message.reply({ embeds: [embed], files: [attachment] });
  }
}
