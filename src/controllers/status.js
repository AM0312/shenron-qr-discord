import os from "os";
import { version as discordJsVersion } from "discord.js";
import { EmbedBuilder } from "discord.js";

export default async function statusCommand(message, client) {
  const uptime = process.uptime(); // in seconds
  const uptimeHours = Math.floor(uptime / 3600);
  const uptimeMinutes = Math.floor((uptime % 3600) / 60);
  const uptimeSeconds = Math.floor(uptime % 60);

  const embed = new EmbedBuilder()
    .setTitle("📊 Bot Status")
    .setColor(0x3498db)
    .addFields(
      {
        name: "Uptime",
        value: `${uptimeHours}h ${uptimeMinutes}m ${uptimeSeconds}s`,
        inline: true,
      },
      {
        name: "Memory Usage",
        value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
          2
        )} MB`,
        inline: true,
      },
      { name: "System", value: `${os.type()} ${os.release()}`, inline: true },
      { name: "Discord.js", value: discordJsVersion, inline: true },
      { name: "Node.js", value: process.version, inline: true }
    )
    .setTimestamp();

  await message.reply({ embeds: [embed] });
}
