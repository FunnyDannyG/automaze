const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const models = require(`../../JSON/fight_characters.json`);
const Chance = require(`chance`);
const chance = new Chance;

module.exports = {
    name: 'train',
    category: 'Game',
    description: 'Train your model to a higher epoch, increasing their stats in battle',
    aliases: [],
    syntax: 'train',
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: async (client, message, args, prefix) => {
        if (!client.models.has(message.author.id)) {
            return void message.reply(`you dont have a model to train lmfaooo`);
        }

        const model = client.models.get(message.author.id);
        const epoch = client.epochs.ensure(message.author.id, 0) + 10;

        if (epoch > 1000) {
            return void message.reply(`Your model is already at max epoch, you are already on top of the world.`)
        }
        
        const confirmationPromise = new Promise(async (resolve, reject) => {
            const confirmationEmbed = new EmbedBuilder()
            .setTitle(`Confirmation`)
            .setDescription(`You are going to train **${models[model].name}** to **epoch ${epoch}**, which will cost **${epoch * 10} bitcoin** and have a **${epoch / 10}%** chance to fail! Are you sure of this decision?`)
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

        const rejectedEmbed = new EmbedBuilder()
        .setTitle(`Rejected`)
        .setColor(`Red`);

        const bitcoin = client.currencies.ensure(message.author.id, 0, 'Bitcoin.value');

        if (bitcoin < epoch * 10) {
            return void message.reply({embeds: [rejectedEmbed.setDescription(`You do not have enough bitcoin. You currently only has ${bitcoin} bitcoin.`)]});
        }

        const waitingEmbed = new EmbedBuilder()
        .setTitle(`Training is in session...`)
        .setColor(`Purple`);

        const m = await message.reply({embeds: [waitingEmbed]});

        function training() {
            const pool = chance.natural({min: 1, max: 100});

            client.currencies.math(message.author.id, '-', epoch * 10, 'Bitcoin.value');

            if (pool <= epoch / 10) {
                return void m.edit({embeds: [rejectedEmbed.setDescription(`Your GPU wasn't strong enough to support your model training session. Your model's training **failed**.`)]});
            }

            client.epochs.math(message.author.id, '+', 10);
            const successEmbed = new EmbedBuilder()
            .setTitle(`Success!`)
            .setDescription(`Your training succeeded! Your model is currently at epoch ${epoch}.`)
            .setColor(`Green`);

            m.edit({embeds: [successEmbed]})
        }

        setTimeout(() => {
            training()
        }, 5000)
    }
}