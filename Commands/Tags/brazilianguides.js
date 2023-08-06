const { EmbedBuilder } = require(`discord.js`);

module.exports = {
    name: 'brazilianguides',
    category: 'Tags',
    description: 'Guias traduzidos em português para iniciantes.',
    aliases: ['br_guides', 'br_g'],
    syntax: `brazilianguides`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: async (client, message, args, prefix) => {
        const embed = new EmbedBuilder()
        .setTitle(`Guias Brasileiros`)
        .setDescription(`## • Criando covers e treino utilizando Colab: \nhttps://docs.google.com/document/d/1Mmoocy4luVSFRqqGI1NGQHbMGKMNRPNyFrhJRuLEkcs/?usp=sharing\n## • Instalando RVC Localmente:\nhttps://docs.google.com/document/d/1mivBJRFtcg4erID_9jfxJA_ycXRGUmiCm37CuF8xVA0`)
        .setColor(`Yellow`);

        message.channel.send({embeds: [embed]});
    }
}