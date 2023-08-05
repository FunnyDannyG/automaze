const Chance = require('chance');
const { EmbedBuilder } = require('discord.js');
const chance = new Chance;
const ms = require('pretty-ms');

module.exports = {
    name: 'scour',
    category: 'Game',
    description: 'Scour through AI Hub and find something',
    aliases: [],
    syntax: 'scour',
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: (client, message, args, prefix) => {
        const cooldown = 600000;
        const cooldownCheck = client.scourCD.ensure(message.author.id, 0);

        if (cooldown - (Date.now() - cooldownCheck) > 0) {
            return void message.reply(`you are still on cooldown, you will be able to use scour again <t:${Math.round(cooldownCheck / 1000) + 600}:R>`);
        }
        
        const loots = [];
        const rngBitcoin = chance.natural({min: 10, max: 100});
        const rngExp = chance.natural({min: 10, max: 100});
        let rngSVC = chance.natural({min: 1, max: 100});
        let rngRIAA = chance.natural({min: 1, max: 100});

        if (rngSVC <= 20) {
            rngSVC = 1;
        } else {
            rngSVC = 0
        }

        if (rngRIAA <= 20) {
            rngRIAA = 1;
        } else {
            rngRIAA = 0
        }

        loots.push(...[{name: 'EXP', amount: rngExp}, {name: 'Bitcoin', amount: rngBitcoin}, {name: 'SVC Models', amount: rngSVC}, {name: 'RIAA Subpoenas', amount: rngRIAA}].filter(loot => !!loot.amount));

        client.currencies.ensure(message.author.id, 'Bitcoin', `Bitcoin.name`);
        client.currencies.ensure(message.author.id, 0, `Bitcoin.value`);
        client.currencies.math(message.author.id, 'add', rngBitcoin, `Bitcoin.value`);

        client.items.ensure(message.author.id, 'SVC Models', `SVC.name`);
        client.items.ensure(message.author.id, 0, `SVC.value`);
        client.items.math(message.author.id, 'add', rngSVC, `SVC.value`);

        client.items.ensure(message.author.id, 'RIAA Subpoenas', `RIAA.name`);
        client.items.ensure(message.author.id, 0, `RIAA.value`);
        client.items.math(message.author.id, 'add', rngRIAA, `RIAA.value`);

        client.exp.ensure(message.author.id, 0);
        client.exp.math(message.author.id, 'add', rngExp);

        client.scourCD.set(message.author.id, Date.now());

        let embed = new EmbedBuilder()
        .setTitle(`Congrats, you have found:`)
        .setColor(`Green`)
        .setAuthor({name: message.author.username, iconURL: message.author.avatarURL()})
        .setDescription(loots.map(loot => `**‣ ${loot.name}**: ${loot.amount}`).join(`\n`));

        message.reply({embeds: [embed]});
        require('./helpers/checkIfEnoughExp.js')(client, message, message.author)
    }
}