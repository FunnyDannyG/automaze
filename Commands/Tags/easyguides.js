const { EmbedBuilder } = require("discord.js")

module.exports = {
    name: 'easyguides',
    category: 'Tags',
    description: 'Guides for absolute beginners',
    aliases: ['ezguides', 'ezguide'],
    syntax: `easyguides`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: async (client, message, args, prefix) => {
        const embed = new EmbedBuilder()
        .setTitle(`Rudimentary guides`)
        .setDescription(`## • Guides for absolute beginners made by JLabDX\nhttps://docs.google.com/document/d/1J-JlFGglJY7SpLtC-_3p8lW8CL_WJYqbo5X6CA7OnKM/edit?usp=drivesdk`)
        .setColor(`Yellow`);

        message.channel.send({embeds: [embed]});
    }
}