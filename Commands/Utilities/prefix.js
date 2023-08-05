module.exports = {
    name: 'prefix',
    category: 'Utilities',
    description: 'Only usable by helpers+. Change the bot\'s prefix',
    aliases: [],
    syntax: 'prefix [new_prefix]',
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: (client, message, args, prefix) => {
        const newPrefix = message.content.split(' ').slice(1).join(' ')

        if (message.member.roles.highest.rawPosition < message.guild.roles.cache.get('1099570752560300102').rawPosition || !newPrefix) {
            return void message.reply(`The current server is having my prefix as \`-\``);
        }

        client.prefix.set(message.guild.id, newPrefix);
        message.reply(`My new prefix is \`${newPrefix}\`!`);
    }
}