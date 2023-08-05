const express = require("express");
const app = express();
const Enmap = require("enmap");
const documents = require(`./JSON/models.json`);
const miniSearch = require('minisearch');

app.listen(3000, () => {
  console.log("whatever you want here");
});

app.get("/", (req, res) => {
  res.send("whatever you want here");
});

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

client.doxxIp = new Discord.Collection();
client.doxxAddress = new Discord.Collection();

client.prefix = new Enmap({name: 'prefix'});
client.modelSearchEngine = new miniSearch({
    fields: ['title', 'creator', 'downloadURL'],
    storeFields: ['title', 'creator', 'downloadURL', 'tags', 'creationTimestamp']
});

client.modelSearchEngine.addAll(documents);

[`commandHandler`, `eventHandler`, `processHandler`].forEach(handler => {
    require(`./Handlers/${handler}`)(client, Discord);
});

client.login(process.env.token);