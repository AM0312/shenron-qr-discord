import { OWNER_ID, PRIVILEGED_ROLE_IDS } from "../config.js";

export function isOwner(userId) {
  return userId === OWNER_ID;
}

export async function isPrivilegedUser(message) {
  if (isOwner(message.author.id)) return true;

  try {
    const member = await message.guild.members.fetch(message.author.id);
    return member.roles.cache.some((role) =>
      PRIVILEGED_ROLE_IDS.includes(role.id)
    );
  } catch (err) {
    console.error("Error checking user roles:", err);
    return false;
  }
}
