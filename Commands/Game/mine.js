const { EmbedBuilder } = require("discord.js");
const equipments = require(`../../JSON/equipments.json`);
const items = require(`../../JSON/items.json`);
const Chance = require(`chance`);
const chance = new Chance;
const NodeCache = require(`node-cache`);
const cache = new NodeCache();

module.exports = {
    name: 'mine',
    category: 'Game',
    description: 'so we back into the mine',
    aliases: [],
    syntax: 'mine',
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: async (client, message, args, prefix) => {
        if (cache.get(message.author.id)) {
            return void message.reply(`you are already mining, cant multitask lil bro`)
        }

        if (!client.equipments.has(message.author.id) || !client.equipments.has(message.author.id, 'Pickaxe.value')) {
            return void message.reply(`you dont have a pickaxe to mine`);
        }
        
        cache.set(message.author.id, message.channel.id);

        const pickaxe = client.equipments.get(message.author.id, 'Pickaxe.value');
        const lootTable = equipments[pickaxe].canOnlyMine;

        const loots = [];
        for (const reward of lootTable) {
            const looted = chance.natural({min: 0, max: reward.loot});

            if (looted) {
                loots.push({name: reward.name, loot: looted});
                client.items.ensure(message.author.id, reward.name, `${items[reward.name].name}.name`);
                client.items.ensure(message.author.id, 0, `${items[reward.name].name}.value`);
                client.items.math(message.author.id, '+', reward.loot, `${items[reward.name].name}.value`);
            }
        }

        const waitingEmbed = new EmbedBuilder()
        .setTitle(`Mining...`)
        .setColor(`Purple`);

        const msg = await message.reply({embeds: [waitingEmbed]})

        async function mine() {
            if (loots.length) {
                const hasLootEmbed = new EmbedBuilder()
                .setTitle(`You went to mining and found:`)
                .setDescription(loots.map(entry => `**${entry.name}** - ${entry.loot}`).join(`\n`))
                .setColor(`Green`);

                await msg.edit({embeds: [hasLootEmbed]});
            } else {
                const hasNoLootEmbed = new EmbedBuilder()
                .setTitle(`You went to mining and did not found anything...`)
                .setColor(`Red`);

                await msg.edit({embeds: [hasNoLootEmbed]});
            }
        }

        setTimeout(async () => {
            await mine();
            cache.del(message.author.id, message.channel.id);
        }, 3000);

        const durabilityCost = loots.map(entry => entry.loot).reduce((partialSum, a) => partialSum + a, 0);
        client.equipments.ensure(message.author.id, equipments[pickaxe].durability, `Pickaxe.durability`)
        client.equipments.math(message.author.id, '-', durabilityCost, `Pickaxe.durability`);

        if (client.equipments.get(message.author.id, `Pickaxe.durability`) <= 0) {
            require(`./helpers/invalidateEquipment.js`)(client, message, equipments[pickaxe]);
        }
    }
}