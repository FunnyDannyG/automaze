const { EmbedBuilder } = require("discord.js");
const equipments = require(`../../JSON/equipments.json`)

module.exports = {
    name: 'equipments',
    category: 'Game',
    description: 'Game',
    aliases: ['eqs'],
    syntax: `equipments [member]`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: async (client, message, args, prefix) => {
        const member = message.mentions.members.first() || message.member;
        let description = [];
        
        client.equipments.ensure(member.user.id, {
            Pickaxe: {
                name: 'Pickaxe'
            }
        });

        description.push(Object.values(client.equipments.get(member.user.id)).map(entry => `**${entry.name}  ➤ ** ${!entry.value ? `None :(` : `${equipments[entry.value].name} (${entry.durability}/${equipments[entry.value].durability})`}`));

        const embed = new EmbedBuilder()
        .setTitle(`Equipments`)
        .setAuthor({name: member.user.username, iconURL: member.user.avatarURL()})
        .setDescription(description.join(`\n`))
        .setColor(`Green`);

        message.reply({embeds: [embed]});
    }
}