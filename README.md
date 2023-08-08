# BEFORE FORKING
This project uses enmap, which is dependent on better-sqlite3. For some reason, better-sqlite3 only works in node v16, not v18. Before you fork, **make sure you are using node v16.20.1**.

v16.20.1 can be downloaded [here](https://nodejs.org/en/blog/release/v16.20.1).

In the event of you forked before reading, download node v16.20.1, delete `node_modules` folder and `package-lock.json` and do `npm i`

# automaze

General-purpose bot, primarily made for AI Hub. Its most notable features are models search engine and game.

Originally, this bot was made for fun and giggles within AI Hub. As the bot grows bigger, we are in need of major code overhaul to be eligible for verification. Made from scratch, albeit with a helping hand from Stack Overflow and ChatGPT, along with many painstaking hours of documentation staring.

***
# FungusDesu

The creator of the bot. He has absolutely zero damn knowledge of computer science, and he doesn't even know how data structures and algorithms work. Nevertheless, he somehow managed to plow through everything.

Without the help of his friends and collaborators, he could not stand where he is today.

If you want him to NOT be dependent on his mommy and daddy, you could <a href="https://ko-fi.com/fungusdesu" target="_blank">buy him a coffee to cure his decaffeination</a>

***
# Credits

This journey did not begin in solitude. People got my back throughout the programming adventures with resources and supports.
- Everytime I make something new, **1ski** would always be the first one I request to see the change.
- The bot uses enmap as its main database, but I had trouble setting it up. **Stovoy** was the only person to make it work.
- Despite working primarily with discord.py, **FDG** provides me with experience of how to git and what to do with the bot.
- When the bot first started out, its first mission was to filter voice models threads without a proper link. **kalomaze** was the admin who first recognized my aptitude.

There are too many to list here, but by and large this would not have been possible without **AI Hub**.

***
# Installation and setup

Automaze uses a variety of packages. They are all listed in `package.json`, to install them simply do `npm i`.

If you run this locally, you don't need to install express and setup. Read `index.js` for more information.

Make sure you have both **SERVER MEMBER INTENT** and **MESSAGE CONTENT INTENT** enabled in the bot developer portal

![intents](https://github.com/RayTracerGC/automaze/assets/141577659/a49ce3a2-f046-4423-a27e-7c796902699a)

Database folders by default are gitignored, so you have to either disable commands that use database-related stuff or set it up yourself. `enmap` is the database I use, but you can switch it into other db (provided to edit the code accordingly).

By default, automaze's token is not included (duh). Read `index.js` for more information.

If you encounter an error of the bot not finding `models.json`, replace the code with `_models.json` on line 2

```js
const documents = require(`./JSON/_models.json`);
```

To register the slash commands on a discord server (guild), put the guild ID in the `.env` file **guildId** variable

Example:

.env

```yaml
guildId=123456789
```

Then in run `deploy-commands.js`

```bash
node deploy-commands.js
```

***
# Thank you for coming to my TED talk
