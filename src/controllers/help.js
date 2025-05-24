import { EmbedBuilder } from "discord.js";

export default async function helpCommand(message) {
  const helpEmbed = new EmbedBuilder()
    .setTitle("🛠 QR Bot Commands")
    .setColor(0x7289da)
    .setDescription("Here's a list of available commands:")
    .addFields(
      {
        name: "`!sh-register`",
        value: "Register your friend code.",
      },
      {
        name: "`!sh-edit`",
        value: "Edit your registered friend code.",
      },
      {
        name: "`!sh-qr @user`",
        value: "Generate a QR code for the mentioned user.",
      },
      {
        name: "`!sh-qr-code <friend_code>`",
        value:
          "Generate a QR code directly from a friend code (bypasses registration).",
      },
      {
        name: "`!sh-get @user`",
        value: "View the registered friend code for the mentioned user.",
      },
      {
        name: "`!sh-help`",
        value: "Show this help message.",
      }
    )
    .setFooter({ text: "Need more help? Contact .am03" })
    .setTimestamp();

  return message.reply({ embeds: [helpEmbed] });
}
