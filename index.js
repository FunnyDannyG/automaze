const Enmap = require("enmap");
const documents = require(`./JSON/models.json`);
const miniSearch = require('minisearch');
// require('dotenv').config();
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
client.slashCommands = new Discord.Collection();  // slash commands bruh
client.contextMenuCommands = new Discord.Collection();

client.snipes = new Discord.Collection();
client.esnipes = new Discord.Collection();

client.banana = new Enmap({name: 'banana'});
client.bananaCD = new Enmap();
client.scourCD = new Enmap();
client.deprecationCD = new Discord.Collection();

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

[`commandHandler`, `eventHandler`, `processHandler`, `slashCommandHandler`].forEach(handler => {
    require(`./Handlers/${handler}`)(client, Discord);
});

// Add your bot token in the token variable in the .env file (create it if it doesn't exist)
// Then use dotenv to read the token from that file
client.login(process.env.token);
