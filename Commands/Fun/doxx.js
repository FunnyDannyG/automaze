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
        const member = message.mentions.members.first();

        if (!member) {
            return void message.reply(`no member to doxx provided`)
        }

        const [ip, ipv6, mac, address] = client.doxx.ensure(member.user.id, () => [chance.ip(), chance.ipv6(), chance.mac_address(), chance.address()]);

        const fetchingEmbed = new EmbedBuilder()
        .setTitle(`⏳ Fetching...`)
        .setColor(`Yellow`);

        const reply = await message.reply({embeds: [fetchingEmbed]});

        const foundEmbed = new EmbedBuilder()
        .setTitle(`✅ Found!`)
        .setDescription(`**IP**: ${ip}\n**IPv6**: ${ipv6}\n**MAC Address**: ${mac}\n**Address (not exact)**: ${address}`)
        .setColor(`Green`);
        
        setTimeout(async () => {
            reply.edit({embeds: [foundEmbed]});
        }, 3000)
    }
}