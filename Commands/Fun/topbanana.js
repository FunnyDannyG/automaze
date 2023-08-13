const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: 'topbanana',
  category: 'Fun',
  description: 'SEE HOW MUCH SOMEONE GOT BANAN!!!!11!111!11',
  aliases: ['topbanan', 'bananatop', 'banantop'],
  syntax: `topbanana [member]`,
  /**
   * 
   * @param {Client} client 
   * @param {Message} message 
   * @param {string[]} args 
   * @param {String} prefix 
   */
  run: async (client, message, args, prefix) => {
    const embedBuilder = new EmbedBuilder()
                              .setTitle('DEPRECATED!')
                              .setColor(0xFF0000)
                              .setDescription('Use **/topbanana** instead');
    await message.reply({ embeds: [embedBuilder] });
  }
}