const { EmbedBuilder } = require("discord.js")

module.exports = {
    name: 'gpu',
    category: 'Tags',
    description: 'Guides of what to do when your colab is unable to connect to a GPU',
    aliases: [],
    syntax: `gpu [member]`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: (client, message, args, prefix) => {
        const embed = new EmbedBuilder()
        .setTitle(`Ran out of GPU?`)
        .setDescription(`While training or inferring, if you encounter a dialog that tells you \`Cannot connect to GPU backend\`, your daily usage of GPU in Google Colab ended. You can either:\n- Pay for more GPU\n- Make an alt google acc`)
        .setColor(`Yellow`)
        .setImage(`https://cdn.discordapp.com/attachments/1089301011149103276/1123048294873059418/image.png`)

        if (message.mentions.members.first()) {
            return void message.channel.send({content: `*Tag suggestion for ${message.mentions.members.first()}*`, embeds: [embed]});
        }

        message.channel.send({embeds: [embed]});
    }
}