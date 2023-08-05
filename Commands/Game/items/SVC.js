const { EmbedBuilder } = require("discord.js");
const models = require(`../../../JSON/fight_characters.json`)

function useSVCModels(client, message, args, prefix) {
    client.items.ensure(message.author.id, `SVC Models`, `SVC.name`)
    const svc = client.items.ensure(message.author.id, 0, 'SVC.value');
    if (!svc) {
        return void message.reply(`You do not own an SVC model`);
    }

    if (client.models.has(message.author.id)) {
        return void message.reply(`You already have a model. Use RIAA to remove it.`);
    }

    const rollChance = {}
    for (const model of Object.keys(models)) {
        rollChance[model] = models[model].chance;
    }

    const rollPool = Object.entries(rollChance).flatMap(([key, value]) => Array(value).fill(key));
    const result = rollPool[Math.floor(Math.random() * rollPool.length)];

    const embed = new EmbedBuilder()
    .setTitle(`You used an SVC model and got ${models[result].name}`)
    .setColor(`Green`)
    .setDescription(models[result].description)
    .setImage(models[result].image);

    message.reply({embeds: [embed]}).then(() => {
        client.models.set(message.author.id, result);
        client.items.dec(message.author.id, 'SVC.value');
    })
}

module.exports = {
    name: 'svc',
    run: useSVCModels
}