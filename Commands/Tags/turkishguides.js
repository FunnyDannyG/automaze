const { EmbedBuilder } = require(`discord.js`);

module.exports = {
    name: 'turkishguides',
    category: 'Tags',
    description: 'AI Lab, Türkçe dil destekli sunucu ve 300\'den fazla Türkçe model',
    aliases: ['tr_guides', 'tr_g'],
    syntax: `turkishguides`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: async (client, message, args, prefix) => {
        const embed = new EmbedBuilder()
        .setTitle(`Rehberler`)
        .setDescription(`## • RVC V2 Türkçe Cover Rehberi\nhttps://docs.google.com/document/d/1-DStwOFy5kvOVk-AOdPNoXQOjS8P23p_/edit\n## • Türkçe EasyGui Colab (translated by AI Lab)\nhttps://colab.research.google.com/drive/1Kp62OdcNtH0flPKoAQJiiOkuUH4ftWeI?usp=sharing`)
        .setFooter({text: 'discord.gg/ailab'})
        .setColor(`Yellow`);

        message.channel.send({embeds: [embed]});
    }
}