import User from "../models/user.js";
import { generateQrEmbed } from "../utils/generateQrEmbed.js";

export default async function qrCommand(message) {
  const mentionedUsers = message.mentions.users.map((u) => u).slice(0, 3);

  if (mentionedUsers.length === 0) {
    return message.reply("Please mention up to 3 users to generate QR codes.");
  }

  if (mentionedUsers.length < 3) {
    await message.reply(
      `💡 Tip: You can now generate QR codes for up to **3 users/codes** in one command!`
    );
  }

  for (const user of mentionedUsers) {
    const userData = await User.findOne({ userId: user.id });

    if (!userData) {
      await message.reply(`${user.username} is not registered.`);
      continue;
    }

    const { embed, attachment } = await generateQrEmbed({
      friendCode: userData.friendCode,
      label: user.tag,
    });

    await message.reply({ embeds: [embed], files: [attachment] });
  }
}
