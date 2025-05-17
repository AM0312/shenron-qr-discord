export default function helpCommand(message) {
  const helpMessage = `
  **Bot Commands:**
  \`!sh-register\` - Register your friend code.
  \`!sh-qr @user\` - Generate a QR code for the mentioned user.
  \`!sh-edit\` - Edit your friend code.
  \`!sh-help\` - Display this help message.
  `;
  message.reply(helpMessage);
}
