const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

async function useRIAA(client, message, args, prefix) {
    client.items.ensure(message.author.id, `RIAA Subpoenas`, `RIAA.name`);
    const riaa = client.items.ensure(message.author.id, 0, 'RIAA.value');
    if (!riaa) {
        return void message.reply(`You do not have an RIAA subpoena`);
    }

    if (!client.models.has(message.author.id)) {
        return void message.reply(`You don't have a model in the first place`);
    }

    const confirmationPromise = new Promise(async (resolve, reject) => {
        const confirmationEmbed = new EmbedBuilder()
        .setTitle(`Confirmation`)
        .setDescription(`You are going to use an RIAA subpoena, which will delete your model and reset your epoch. Are you sure of this decision?`)
        .setColor(`Yellow`);

        const confirmationYes = new ButtonBuilder()
        .setCustomId(`Confirmation_Yes`)
        .setEmoji(`✅`)
        .setStyle(ButtonStyle.Success);

        const confirmationNo = new ButtonBuilder()
        .setCustomId(`Confirmation_No`)
        .setEmoji(`❌`)
        .setStyle(ButtonStyle.Danger);

        const confirmationActionRow = new ActionRowBuilder().addComponents([confirmationYes, confirmationNo]);

        const msg = await message.channel.send({embeds: [confirmationEmbed], components: [confirmationActionRow]});

        const confirmationFilter = i => i.user.id === message.author.id;
        const confirmationCollector = msg.createMessageComponentCollector({filter: confirmationFilter, max: 1, time: 60000});

        confirmationCollector.on('collect', i => {
            i.deferUpdate();
        })

        confirmationCollector.on('end', (collected) => {
            msg.delete();
            if (!collected.first() || collected.first().customId === 'Confirmation_No') {
                return resolve(`NO`);
            }
            return resolve('YES');
        });
    });

    const confirm = await confirmationPromise;
    if (confirm === 'NO') {
        return;
    }

    const embed = new EmbedBuilder()
    .setTitle(`You've got a mail!`)
    .setDescription(`Hello, I am contacting you on behalf of the Recording Industry Association of America, Inc. (RIAA) and its member record companies. The RIAA is a trade association whose member companies create, manufacture, and distribute approximately the majority of all legitimate sound recordings sold in the United States. We have learned that Discord is operating and/or hosting the below-referenced Discord server(s) on its network. This server(s) is/are dedicated to infringing our members' copyrighted sound recordings by offering, selling, linking to, hosting, streaming, and/or distributing files containing our members' sound recordings without authorization. We have a good faith belief that this activity is not authorized by the copyright owner, its agent, or the law. We assert that the information in this notification is accurate, based upon the data available to us. We are asking for your immediate assistance in stopping this unauthorized activity. **Your model has been removed.**`)
    .setColor(`Red`)
    .setImage(`https://cdn.discordapp.com/attachments/846434026813784104/1121091460171841536/image.png`);

    message.reply({embeds: [embed]}).then(() => {
        client.models.delete(message.author.id);
        client.items.dec(message.author.id, 'RIAA.value')
        client.epochs.delete(message.author.id)
    })
}

module.exports = {
    name: 'riaa',
    run: useRIAA
}