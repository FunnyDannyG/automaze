const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'japaneseguides',
    category: 'Tags',
    description: '和訳版RVCガイド (KJAV 訳 SUSHI 校)',
    aliases: ['jp_guides', 'jp_g'],
    syntax: `japaneseguides`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: async (client, message, args, prefix) => {
        const embed = new EmbedBuilder()
        .setTitle(`ガイドリンク`)
        .setDescription(`## • 和訳版RVCガイド (KJAV 訳 SUSHI 校)\nhttps://docs.google.com/document/d/1heKuaedmHNBTXvOnTNpwj-w2Djbk4kndXsZ2Vx_Zkxc/edit?usp=sharing\n## • Mangio RVC Fork WebUI和訳版 (翻訳予定、インストール推奨)\nhttps://drive.google.com/drive/folders/1IZ8dr2PFHYiEXqNwruFljAYpsYt-fgKI?usp=sharing`)
        .setColor(`Yellow`);

        message.channel.send({embeds: [embed]});
    }
}