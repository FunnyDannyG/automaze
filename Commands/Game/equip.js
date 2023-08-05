const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const items = require(`../../JSON/items.json`)
const equipments = require(`../../JSON/equipments.json`)

module.exports = {
    name: 'equip',
    category: 'Game',
    description: 'Equip equippables such as armors',
    aliases: ['eq'],
    syntax: `equip <item>`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: async (client, message, args, prefix) => {
        const input = message.content.split(' ').slice(1).join(' ');

        if (!input) {
            return void message.reply(`specify an item`);
        }

        if (!items[input] && !Object.values(items).find(i => i.aliases && i.aliases.includes(input))) {
            return void message.reply(`that item does not exist`);
        }

        const item = items[input] || Object.values(items).find(i => i.aliases && i.aliases.includes(input));
        if (!item.equippable) {
            return void message.reply(`the item is not equippable`);
        }

        client.items.ensure(message.author.id, 0, `${item.keyName}.name`);
        
        if (!client.items.ensure(message.author.id, 0, `${item.keyName}.value`)) {
            return void message.reply(`you dont have this equipment`)
        }

        const confirmationPromise = new Promise(async (resolve, reject) => {
            const confirmationEmbed = new EmbedBuilder()
            .setTitle(`Confirmation`)
            .setDescription(`You are going to equip ${item.name}. This action is irreversible and make the item be discarded upon unequip. Are you sure of this decision?`)
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

        const slot = client.equipments.ensure(message.author.id, {
            Pickaxe: {
                name: 'Pickaxe'
            }
        });
        
        if (slot[item.type].value) {
            return void message.reply(`there is already an item equipped in this slot, unequip it first`);
        }

        const successEmbed = new EmbedBuilder()
        .setTitle(`Item equipped`)
        .setColor(`Green`)
        .setDescription(`${item.name} has been equipped to your ${item.type} slot!`);

        message.reply({embeds: [successEmbed]}).then(() => {
            client.equipments.set(message.author.id, item.keyName, `${item.type}.value`);
            client.equipments.set(message.author.id, equipments[item.keyName].durability, `${item.type}.durability`);
            client.items.dec(message.author.id, `${item.keyName}.value`);
        })
    }
}