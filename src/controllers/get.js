import User from "../models/user.js";

export default async function getCommand(message) {
  const mentionedUser = message.mentions.users.first();
  if (!mentionedUser) {
    return message.reply("Please mention a user to get their friend code.");
  }

  const userData = await User.findOne({ userId: mentionedUser.id });
  if (!userData) {
    return message.reply(`${mentionedUser.username} is not registered yet.`);
  }

  return message.reply(
    `🧾 Friend code for ${mentionedUser.tag} is: \`${userData.friendCode}\``
  );
}
