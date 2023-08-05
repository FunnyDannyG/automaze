const { StringSelectMenuBuilder, EmbedBuilder, ActionRowBuilder } = require("discord.js");
const fs = require('fs');

module.exports = {
    name: 'merchant',
    category: 'Game',
    description: 'Merchant. Can sell any type of item to any kind of merchant.',
    aliases: ['shop', 'market'],
    syntax: 'merchant [category]',
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: async (client, message, args, prefix) => {
        const placeholderEmbed = new EmbedBuilder()
        .setImage(`https://pbs.twimg.com/media/D-dnI-DXsAE4Z7C.png`)

        const selectMenu = new StringSelectMenuBuilder()
        .setCustomId(`dropdown`)
        .setPlaceholder(`Nothing selected`)

        const categories = fs.readdirSync(`${process.cwd()}/Commands/Game/shop`).filter(file => file.endsWith(`.js`))

        for (const category of categories) {
            const { option } = require(`./shop/${category}`);

            selectMenu.addOptions(option);
        }

        const dropdownActionRow = new ActionRowBuilder().addComponents(selectMenu);
        const reply = await message.reply({embeds: [placeholderEmbed], components: [dropdownActionRow]});

        const filter = i => i.customId === 'dropdown' && i.user.id === message.author.id;
        const collector = reply.createMessageComponentCollector({filter, time: 60000});

        collector.on('collect', i => {
            const { embed } = require(`./shop/${i.values[0]}`);
            i.update({embeds: [embed]});
        });

        collector.on(`end`, () => {
            reply.edit({embeds: [new EmbedBuilder().setTitle(`Command has expired`).setColor(`Red`)], components: []});
        });
    }
}