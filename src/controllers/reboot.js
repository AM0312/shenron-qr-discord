import { isOwner } from "../utils/isPrivilegedUser.js";

export default async function rebootCommand(message) {
  const isBotOwner = await isOwner(message.author.id);
  if (!isBotOwner) {
    return message.reply("❌ Only the bot owner can reboot the bot.");
  }

  await message.reply("♻️ Rebooting the bot...");
  process.exit(0); // PM2 will restart the bot automatically
}
