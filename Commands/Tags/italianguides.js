const { EmbedBuilder } = require(`discord.js`);

module.exports = {
    name: 'italianguides',
    category: 'Tags',
    description: 'Guide alle Colab e altre cose importanti riguardanti RVC in italiano',
    aliases: ['it_guides', 'it_g'],
    syntax: `italianguides <member>`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: async (client, message, args, prefix) => {
        const embed = new EmbedBuilder()
        .setTitle(`Risorse`)
        .setDescription(`## • Link utili a cura di Ilaria\nhttps://rentry.org/link-utili`)
        .setColor(`Yellow`);

        if (message.mentions.members.first()) {
            return void message.channel.send({content: `*Link suggeriti per ${message.mentions.members.first()}*`, embeds: [embed]});
        }

        message.channel.send({embeds: [embed]});
    }
}