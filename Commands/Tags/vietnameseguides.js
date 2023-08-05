const { EmbedBuilder } = require(`discord.js`);

module.exports = {
    name: 'vietnameseguides',
    category: 'Tags',
    description: 'Hướng dẫn RVC trong tiếng Việt dịch bởi FungusDesu',
    aliases: ['vn_guides', 'vn_g'],
    syntax: `vietnameseguides <member>`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: async (client, message, args, prefix) => {
        const embed = new EmbedBuilder()
        .setTitle(`Hướng dẫn`)
        .setDescription(`## • Hướng dẫn huấn luyện + tạo tập dữ liệu\nhttps://docs.google.com/document/d/1YfmB9I9m1zZRZfZobsDFd0m9hNt7wFd86tSBkh-EqXw/edit`)
        .setColor(`Yellow`);

        if (message.mentions.members.first()) {
            return void message.channel.send({content: `*Gợi ý nhãn cho ${message.mentions.members.first()}*`, embeds: [embed]});
        }

        message.channel.send({embeds: [embed]});
    }
}