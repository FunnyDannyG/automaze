module.exports = {
    name: 'prefix_fr',
    category: 'Utilities',
    description: 'Only usable by helpers+. Change the bot\'s prefix to its default',
    aliases: [],
    syntax: 'prefix_fr',
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: (client, message, args, prefix) => {
        if (message.member.roles.highest.rawPosition < message.guild.roles.cache.get('1099570752560300102').rawPosition) {
            return void message.reply(`The current server is having my prefix as \`-\``);
        }

        client.prefix.set(message.guild.id, '-');
        message.reply(`Prefix for this server is restored to default!`);
    }
}