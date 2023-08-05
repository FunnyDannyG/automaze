const { EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder } = require("discord.js");
const help = require(`../../JSON/help.json`)

module.exports = {
    name: 'help',
    category: 'Info',
    description: 'Provides all commands of the bot',
    aliases: [],
    syntax: `help`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: async (client, message, args, prefix) => {
        const categories = [...new Set(client.commands.map(command => command.category))];

        const placeholderEmbed = new EmbedBuilder()
        .setTitle(`Please choose a category`)
        .setColor(`Yellow`);

        const options = new StringSelectMenuBuilder()
        .setCustomId(`dropdown`)
        .setPlaceholder(`Nothing selected`);

        for (const category of categories) {
            options.addOptions(
                {
                    label: category,
                    description: help[category],
                    value: category
                }
            );
        }

        const dropdownActionRow = new ActionRowBuilder().addComponents(options);
        const reply = await message.reply({embeds: [placeholderEmbed], components: [dropdownActionRow]});

        const filter = i => i.customId === 'dropdown' && i.user.id === message.author.id;
        const collector = reply.createMessageComponentCollector({filter, time: 60000});

        collector.on('collect', i => {
            i.update({embeds: [
                new EmbedBuilder()
                .setTitle(`${i.values[0]} commands`)
                .setDescription(client.commands.filter(command => command.category === i.values[0]).map(command => (command.aliases.length ? `**‣ \`${prefix}${command.syntax}\` || \`${command.aliases.join(`, `)}\`** - ${command.description}` : `**‣ \`${prefix}${command.syntax}\`** - ${command.description}`)).join(`\n`))
                .setColor(`Green`)
                .setFooter({text: `Parameters in <...> are required, whereas [...] is optional`})
            ]});
        });

        collector.on(`end`, () => {
            reply.edit({embeds: [new EmbedBuilder().setTitle(`Command has expired`).setColor(`Red`)], components: []});
        });
    }
}