const items = require(`../../JSON/items.json`);
const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    name: 'sell',
    category: 'Game',
    description: 'Sell your items in exchange for currencies',
    aliases: [],
    syntax: 'sell <item> [amount]',
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: async (client, message, args, prefix) => {
        const inputAsArray = message.content.split(' ');
        const checkIfAmountIsSpecified = +inputAsArray[inputAsArray.length - 1] && +inputAsArray[inputAsArray.length - 1] > 0;
        const input = checkIfAmountIsSpecified ? inputAsArray.slice(1, -1).join(' ') : inputAsArray.slice(1).join(' ');
        if (!input) {
            return void message.reply(`specify an item`);
        }

        if (!items[input] && !Object.values(items).find(i => i.aliases && i.aliases.includes(input))) {
            return void message.reply(`that item does not exist`);
        }

        const item = items[input] || Object.values(items).find(i => i.aliases && i.aliases.includes(input));
        const amount = checkIfAmountIsSpecified ? +inputAsArray[inputAsArray.length - 1] : 1;

        const worth = item.worth;
        if (!worth) {
            return void message.reply(`that item isnt sellable`)
        }

        const bitcoinLeft = client.currencies.ensure(message.author.id, 0, 'Bitcoin.value');
        const amountLeft = client.items.ensure(message.author.id, 0, `${item.keyName}.value`);

        if (amountLeft < amount) {
            return void message.reply(`you dont have THAT many of items`)
        }

        const confirmationPromise = new Promise(async (resolve, reject) => {
            const confirmationEmbed = new EmbedBuilder()
            .setTitle(`Confirmation`)
            .setDescription(`You are going to sell ${amount} ${item.name}, which will give you ${worth * amount} bitcoin. Are you sure of this decision?`)
            .setColor(`Yellow`);
    
            const confirmationYes = new ButtonBuilder()
            .setCustomId(`Confirmation_Yes`)
            .setEmoji(`✅`)
            .setStyle(ButtonStyle.Success);
    
            const confirmationNo = new ButtonBuilder()
            .setCustomId(`Confirmation_No`)
            .setEmoji(`❌`)
            .setStyle(ButtonStyle.Danger);
    
            const confirmationActionRow = new ActionRowBuilder().addComponents([confirmationYes, confirmationNo]);
    
            const msg = await message.channel.send({embeds: [confirmationEmbed], components: [confirmationActionRow]});
    
            const confirmationFilter = i => i.user.id === message.author.id;
            const confirmationCollector = msg.createMessageComponentCollector({filter: confirmationFilter, max: 1, time: 60000});
    
            confirmationCollector.on('collect', i => {
                i.deferUpdate();
            })
    
            confirmationCollector.on('end', (collected) => {
                msg.delete();
                if (!collected.first() || collected.first().customId === 'Confirmation_No') {
                    return resolve(`NO`);
                }
                return resolve('YES');
            });
        });
    
        const confirm = await confirmationPromise;
        if (confirm === 'NO') {
            return;
        }
        
        const successEmbed = new EmbedBuilder()
        .setTitle(`Items sold!`)
        .setColor(`Green`)
        .setDescription(`You received ${amount * worth} bitcoin!`)

        message.reply({embeds: [successEmbed]}).then(() => {
            client.items.math(message.author.id, '-', amount, `${item.keyName}.value`);
            client.currencies.math(message.author.id, '+', amount * worth, `Bitcoin.value`);
        })
    }
} 