import User from "../models/user.js";

export default async function editCommand(message) {
  const user = await User.findOne({ userId: message.author.id });
  if (!user) {
    return message.channel.send(
      "You are not registered. Use !sh-register first."
    );
  }

  const filter = (m) => m.author.id === message.author.id;
  message.channel.send("Please enter your new friend code:");
  const collected = await message.channel.awaitMessages({
    filter,
    max: 1,
    time: 60000,
    errors: ["time"],
  });

  const newCode = collected.first().content;
  if (!/^[a-zA-Z0-9]{8}$/.test(newCode)) {
    return message.channel.send(
      "Invalid format. Use 8 alphanumeric characters."
    );
  }

  user.friendCode = newCode;
  await user.save();
  message.channel.send("Friend code updated!");
}
