const Chance = require("chance");
const chance = new Chance;
const { EmbedBuilder } = require("discord.js")

module.exports = {
    name: 'doxx',
    category: 'Fun',
    description: 'NOT ACTUAL DOXXING. creates random ip and house address',
    aliases: [],
    syntax: `doxx`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: async (client, message, args, prefix) => {
        const ip = chance.ip();
        const address = chance.address();

        const fetchingEmbed = new EmbedBuilder()
        .setTitle(`⏳ Fetching...`)
        .setColor(`Yellow`);

        const reply = await message.reply({embeds: [fetchingEmbed]});

        const foundEmbed = new EmbedBuilder()
        .setTitle(`✅ Found!`)
        .setDescription(`**IP**: ${ip}\n**Address (not exact)**: ${address}`)
        .setColor(`Green`);
        
        setTimeout(async () => {
            reply.edit({embeds: [foundEmbed]});
        }, 3000)
    }
}