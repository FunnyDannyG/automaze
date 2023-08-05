const { EmbedBuilder } = require("discord.js");
const products = require(`../../../JSON/shop.json`);

const option = {
    label: `Excavation`,
    description: `Equipments and items related to mining and excavating`,
    value: `Excavation`
}

const embed = new EmbedBuilder()
.setTitle(`Excavation`)
.setDescription(Object.values(products).filter(product => product.category === 'Excavation').map(product => `### ${product.name} ➤ ${product.cost} B$\n${product.description}`).join(`\n`))
.setColor(`Green`);

module.exports = {
    option: option,
    embed: embed
}