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
        name: "`!sh-qr @user1 [@user2 ...]`",
        value:
          "🎟️ Generate QR codes for up to **3 mentioned users** who are registered.",
      },
      {
        name: "`!sh-qr-code <code1> [code2 ...]`",
        value:
          "🚀 Generate QR codes directly from up to **3 friend codes**, no registration required.",
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
