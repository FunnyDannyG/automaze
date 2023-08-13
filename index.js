// Dev-Mode, uncomment if you are in dev mode
// Remember I will create the .env file if it is not already created
require('dotenv').config();

// Libraries
const fs = require('fs');
const Enmap = require("enmap");
const Discord = require(`discord.js`);

// Exports
const { getAllFiles } = require('./utils')

// JSONs
const DiscordIDs = {
    prod: "./Configs/idsDiscordProd.json",
    dev: "./Configs/idsDiscordDev.json"
}

// Hosting? only prod
// If you are going to fork this, remove line 5-14, they are there for hosting purpose, you don't need them if you run locally
if(!process.env.DB_URL){
    const express = require("express");
    const app = express();
    
    app.listen(3000, () => {
      console.log("whatever you want here");
    });
    
    app.get("/", (_, res) => {
      res.send("whatever you want here");
    });
}

// Discord Client initialization
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

// Discord IDs JSON
client.discordIDs = require(!process.env.DB_URL ? DiscordIDs.prod: DiscordIDs.dev);

// Discord Collections 
client.commands = new Discord.Collection();
client.slashCommands = new Discord.Collection();
client.contextMenuCommands = new Discord.Collection();
client.snipes = new Discord.Collection();
client.esnipes = new Discord.Collection();
client.deprecationCD = new Discord.Collection();
client.use = new Discord.Collection();
client.doxx = new Discord.Collection();

// Enmap's creation
client.items = new Enmap({name: 'items'});
client.currencies = new Enmap({name: 'currencies'});
client.equipments = new Enmap({name: 'equipments'});
client.models = new Enmap({name: 'models'});
client.levels = new Enmap({name: 'levels'});
client.exp = new Enmap({name: 'exp'});
client.epochs = new Enmap({name: 'epochs'});
client.banana = new Enmap({name: 'banana'});
client.bananaCD = new Enmap();
client.scourCD = new Enmap();
client.prefix = new Enmap({name: 'prefix'});

// Read all handlers of the folder
const handlerFiles = getAllFiles('./Handlers').filter(file => file.endsWith('.js'));
for(const handler of handlerFiles) {
    require(handler)(client, Discord);
};

// Add your bot token in the token variable in the .env file (create it if it doesn't exist)
// Then use dotenv to read the token from that file
client.login(process.env.token);