# DiscordJS-Example-Bot

A simple Discord bot built with Node.js and Discord.js.

## Requirements
- [Node.js](https://nodejs.org/) (version 16 or higher recommended)
- A Discord application & bot token from the [Discord Developer Portal](https://discord.com/developers/applications)

## Setup

1. Clone the repository:
   git clone https://github.com/unkn0wn-1337/DiscordJS-Example-Bot.git
   cd DiscordJS-Example-Bot

2. Install dependencies:
   npm install

3. Copy the example environment file and fill in your own credentials:
   cp .env.example .env

4. Open `.env` and replace the placeholders:
   BOT_TOKEN=your_discord_bot_token
   CLIENT_ID=your_discord_client_id
   GUILD_ID=your_discord_guild_id
   PREFIX=!

5. Start the bot:
   node index.js
