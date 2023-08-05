const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const equipments = require(`../../JSON/equipments.json`)

module.exports = {
    name: 'unequip',
    category: 'Game',
    description: 'Unequip equippables such as armors',
    aliases: ['ueq'],
    syntax: `unequip <item>`,
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
            return void message.reply(`specify an equipment`);
        }

        if (!equipments[input] && !Object.values(equipments).find(i => i.aliases && i.aliases.includes(input))) {
            return void message.reply(`that equipment does not exist`);
        }

        const equipment = equipments[input] || Object.values(equipments).find(i => i.aliases && i.aliases.includes(input));

        if (!client.equipments.has(message.author.id, `${equipment.type}.value`)) {
            return void message.reply(`you dont have anything equipped in this slot`);
        }

        if (client.equipments.get(message.author.id, `${equipment.type}.value`) !== equipment.keyName) {
            return void message.reply(`you dont have this equipped in the first place`)
        }

        const confirmationPromise = new Promise(async (resolve, reject) => {
            const confirmationEmbed = new EmbedBuilder()
            .setTitle(`Confirmation`)
            .setDescription(`You are going to unequip ${equipment.name}, which will delete the equipment entirely. Are you sure of this decision?`)
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
        .setTitle(`Item equipped`)
        .setColor(`Green`)
        .setDescription(`${equipment.name} has been unequipped from your ${equipment.type} slot!`)

        message.reply({embeds: [successEmbed]}).then(() => {
            client.items.ensure(message.author.id, equipment.name, `${equipment.keyName}.name`);
            client.items.ensure(message.author.id, 0, `${equipment.keyName}.value`);
            client.equipments.delete(message.author.id, `${equipment.type}.value`);
            client.equipments.delete(message.author.id, `${equipment.type}.durability`);
        })
    }
}