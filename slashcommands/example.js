const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = [
{
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Shows information about a user")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Select a user")
        .setRequired(true)
    ),
  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const member = await interaction.guild.members.fetch(user.id);
    const userId = user.id;
    const joinDate = member.joinedAt.toLocaleString("en-US", {
      weekday: "long", 
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const accountCreationDate = user.createdAt.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const status = member.presence?.status || "offline";
    let statusEmoji = "⚫ Offline"; 
    if (status === "online") {
      statusEmoji = "🟢 Online";
    } else if (status === "idle") {
      statusEmoji = "🟡 Idle";
    } else if (status === "dnd") {
      statusEmoji = "🔴 Do Not Disturb";
    }
    const roles =
      member.roles.cache
        .map((role) => `<@&${role.id}>`)
        .join(", ") || "No roles";
    const embedColor = member.displayHexColor && member.displayHexColor !== "#000000" 
      ? member.displayHexColor 
      : 0x5865F2;
    const embed = new EmbedBuilder()
      .setColor(embedColor)
      .setTitle("User Information")
      .setDescription(`Here is the information about **${user.tag}**:`)
      .addFields(
        { name: "Username", value: user.tag, inline: true },
        { name: "User ID", value: userId, inline: true },
        { name: "Status", value: statusEmoji, inline: true },
        { name: "Joined Server", value: joinDate, inline: false },
        { name: "Joined Discord", value: accountCreationDate, inline: false },
        { name: "Roles", value: roles, inline: false }
      )
      .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 512 }))
      .setFooter({
        text: interaction.guild.name,
        iconURL: interaction.client.user.displayAvatarURL(),
      })
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },
}

    
    
]