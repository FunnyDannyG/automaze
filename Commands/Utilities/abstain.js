const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'abstain',
    category: 'Utilities',
    description: 'Only usable by mods+. Abstain from a suggestion thread and lock it.',
    aliases: [],
    syntax: 'abstain',
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: (client, message, args, prefix) => {
        if (!message.member.roles.cache.has('1128124686912454779')) {
            return void message.reply(`you aint a part of the suggestions qc`);
        }

        if (!message.channel.isThread()) {
            return void message.reply(`this isnt a thread channel`);
        }

        if (message.channel.parentId !== '1127426867767562270') {
            return void message.reply(`the thread does not belong to suggestion channel`);
        }

        if (message.channel.locked) {
            return void message.reply(`the thread already had a verdict`);
        }

        message.channel.setLocked(true, `abstain_${message.channel.id}`).then(thread => {
            const abstainedEmbed = new EmbedBuilder()
            .setTitle(`This thread has been locked!`)
            .setColor(`Grey`)
            .setDescription(`${message.author.username} is not sure of the suggestion and has decided to abstain from it. The suggestion is either a joke or is controversial and might be implemented or not depending on the staff team's discretion. This thread will be archived in 3 seconds.`)

            const DMEmbed = new EmbedBuilder()
            .setTitle(`Your thread has been locked!`)
            .setColor(`Grey`)
            .setDescription(`${message.author.username} is not sure of your suggestion. Your thread is now locked ${message.channel}`)

            thread.send({embeds: [abstainedEmbed]});
            thread.fetchOwner().then(threadMember => {
                message.delete()
                threadMember.user.send({embeds: [DMEmbed]}).catch(() => {})
            });
        });

        setTimeout(() => {
            message.channel.setArchived();
        }, 3000);
    }
}