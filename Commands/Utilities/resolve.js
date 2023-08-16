const { EmbedBuilder } = require("discord.js");

const prodIds = {
    role: {
        'admin': '1090743458320363711',
        'mod': '1091189761001128018',
        'suggestionsQC': '1128124686912454779',
    },
    channel: {
        'suggestions': '1127426867767562270',
        'tasks': '1139248461070467243',
    }
}

/*
const devIds = {
    role: {
        'mod': '1136973273540861974',
        'suggestionsQC': '1141358227112611870',
    },
    channel: {
        'suggestions': '1140188211818266704',
        'tasks': '1141020043258376214',
    }
}
*/

const channelIds = Object.values(prodIds.channel);
const roleIds = Object.values(prodIds.role)

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
    run: async (client, message, args, prefix) => {
        if (!message.channel.isThread()) return;

        // check if it is an allowed channel
        if (!channelIds.includes(message.channel.parentId)) return;

        // check if user has at least one appropriate role
        const userRoles = message.member.roles.cache;

        for (const roleId of roleIds) {
            if (userRoles.has(roleId)) {
                // check if thread is already locked
                if (message.channel.locked) return await message.reply(`This thread already have been locked.`);
    
                message.channel.setLocked(true, `approved_${message.channel.id}`).then(async thread => {
                    const approvedEmbed = new EmbedBuilder()
                        .setTitle(`This thread has been approved!`)
                        .setColor(`Green`)
                        .setDescription(`${message.author.username} has found the suggestion contributive and approved it. The suggestion is now being considered and is likely to be put into motion. This thread will be archived in 3 seconds.`);

                    const DMEmbed = new EmbedBuilder()
                        .setTitle(`Your thread has been approved!`)
                        .setColor(`Green`)
                        .setDescription(`${message.author.username} finds your suggestion to be useful. Your thread is now approved ${message.channel}`);

                    await thread.send({ embeds: [approvedEmbed] });
                    await thread.fetchOwner().then(async threadMember => {
                        await message.delete()
                        await threadMember.user.send({ embeds: [DMEmbed] }).catch(() => { })
                    });

                    setTimeout(() => {
                        message.channel.setArchived();
                    }, 3000);
                });
                return;
            }
        }

        // otherwise don't do an action on the thread
        return await message.reply('You are not allowed to perform this action.');
    }
}
