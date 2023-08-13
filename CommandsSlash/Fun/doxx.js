const Chance = require("chance");
const chance = new Chance;
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")

module.exports = {
    category: `Fun`,
    scope: `global`,
    type: `slash`,   
    data: new SlashCommandBuilder()
                .setName('doxx')
                .setDescription('NOT ACTUAL DOXXING. creates random ip and house address')
                .addUserOption(option => 
                    option
                        .setName('user')
                        .setDescription('User to doxx')
                        .setRequired(true)
                ),
    async execute(client, interaction) {
        const member = interaction.options.getUser('user');

        const [ip, ipv6, mac, address] = interaction.client.doxx.ensure(
            member.id, () => [chance.ip(), chance.ipv6(), chance.mac_address(), chance.address()]
        );

        const fetchingEmbed = new EmbedBuilder()
                                    .setTitle(`⏳ Fetching...`)
                                    .setColor(`Yellow`);

        const reply = await interaction.reply({embeds: [fetchingEmbed]});

        const foundEmbed = new EmbedBuilder()
                                .setTitle(`✅ Found!`)
                                .setDescription(`**IP**: ${ip}\n**IPv6**: ${ipv6}\n**MAC Address**: ${mac}\n**Address (not exact)**: ${address}`)
                                .setColor(`Green`);
        setTimeout(async () => {
            reply.edit({embeds: [foundEmbed]});
        }, 3000)
    }
}
