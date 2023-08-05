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

    if (message.content === '<@1122821715815321651>') {
        message.reply(`wassup, my prefix is \`${prefix}\`. if this prefix collides with those of other bots, use \`${prefix}prefix [new_prefix]\``);
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