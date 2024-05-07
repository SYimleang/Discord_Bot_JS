// Require the necessary discord.js classes
import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
import fetch from "node-fetch";
const token = process.env["token"];
const guildId = process.env["guildId"];
const clientId = process.env["clientId"];

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Arrays of words
const sadWords = ["sad", "depressed", "unhappy", "angry"];
const encouragements = [
  "Cheer up!",
  "Hang in there.",
  "You are a great person!",
];

// Fetch the data from "zenquotes"
function getQuote() {
  return fetch("https://zenquotes.io/api/random")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      return data[0]["q"] + " -" + data[0]["a"];
    });
}

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

// A listener for the event from the slashcommand
client.on("interactionCreate", async (interaction) => {
  // Check if the interaction is a command
  if (!interaction.isCommand()) return;

  if (interaction.commandName === "ping" && interaction.isCommand()) {
    await interaction.reply("pong!!!");
  } else if (interaction.commandName === "server") {
    await interaction.reply(
      `Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`,
    );
  }
});

// A listener for the event from the message
client.on("messageCreate", async (msg) => {
  // console.log(`Message from ${msg.author.username}: ${msg.content}`);
  if (msg.content === "ping") {
    await console.log(msg.reply("pong!!!"));
  } else if (msg.content === "$server") {
    await msg.reply(
      `Server name: ${msg.guild.name}\nTotal members: ${msg.guild.memberCount}`,
    );
  } else if (msg.content === "$inspire") {
    getQuote()
      .then()
      .then((quote) => msg.channel.send(quote));
  } else if (sadWords.some((word) => msg.content.includes(word))) {
    const encouragement =
      encouragements[Math.floor(Math.random() * encouragements.length)];
    await msg.reply(encouragement);
  }
});

// Log in to Discord with client's token
client.login(token);
