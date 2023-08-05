const { EmbedBuilder } = require("discord.js");
const Chance = require(`chance`);
const chance = new Chance;

module.exports = {
    name: '8ball',
    category: 'Fun',
    description: 'Answer questions of your life',
    aliases: [`8balls`],
    syntax: `8ball`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: async (client, message, args, prefix) => {
        const affirmativeResponses = [`It is certain.`, `It is decidedly so.`, `Without a doubt.`, `Yes definitely.`, `You may rely on it.`, `As I see it, yes.`, `Most likely.`, `Outlook good.`, `Yes.`, `Signs point to yes.`];
        const noncommittalResponses = [`Reply hazy, try again.`, `Ask again later.`, `Better not tell you now.`, `Cannot predict now.`, `Concentrate and ask again.`];
        const negativeResponses = [`Don't count on it.`, `My reply is no.`, `My sources say no.`, `Outlook not so good.`, `Very doubtful.`];

        const percent = chance.natural({min: 1, max: 100});
        let response;

        if (percent <= 50) {
            response = [affirmativeResponses[Math.floor(Math.random() * affirmativeResponses.length)], `Green`];
        } else if (percent > 50 && percent <= 75) {
            response = [noncommittalResponses[Math.floor(Math.random() * noncommittalResponses.length)], `Yellow`];
        } else {
            response = [negativeResponses[Math.floor(Math.random() * negativeResponses.length)], `Red`];
        }

        function percentToBar(percentile) {
            const filled = Math.floor(percentile / 10);
            const bar = [`*[*`, Array(filled).fill(`▰`), Array(10 - filled).fill(`▱`), `*]*`].flat();
            return bar.join(``);
        }

        const question = message.content.split(' ').slice(1).join(' ')

        const loadingEmbed = new EmbedBuilder()
        .setTitle(`🎱 predicting the future... 🎱`)
        .setColor(`DarkButNotBlack`);

        const msg = await message.reply({embeds: [loadingEmbed]});

        setTimeout(() => {
            msg.edit({embeds: [new EmbedBuilder().setTitle(question).setColor(response[1]).setDescription(`## ${response[0]}\n# ${percentToBar(100 - percent)} - ${100 - percent}% possible`)]});
        }, 3000);
    }
}