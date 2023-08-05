const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'reject',
    category: 'Utilities',
    description: 'Only usable by mods+. Reject a suggestion thread and lock it.',
    aliases: [],
    syntax: 'reject',
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

        message.channel.setLocked(true, `rejected_${message.channel.id}`).then(thread => {
            const rejectedEmbed = new EmbedBuilder()
            .setTitle(`This thread has been rejected!`)
            .setColor(`Red`)
            .setDescription(`${message.author.username} has found the suggestion improper and decided not to follow. The suggestion is now locked. This thread will be archived in 3 seconds.`)

            const DMEmbed = new EmbedBuilder()
            .setTitle(`Your thread has been rejected!`)
            .setColor(`Red`)
            .setDescription(`${message.author.username} finds your suggestion to be improper. Your thread is now rejected ${message.channel}`)

            thread.send({embeds: [rejectedEmbed]});
            thread.fetchOwner().then(threadMember => {
                message.delete();
                threadMember.user.send({embeds: [DMEmbed]}).catch(() => {})
            });
        });

        setTimeout(() => {
            message.channel.setArchived();
        }, 3000);
    }
}