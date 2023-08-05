const { EmbedBuilder } = require("discord.js")

module.exports = (client, message, equipment) => {
    const embed = new EmbedBuilder()
    .setTitle(`Your equipment broke!`)
    .setDescription(`You have been using ${equipment.name} for too long and now it has been broken. Consider buying a new one`)
    .setColor(`Red`)

    message.channel.send({embeds: [embed]}).then(() => {
        client.equipments.delete(message.author.id, `${equipment.type}.value`);
        client.equipments.delete(message.author.id, `${equipment.type}.durability`);
    })
}