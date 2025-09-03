const { EmbedBuilder} = require('discord.js');

module.exports = [
    {
        name: "ping",
        description: 'ping pong',
        execute(msg, args) {
            msg.channel.send(`${msg.author} 🏓 Pong!`);
        }
    },
    
    {
      name: "serverinfo",
      description: "Shows information about the server",
      execute: async (msg, args) => {
        const guild = msg.guild;
        if (!guild) return msg.channel.send("❌ This command can only be used in a server!");
        const member = msg.member;
        let color = 0x5865F2;
        if (member.roles && member.roles.highest) {
          if (member.roles.highest.color) color = member.roles.highest.color;
        }
        await guild.members.fetch();
        const humans = guild.members.cache.filter(m => !m.user.bot).size;
        const bots = guild.members.cache.filter(m => m.user.bot).size;
        const createdAt = `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`;
        const region = guild.preferredLocale || "N/A";
        const embed = new EmbedBuilder()
          .setTitle(`${guild.name}`)
          .setColor(color)
          .setThumbnail(guild.iconURL({ dynamic: true, size: 64 }))
          .addFields(
            { name: "Server ID", value: guild.id, inline: true },
            { name: "Owner", value: `<@${guild.ownerId}>`, inline: true },
            { name: "\u200B", value: "\u200B", inline: true },
            { name: "Created On", value: createdAt, inline: true },
            { name: "Region / Locale", value: region, inline: true },
            { name: "\u200B", value: "\u200B", inline: true },
            { name: "Members", value: `${humans}`, inline: true },
            { name: "Bots", value: `${bots}`, inline: true },
            { name: "\u200B", value: "\u200B", inline: true },
            { name: "Boost Level", value: `${guild.premiumTier}`, inline: true }
          )
          .setFooter({ text: `Requested by ${msg.author.tag}`, iconURL: msg.author.displayAvatarURL({ dynamic: true }) });
        msg.channel.send({ embeds: [embed] });
      }
    },
    
{
  name: "clear",
  description: "Clears all messages in the current channel",
  execute: async (msg, args) => {
    // Berechtigungen prüfen
    if (!msg.member.permissions.has("ManageMessages")) {
      return msg.channel.send("❌ You don't have permission to manage messages.");
    }

    const channel = msg.channel;

    try {
      let fetched;
      do {
        // Bis zu 100 Nachrichten auf einmal holen
        fetched = await channel.messages.fetch({ limit: 100 });
        if (fetched.size === 0) break;

        // Nachrichten löschen, filtert Nachrichten älter als 14 Tage automatisch
        await channel.bulkDelete(fetched, true);
      } while (fetched.size >= 1);

      // Optional: Bestätigung senden
      const confirmation = await channel.send("✅ All messages have been cleared!");
      setTimeout(() => confirmation.delete(), 5000);
    } catch (err) {
      console.error(err);
      msg.channel.send("❌ An error occurred while trying to clear the channel!");
    }
  }
}

]