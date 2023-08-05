const { EmbedBuilder } = require(`discord.js`);

module.exports.run = (client, message, args) => {
    if (message.author.bot) {
        return;
    }

    const prefix = client.prefix.ensure(message.guild.id, '-');
    const range = i => [...Array(i).keys()];
    const arr = range(1000);
    const random = arr[Math.floor(Math.random() * arr.length)];
    const responses = ['ok but did you wash your ass today', 'ok but my rank is higher than yours', 'who asked lmaoooooo', 'https://tenor.com/view/watch-your-tone-goku-mui-gif-23784055', 'ok but you like men'];

    if (random === 69 && message.channel.id === '1125169728260931675') {
        message.reply(responses[Math.round(Math.random() * responses.length)]);
    }

    if (message.content.includes('<@1122821715815321651>')) {
        message.reply({embeds: [new EmbedBuilder().setColor(`Aqua`).setDescription(`## wassup im automaze\n- my prefix in this server is \`${prefix}\` (customizable with \`${prefix}prefix\`)\n- currently im present in ${client.guilds.cache.size} ${client.guilds.cache.size <= 1 ? `server` : `servers`}!\n- interested in how im built? [im actually open source!](https://github.com/DeprecatedTable/automaze)\n- feeling a tad bit generous? [buy me a coffee!](https://ko-fi.com/fungusdesu)`)]});
    }

    if (message.content.startsWith(prefix)) {
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName) && cmd.aliases !== []); // Use the command alias if there's any, if there's none use the real command name instead

        if (!command) {
            return;
        } // If can't find then do nothing

        command.run(client, message, args, prefix);
    }
}