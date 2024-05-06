// // Require the necessary discord.js classes
// const { REST, Routes } = require("discord.js");
// const fs = require("node:fs");
// const path = require("node:path");
// const token = process.env["token"];
// const guildId = process.env["guildId"];
// const clientId = process.env["clientId"];

// const commands = [];
// // Construct a path to the commands directory.
// const folderPath = path.join(__dirname, "commands");
// // Reads the path to the directory and returns an array of all the folder names it contains, ['utility']
// const commandFolders = fs.readdirSync(folderPath);

// for (const folder of commandFolders) {
//   // Construct a path to the directory inside. (commands/utility/)
//   const commandsPath = path.join(folderPath, folder);
//   // Returns an array of all files names path contain (end with .js)
//   const commandFiles = fs
//     .readdirSync(commandsPath)
//     .filter((file) => file.endsWith(".js"));
//   // Iterate over the files and require them.
//   for (const file of commandFiles) {
//     // Construct a path to the file inside. (commands/utility/ping.js)
//     const filePath = path.join(commandsPath, file);
//     const command = require(filePath);
//     // Set a new item in the Collection with the key as the command name and the value as the exported module
//     if ("data" in command && "execute" in command) {
//       commands.push(command.data.toJSON());
//     } else {
//       console.log(
//         `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
//       );
//     }
//   }
// }

// // Construct and prepare an instance of the REST module
// const rest = new REST().setToken(token);

// // Deploy the commands
// (async () => {
// 	try {
// 		console.log(`Started refreshing ${commands.length} application (/) commands.`);

// 		// The put method is used to fully refresh all commands in the guild with the current set
// 		const data = await rest.put(Routes.applicationCommands(clientId, guildId),
// 			{ body: commands },
// 		);

// 		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
// 	} catch (error) {
// 		// And of course, make sure you catch and log any errors!
// 		console.error(error);
// 	}
// })();
