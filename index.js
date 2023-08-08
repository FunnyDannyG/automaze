const Enmap = require("enmap");
const documents = require(`./JSON/models.json`);
const miniSearch = require('minisearch');
// require('dotenv').config();

const express = require("express");
const app = express();

app.listen(3000, () => {
  console.log("whatever you want here");
});

app.get("/", (req, res) => {
  res.send("whatever you want here");
});

// If you are going to fork this, remove line 5-14, they are there for hosting purpose, you don't need them if you run locally

const Discord = require(`discord.js`);

const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.MessageContent,
        Discord.GatewayIntentBits.GuildModeration,
        Discord.GatewayIntentBits.GuildMembers
    ],
    allowedMentions: {
        parse: [`users`]
    }
});

client.commands = new Discord.Collection();

client.snipes = new Discord.Collection();
client.esnipes = new Discord.Collection();

client.banana = new Enmap({name: 'banana'});
client.bananaCD = new Enmap();
client.scourCD = new Enmap();

client.items = new Enmap({name: 'items'});
client.currencies = new Enmap({name: 'currencies'});
client.equipments = new Enmap({name: 'equipments'});

client.models = new Enmap({name: 'models'});
client.levels = new Enmap({name: 'levels'});
client.exp = new Enmap({name: 'exp'});

client.epochs = new Enmap({name: 'epochs'});

client.use = new Discord.Collection();

client.doxx = new Discord.Collection();

client.prefix = new Enmap({name: 'prefix'});
client.modelSearchEngine = new miniSearch({
    fields: ['title', 'creator', 'downloadURL'],
    storeFields: ['title', 'creator', 'downloadURL', 'tags', 'creationTimestamp']
});

client.modelSearchEngine.addAll(documents);

[`commandHandler`, `eventHandler`, `processHandler`].forEach(handler => {
    require(`./Handlers/${handler}`)(client, Discord);
});

// slash commands bruh
client.slashCommands = new Discord.Collection();

const fs = require('node:fs');
const path = require('node:path');

const foldersPath = path.join(__dirname, 'Commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('Slash.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.slashCommands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.on(Discord.Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
	
    const command = interaction.client.slashCommands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

client.login(process.env.token); // Import dotenv and make your own env file with the token in it
