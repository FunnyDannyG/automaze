const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const products = require(`../../JSON/shop.json`)

module.exports = {
    name: 'buy',
    category: 'Game',
    description: 'Buy an item from the merchants',
    aliases: [],
    syntax: `buy <item> [amount]`,
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
            return void message.reply(`specify a product`);
        }

        if (!products[input] && !Object.values(products).find(i => i.aliases && i.aliases.includes(input))) {
            return void message.reply(`that product does not exist`);
        }

        const product = products[input] || Object.values(products).find(i => i.aliases && i.aliases.includes(input));
        const amount = checkIfAmountIsSpecified ? +inputAsArray[inputAsArray.length - 1] : 1;
        const cost = product.cost

        const confirmationPromise = new Promise(async (resolve, reject) => {
            const confirmationEmbed = new EmbedBuilder()
            .setTitle(`Confirmation`)
            .setDescription(`You are going to buy ${amount} ${product.name}, which will cost you ${cost * amount} bitcoin. Are you sure of this decision?`)
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

        const bitcoin = client.currencies.ensure(message.author.id, 0, 'Bitcoin.value');

        const notEnoughMoneyEmbed = new EmbedBuilder()
        .setTitle(`Not enough bitcoin`)
        .setDescription(`You do not have enough bitcoin. You currently only has ${bitcoin} bitcoin.`)
        .setColor(`Red`)

        if (bitcoin < amount * cost) {
            return void message.reply({embeds: [notEnoughMoneyEmbed]});
        }

        const successEmbed = new EmbedBuilder()
        .setTitle(`Products purchased!`)
        .setDescription(`Transaction was success!`)
        .setColor(`Green`);

        message.reply({embeds: [successEmbed]}).then(() => {
            client.items.set(message.author.id, product.name, `${product.keyName}.name`);
            client.items.ensure(message.author.id, 0, `${product.keyName}.value`);
            client.items.math(message.author.id, '+', amount, `${product.keyName}.value`);
            client.currencies.math(message.author.id, '-', amount * cost, `Bitcoin.value`);
        })
    }
}