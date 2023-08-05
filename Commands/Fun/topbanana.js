const { EmbedBuilder } = require("discord.js");
const { byValue, byNumber } = require('sort-es')

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
    const lbUnsorted = JSON.parse(client.banana.export()).keys
    const lbSorted = lbUnsorted.sort(byValue(i => i.value, byNumber({ desc: true }))).slice(0, 10)

    let description = [];
    for (const entry of lbSorted) {
      const entryVal = Object.values(entry);
      const user = await client.users.fetch(entryVal[0])
      description.push(`**‣ ${user.username}** - ${entryVal[1]}`)
    }

    const bananEmbed = new EmbedBuilder()
      .setTitle(`THE FORTNITE BALLS LEADERBANAN`)
      .setDescription(description.join(`\n`))
      .setColor(`Yellow`);

    message.reply({ embeds: [bananEmbed] })
  }
}