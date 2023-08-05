const itemsData = require(`../../JSON/items.json`)

module.exports = {
    name: 'use',
    category: 'Game',
    description: 'Use an item from your inventory',
    aliases: [],
    syntax: 'use <item>',
    run: async (client, message, args, prefix) => {
        let item = message.content.split(' ').slice(1).join(' ')
        const usableItems = Object.values(itemsData).map(i => i.aliases.map(h => h.toLowerCase())).flat()
        if (!item) {
            return void message.reply(`specify an item`)
        }
        item = item.toLowerCase()

        if (!usableItems.includes(item)) {
            return void message.reply(`the item does not exist you pendejo`)
        }

        switch (item) {
            case `svc`:
            case `svc model`:
            case `svc models`:
                const svc = client.use.get('svc');
                svc.run(client, message, args, prefix);
                break;

            case `riaa`:
            case `riaa subpoena`:
            case `riaa subpoenas`:
                const riaa = client.use.get('riaa');
                await riaa.run(client, message, args, prefix)

            default:
                message.reply(`that item is not usable...for now.`)
        }
    }
}