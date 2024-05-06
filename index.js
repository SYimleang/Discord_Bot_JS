// Require the necessary discord.js classes
const { Client, GatewayIntentBits } = require("discord.js");
const token = process.env["token"];
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const guildId = process.env["guildId"];
const clientId = process.env["clientId"];

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Set the Slash Commands
const commands = [
  {
    name: "ping",
    description: "Replies with Pong!",
  },
  {
    name: "server",
    description: "Replies with Server name",
  },
];

// Construct and prepare an instance of the REST module
const rest = new REST({ version: "10" }).setToken(token);

// Deploy the commands
(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commands,
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();

// Log in to Discord with your client's token
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// A listener for the event that will execute code when application receives an interaction
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === "Hi") {
    await interaction.reply("pong!!!");
  } else if (interaction.commandName === "server") {
    await interaction.reply(
      `Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`,
    );
  }
});

// Log in to Discord with client's token
client.login(token);
