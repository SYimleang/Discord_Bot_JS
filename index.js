// Require the necessary discord.js classes
import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
import fetch from "node-fetch";
import Database from "@replit/database";
const token = process.env["token"];
const guildId = process.env["guildId"];
const clientId = process.env["clientId"];

const db = new Database();

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
const starterEncouragements = [
  "Cheer up!",
  "Hang in there.",
  "You are a great person!",
];

// db.delete("encouragements");

// Function to get the encouragements from database or set default
db.get("encouragements").then((encouragements) => {
  // console.log(encouragements);
  if (!encouragements.ok || encouragements.length < 1) {
    db.set("encouragements", starterEncouragements);
  }
});

// Function to update encouragements
const updateEncouragements = async (encouragingMessage) => {
  try {
    const encouragements = await db.get("encouragements");
    let encouragementsArr = encouragements.value;
    // console.log(encouragements);
    // console.log(encouragementsArr);
    encouragementsArr.push(encouragingMessage);
    // console.log(encouragementsArr);
    await db.set("encouragements", encouragementsArr);
    // console.log(encouragements);
  } catch (error) {
    console.log(error);
  }
};

// Function to delete encouragements
const deleteEncouragement = async (index) => {
  try {
    const encouragements = await db.get("encouragements");
    let encouragementsArr = encouragements.value;
    // console.log(encouragements);
    // console.log(encouragementsArr);
    if (encouragementsArr.length > index) {
      encouragementsArr.splice(index, 1);
      db.set("encouragements", encouragementsArr);
    }
    // console.log(encouragements);
  } catch (error) {
    console.log(error);
  }
};

// Fetch the data from "zenquotes"
function getQuote() {
  try {
    return fetch("https://zenquotes.io/api/random")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        return data[0]["q"] + " -" + data[0]["a"];
      });
  } catch (error) {
    console.log(error);
  }
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
client.on("ready", async () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// A listener for the event from the slashcommand
client.on("interactionCreate", async (interaction) => {
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
  switch (msg.content) {
    case "ping": // ping message
      await msg.reply("pong!!!");
      break;
    case "$server": // $server message
      await msg.reply(
        `Server name: ${msg.guild.name}\nTotal members: ${msg.guild.memberCount}`,
      );
      break;
    case "$inspire": // $inspire message
      getQuote()
        .then()
        .then((quote) => msg.channel.send(quote));
      break;
    case "$list": // $list message
      db.get("encouragements").then(async (encouragements) => {
        encouragements.value.forEach(async (encouragement) => {
          await msg.channel.send(encouragement);
        });
      });
      break;
    default:
      // sad keyword included message (check respond status)
      db.get("responding").then((responding) => {
        if (
          responding.value &&
          sadWords.some((word) => msg.content.includes(word))
        ) {
          db.get("encouragements").then((encouragements) => {
            const encouragement =
              encouragements.value[
                Math.floor(Math.random() * encouragements.value.length)
              ];
            msg.reply(`Hi ${msg.author.username}. ${encouragement}`);
          });
        }
      });

      // Start with $new message (add new encouragement)
      if (msg.content.startsWith("$new")) {
        let encouragingMessage = msg.content.split("$new ")[1];
        updateEncouragements(encouragingMessage);
        await msg.channel.send("New encouraging message added.");
      }
      // Start with $del message (delete encouragement)
      else if (msg.content.startsWith("$del")) {
        let index = parseInt(msg.content.split("$del ")[1]);
        deleteEncouragement(index - 1);
        await msg.channel.send(
          `the encouraging message number ${index} deleted.`,
        );
      }
      break;
  }

  // Responding to sad words status management
  if (msg.content.startsWith("$responding")) {
    let value = msg.content.split("$responding ")[1];
    if (value.toLowerCase() === "true") {
      db.set("responding", true);
      await msg.channel.send("Responding is on.");
    } else if (value.toLowerCase() === "false") {
      db.set("responding", false);
      await msg.channel.send("Responding is off.");
    } else if (value.toLowerCase() === "check") {
      const status = await db.get("responding");
      console.log(await db.get("responding"));
      console.log(status.value);
      await msg.channel.send("Responding is " + status.value);
      console.log(db.get("responding"));
    } else {
      await msg.channel.send("Please enter true or false.");
    }
  }
});

// Log in to Discord with client's token
client.login(token);
