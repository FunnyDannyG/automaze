const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'resolve',
    category: 'Utilities',
    description: 'Only usable by mods+. Approve of a suggestion thread and lock it.',
    aliases: ['approve'],
    syntax: 'resolve',
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

        message.channel.setLocked(true, `approved_${message.channel.id}`).then(thread => {
            const approvedEmbed = new EmbedBuilder()
            .setTitle(`This thread has been approved!`)
            .setColor(`Green`)
            .setDescription(`${message.author.username} has found the suggestion contributive and approved it. The suggestion is now being considered and is likely to be put into motion. This thread will be archived in 3 seconds.`);

            const DMEmbed = new EmbedBuilder()
            .setTitle(`Your thread has been approved!`)
            .setColor(`Green`)
            .setDescription(`${message.author.username} finds your suggestion to be useful. Your thread is now approved ${message.channel}`)

            thread.send({embeds: [approvedEmbed]});
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