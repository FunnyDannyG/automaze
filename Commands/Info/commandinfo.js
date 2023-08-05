const { EmbedBuilder } = require("discord.js")

module.exports = {
    name: 'commandinfo',
    category: 'Info',
    description: 'Information about one specific command',
    aliases: ['cinfo', 'cmdinfo'],
    syntax: 'commandinfo <cmd_name>',
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: (client, message, args, prefix) => {
        const cmd = args[0];
        if (!cmd) {
            return void message.reply(`specify a command you want to look up`)
        }

        if (!client.commands.get(cmd) && !client.commands.find(c => c.aliases && c.aliases.includes(cmd) && c.aliases !== [])) {
            return void message.reply(`that command doesnt exist`)
        }

        const command = client.commands.get(cmd) || client.commands.find(c => c.aliases && c.aliases.includes(cmd) && c.aliases !== [])

        const infoEmbed = new EmbedBuilder()
        .setDescription(`# \`${prefix}${command.name}\`\n- **Category**: ${command.category}\n- **Aliases**: ${command.aliases.join(`, `)}\n- **Description**: ${command.description}\n- **Syntax**: \`${prefix}${command.syntax}\``)
        .setColor(`Yellow`);

        message.reply({embeds: [infoEmbed]})
    }
}