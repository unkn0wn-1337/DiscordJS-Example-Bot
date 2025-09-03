const fs = require('fs');
const { Client, Collection, GatewayIntentBits, REST, Routes, ActivityType } = require("discord.js");
const dotenv = require("dotenv");
dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
});

// Slash Commands
client.slashCommands = new Collection();

const slashCommands = [];
const slashFiles = fs
  .readdirSync("./slashcommands")
  .filter((file) => file.endsWith(".js"));

for (const file of slashFiles) {
  const commands = require(`./slashcommands/${file}`);
  if (Array.isArray(commands)) {
    for (const command of commands) {
      client.slashCommands.set(command.data.name, command);
      slashCommands.push(command.data.toJSON());
    }
  } else {
    client.slashCommands.set(commands.data.name, commands);
    slashCommands.push(commands.data.toJSON());
  }
}

const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);

(async () => {
  try {
    console.log("✅ Registering global slash commands...");
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: slashCommands }
    );
    console.log("✅ Slash commands successfully registered globally!");
  } catch (error) {
    console.error("❌ Error while registering slash commands:", error);
  }
})();

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.slashCommands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "❌ There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

// Prefix Commands
client.commands = new Collection();

const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const commands = require(`./commands/${file}`);
  if (Array.isArray(commands)) {
    for (const command of commands) {
      client.commands.set(command.name, command);
    }
  } else {
    client.commands.set(commands.name, commands);
  }
}

client.on("messageCreate", (message) => {
  if (message.author.bot) return;
  const prefix = process.env.PREFIX;
  if (message.content.startsWith(prefix)) {
    const args = message.content.slice(prefix.length).trim().split(/\s+/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);
    if (command) {
      command.execute(message, args);
    }
  }
});

client.once("ready", async () => {
  console.log(`✅ Bot is online as ${client.user.tag}`);
  const guildId = process.env.GUILD_ID;
  const guild = await client.guilds.fetch(guildId);
  if (!guild) {
    console.error('Guild not found!');
    return;
  }
  client.user.setPresence({
    activities: [{ name: "visit unkn0wn1337.de 🚀", type: ActivityType.Playing }],
    status: "online"
  });
});

client.login(process.env.BOT_TOKEN);
