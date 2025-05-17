import User from "../models/user.js";

export default async function registerCommand(message) {
  let user = await User.findOne({ userId: message.author.id });
  if (user) {
    return message.reply(
      "You are already registered. Use !sh-edit to update your friend code."
    );
  }

  const filter = (m) => m.author.id === message.author.id;
  message.reply("Please enter your friend code:");
  const collected = await message.channel.awaitMessages({
    filter,
    max: 1,
    time: 60000,
    errors: ["time"],
  });

  const friendCode = collected.first().content;
  if (!/^[a-zA-Z0-9]{8}$/.test(friendCode)) {
    return message.reply(
      "Invalid friend code. It must be 8 alphanumeric characters."
    );
  }

  user = new User({
    username: message.author.username,
    userId: message.author.id,
    friendCode,
  });
  await user.save();
  message.reply("You have been registered successfully!");
}
