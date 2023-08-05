const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'hangman',
    category: 'Game',
    description: 'Bet an amount of bitcoins and play a game of hangman',
    aliases: [],
    syntax: `hangman <money>`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: async (client, message, args, prefix) => {
        const input = args[0];
        if (!+input || +input <= 0) {
            return void message.reply(`provide a valid amount of money`);
        }

        const bet = +input;
        const bitcoinLeft = client.currencies.ensure(message.author.id, 0, 'Bitcoin.value');

        if (bitcoinLeft < bet) {
            return void message.reply(`you dont have THAT much money`);
        }

        client.currencies.math(message.author.id, '-', bet, 'Bitcoin.value');

        const word = (await import('random-words')).generate();
        const phases = [
            `https://cdn.discordapp.com/attachments/1119796145036738652/1131969851053834331/image.png`,
            `https://cdn.discordapp.com/attachments/1119796145036738652/1131969945387929721/image.png`,
            `https://cdn.discordapp.com/attachments/1119796145036738652/1131970021938180096/image.png`,
            `https://cdn.discordapp.com/attachments/1119796145036738652/1131970080855572632/image.png`,
            `https://cdn.discordapp.com/attachments/1119796145036738652/1131970139726807050/image.png`,
            `https://cdn.discordapp.com/attachments/1119796145036738652/1131970198983933962/image.png`,
            `https://cdn.discordapp.com/attachments/1119796145036738652/1131970247679803492/image.png`
        ]

        let currentGuess = Array(word.length).fill(`_`);
        let used = [];
        let failedAttempt = 0;

        let description = `## \`${currentGuess.join(' ')}\`\n### Guessed: ${used.join(', ')}\n- Type out a letter to guess\n- You have 30 seconds to reply. If the timer is up, you automatically lose`

        const guiEmbed = new EmbedBuilder()
        .setTitle(`Hangman`)
        .setDescription(description)
        .setColor(`Yellow`)
        .setImage(phases[failedAttempt]);

        const gui = await message.reply({embeds: [guiEmbed]});

        const filter = msg => msg.author.id === message.author.id && msg.content.length === 1 && !used.includes(msg.content.toLowerCase());
        const collector = message.channel.createMessageCollector({filter, idle: 30000});

        collector.on('collect', async msg => {
            function updateGuess(letter) {
                used.push(letter);
    
                for (let index = 0; index < word.length; index++) {
                    if (word[index] === letter) {
                        currentGuess[index] = letter;
                    }
                }
    
                return currentGuess;
            }
    
            function updateDescription(letter) {
                return `## \`${updateGuess(letter).join(' ')}\`\n### Guessed: ${used.join(', ')}\n- Type out a letter to guess\n- You have 30 seconds to reply. If the timer is up, you automatically lose`;
            }
    
            function updateGUI(letter) {
                gui.edit({embeds: [EmbedBuilder.from(guiEmbed).setDescription(updateDescription(letter)).setImage(phases[failedAttempt])]});
            }

            if (word.includes(msg.content.toLowerCase())) {
                updateGUI(msg.content.toLowerCase())
            } else {
                failedAttempt++;
                updateGUI(msg.content.toLowerCase())
            }

            await msg.delete()

            if (failedAttempt === 6) {
                return collector.stop('fail');
            }

            if (word === currentGuess.join('')) {
                return collector.stop('success')
            }
        });

        collector.on('end', (coll, r) => {
            gui.delete();
            switch (r) {
                case 'idle':
                case 'fail':
                    const failEmbed = new EmbedBuilder()
                    .setTitle(`You lost!`)
                    .setColor(`Red`)
                    .setDescription(`The word was \`${word}\`. You lost ${bet} bitcoin.`);

                    message.channel.send({embeds: [failEmbed]});
                    break;

                case 'success':
                    const successEmbed = new EmbedBuilder()
                    .setTitle(`You won! You have received ${bet} bitcoin`)
                    .setColor(`Green`)

                    client.currencies.math(message.author.id, '+', bet * 2, 'Bitcoin.value');
                    message.channel.send({embeds: [successEmbed]});
                    break;
            }
        });
    }
}