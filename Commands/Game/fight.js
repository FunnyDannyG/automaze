const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const NodeCache = require(`node-cache`);
const characters = require(`../../JSON/fight_characters.json`);
const Chance = require('chance');
const chance = new Chance;
const cache = new NodeCache();
const requestCache = new NodeCache();

module.exports = {
    name: 'fight',
    category: 'Game',
    description: 'Fight someone and reap their soul',
    aliases: [],
    syntax: `fight <member>`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: async (client, message, args, prefix) => {
        const member = message.mentions.members.first();

        if (!member) {
            return void message.reply(`specify someone to fight`);
        }

        if (member.user.id === message.author.id) {
            return void message.reply(`you cant fight yoself are you retracted`);
        }

        if (cache.get(message.channel.id)) {
            return void message.reply(`there is already an ongoing fight in this channel`);
        }

        if (member.user.bot) {
            return void message.reply(`bro is so skill issue he needs to fight an npc 💀`);
        }

        if (!client.models.has(message.author.id)) {
            return void message.reply(`you dont have a model to fight with. get an svc-tiered model via \`${prefix}use svc\``);
        }

        if (!client.models.has(member.user.id)) {
            return void message.reply(`the opponent doesnt have a model to fight with are you a bully`);
        }

        if (requestCache.get(message.channel.id)) {
            return void message.reply(`there is already a request sent in this channel`);
        }

        requestCache.set(message.channel.id, message.author.id);

        const confirmationPromise = new Promise(async (resolve, reject) => {
            const confirmationEmbed = new EmbedBuilder()
                .setTitle(`Confirmation`)
                .setDescription(`Hey ${member}, ${message.author} is requesting to engage in a fight with you! Do you accept or nah`)
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

            const msg = await message.channel.send({ embeds: [confirmationEmbed], components: [confirmationActionRow] });

            const confirmationFilter = i => i.user.id === member.user.id;
            const confirmationCollector = msg.createMessageComponentCollector({ filter: confirmationFilter, max: 1, time: 60000 });

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
        requestCache.del(message.channel.id);
        if (confirm === 'NO') {
            return;
        }

        cache.set(message.channel.id, message.author.id);

        let description = [];
        let victor, loser;

        class Player {
            constructor(user) {
                this.user = user;
                this.level = client.levels.ensure(user.id, 1);
                this.epoch = client.epochs.ensure(user.id, 0)

                this.model = client.models.get(user.id);
                this.stats = characters[this.model].stats;
                this.skillsSet = characters[this.model].skills;

                this.health = 1000 + (Math.round(this.stats.health * ((this.level + 4) / 5) + this.epoch));
                this.attack = Math.round(this.stats.attack * ((this.level + 4) / 5) + this.epoch / 5);
                this.stamina = this.stats.stamina + this.epoch / 10;
                this.precision = this.stats.precision + this.epoch / 10;

                this.healthLeft = this.health;
                this.staminaLeft = this.stamina;

                this.defendStatus = 0;
                this.healthAffectMultiplier = 1;
                this.staminaAffectMultiplier = 1;

                this.effects = [];
                this.cooldown = [0, 0, 0, 0, 0]
            }

            constructSkillsGUI() {
                const actionRow = new ActionRowBuilder()

                for (const skill of Object.keys(this.skillsSet)) {
                    const skillButton = new ButtonBuilder()
                        .setCustomId(`GUI_Skills_Player_${skill}`)
                        .setLabel(`${this.skillsSet[skill].name} - ${this.skillsSet[skill].staminaCost}`)
                        .setStyle(ButtonStyle.Secondary);

                    actionRow.addComponents(skillButton);
                }

                this.skillsGUI = actionRow;
                return this;
            }

            affectHealth(player, damage) {
                if (player.healthLeft - damage < 0) {
                    player.healthLeft = 0;
                } else if (player.healthLeft - damage > player.health) {
                    player.healthLeft = player.health;
                } else {
                    player.healthLeft -= damage;
                }

                return player;
            }

            affectStamina(player, stamina) {
                if (player.staminaLeft - stamina < 0) {
                    player.staminaLeft = 0;
                } else if (player.staminaLeft - stamina > player.stamina) {
                    player.staminaLeft = player.stamina;
                } else {
                    player.staminaLeft -= stamina;
                }

                return player;
            }

            resetAllMultipliers() {
                this.healthAffectMultiplier = 1;
                this.staminaAffectMultiplier = 1;

                return this;
            }

            updateDefendStatus() {
                this.defendStatus -= 1;
                return this;
            }

            updateHealthAffectMultiplier(multiplier) {
                this.healthAffectMultiplier *= multiplier;
                return this;
            }

            updateStaminaAffectMultiplier(multiplier) {
                this.staminaAffectMultiplier *= multiplier;
                return this;
            }

            attackPlayer(offender, victim, damage, skill, crit) {
                this.affectHealth(victim, Math.round(damage * victim.healthAffectMultiplier));

                if (!crit) {
                    description.push(`‣ **${offender.user.username}** used **${offender.skillsSet[skill].name}**! **${offender.user.username}** dealt **${Math.round(damage * victim.healthAffectMultiplier)} damage** to ${victim.user.username}`);

                    return this;
                }

                description.push(`‣ **${offender.user.username}** used **${offender.skillsSet[skill].name}**! It was a critical attack! **${offender.user.username}** dealt **${Math.round(damage * victim.healthAffectMultiplier)} damage** to ${victim.user.username}`);

                return this;
            }

            defend() {
                this.defendStatus = 2;
                return this;
            }
        }

        const ally = new Player(message.author);
        const enemy = new Player(member.user);

        ally.constructSkillsGUI();
        enemy.constructSkillsGUI();

        function percentToBar(percentile) {
            const filled = Math.floor(percentile / 10);
            const bar = [`*[*`, Array(filled).fill(`▰`), Array(10 - filled).fill(`▱`), `*]*`].flat();
            return bar.join(``);
        }

        let fields = [
            {
                name: `${message.author.username} STATS`,
                value: `**HP**: ${percentToBar(ally.healthLeft / ally.health * 100)} ${ally.healthLeft}/${ally.health}\n**STA**: ${percentToBar(ally.staminaLeft / ally.stamina * 100)} ${ally.staminaLeft}/${ally.stamina}\n**CD**: [ ${ally.cooldown.join(' - ')} ]`,
                inline: true
            },
            {
                name: `${member.user.username} STATS`,
                value: `**HP**: ${percentToBar(enemy.healthLeft / enemy.health * 100)} ${enemy.healthLeft}/${enemy.health}\n**STA**: ${percentToBar(enemy.staminaLeft / enemy.stamina * 100)} ${enemy.staminaLeft}/${enemy.stamina}\n**CD**: [ ${enemy.cooldown.join(' - ')} ]`,
                inline: true
            }
        ];

        let turn = ally.stamina > enemy.stamina ? [ally, enemy] : [enemy, ally];

        function updateSTATS() {
            fields = [
                {
                    name: `${message.author.username} STATS`,
                    value: `**HP**: ${percentToBar(ally.healthLeft / ally.health * 100)} ${ally.healthLeft}/${ally.health}\n**STA**: ${percentToBar(ally.staminaLeft / ally.stamina * 100)} ${ally.staminaLeft}/${ally.stamina}\n**CD**: [ ${ally.cooldown.join(' - ')} ]`,
                    inline: true
                },
                {
                    name: `${member.user.username} STATS`,
                    value: `**HP**: ${percentToBar(enemy.healthLeft / enemy.health * 100)} ${enemy.healthLeft}/${enemy.health}\n**STA**: ${percentToBar(enemy.staminaLeft / enemy.stamina * 100)} ${enemy.staminaLeft}/${enemy.stamina}\n**CD**: [ ${enemy.cooldown.join(' - ')} ]`,
                    inline: true
                }
            ];

            ally.updateDefendStatus();
            enemy.updateDefendStatus();
        }

        function checkIfUsable(player) {
            player.skillsGUI.components.forEach(skillButton => {
                const m = skillButton.data.custom_id.split(`_`).slice(3).join(`_`);
                const mPos = Object.keys(turn[0].skillsSet).indexOf(m);
                if (player.skillsSet[m].staminaCost > player.staminaLeft || player.cooldown[mPos] > 0) {
                    skillButton.setDisabled();
                    return;
                }

                skillButton.setDisabled(false);
            });
        }

        function consumeStamina(skill) {
            turn[1].affectStamina(turn[1], turn[1].skillsSet[skill].staminaCost);
        }

        function checkWin(collector) {
            if (turn[0].healthLeft <= 0 && turn[1].healthLeft <= 0) {
                collector.stop('draw');
                return;
            }

            if (turn[1].healthLeft <= 0) {
                victor = turn[0];
                loser = turn[1]
                collector.stop();
                return;
            }

            if (turn[0].healthLeft <= 0) {
                victor = turn[1];
                loser = turn[0]
                collector.stop();
                return;
            }
        }

        function takeTurn() {
            turn.push(turn.shift());
        }

        function applyCooldown(move) {
            const position = Object.keys(turn[1].skillsSet).indexOf(move);
            turn[1].cooldown[position] = turn[1].skillsSet[move].cooldown
        }

        function decrementCooldown() {
            turn[1].cooldown.map((e, i) => e !== 0 ? turn[1].cooldown[i]-- : e);
        }

        const embed = new EmbedBuilder()
            .setTitle(`${message.author.username} ⚡ ${member.user.username}`)
            .setColor('Yellow')
            .setDescription(`‣ **The battle has commenced!**\n‣ It is **${turn[0].user.username}** turn!`)
            .setFields(fields);

        const defendButton = new ButtonBuilder()
            .setCustomId(`GUI_Options_Defend`)
            .setLabel(`Defend`)
            .setStyle(ButtonStyle.Secondary);

        const surrenderButton = new ButtonBuilder()
            .setCustomId(`GUI_Options_Surrender`)
            .setLabel(`Surrender`)
            .setStyle(ButtonStyle.Danger);

        const optionsGUI = new ActionRowBuilder().addComponents([defendButton, surrenderButton]);

        updateSTATS();

        const battle = await message.channel.send({ embeds: [embed], components: [turn[0].skillsGUI, optionsGUI] });

        const filter = i => i.customId.startsWith(`GUI`) && [message.author, member.user].includes(i.user);
        const collector = battle.createMessageComponentCollector({ filter, idle: 60000 });

        collector.on('collect', async i => {
            let crit = false;
            const skill = i.customId.split(`_`).slice(3).join(`_`);
            let dealt = turn[1].defendStatus === 1 ? Math.round(turn[0].skillsSet[skill]?.damage * turn[0].attack * 50 / 100 * turn[1].healthAffectMultiplier) : Math.round(turn[0].skillsSet[skill]?.damage * turn[0].attack * turn[1].healthAffectMultiplier);
            const healed = chance.natural({ min: 10, max: 30 });
            description = [];

            function critical(player) {
                const pool = chance.natural({ min: 1, max: 1000 });
                if (pool <= player.precision) {
                    dealt *= 2;
                    crit = true;
                }
            }

            async function checkTurn() {
                if (turn[0].effects.includes(`Blindness`)) {
                    require(`./effects/Blindness.js`)(turn, embed, description, i, fields, optionsGUI);
                } else {
                    description.push(`‣ It is **${turn[0].user.username}** turn!`);
                    await i.update({ embeds: [EmbedBuilder.from(embed).setDescription(description.join(`\n`)).setFields(fields)], components: [turn[0].skillsGUI, optionsGUI] });
                }
            }

            function healStamina() {
                description.push(`‣ **${turn[0].user.username}** healed **${Math.round(healed * turn[0].staminaAffectMultiplier)}** stamina!`);
                turn[0].affectStamina(turn[0], Math.round(- healed * turn[0].staminaAffectMultiplier));
            }

            function applyEffects(self = false) {
                if (!self) {
                    for (const enemyEffect of turn[1].skillsSet[skill].enemyEffects) {
                        turn[0].effects.push(...Array(Number(enemyEffect.split('_')[1])).fill(enemyEffect.split('_')[0]).flat());

                        description.push(`‣ **${turn[1].user.username}** applied **${enemyEffect.split('_')[0]}** for ${enemyEffect.split('_')[1]} turns on ${turn[0].user.username}!`);
                    }
                } else {
                    for (const selfEffect of turn[1].skillsSet[skill].selfEffects) {
                        turn[1].effects.push(...Array(Number(selfEffect.split('_')[1])).fill(selfEffect.split('_')[0]).flat());

                        description.push(`‣ **${turn[1].user.username}** applied **${selfEffect.split('_')[0]}** for ${selfEffect.split('_')[1]} turns on themselves!`);
                    }
                }
            }

            if (i.user !== turn[0].user) {
                return void i.reply({ content: `It ain't yo turn dumbass`, ephemeral: true })
            }

            if (i.customId === `GUI_Options_Surrender`) {
                i.deferUpdate();

                victor = turn[1];
                loser = turn[0];
                return collector.stop(`Surrender`);
            }

            if (i.customId === `GUI_Options_Defend`) {
                turn[0].defend();
            }

            if (turn[0].defendStatus === 2) {
                takeTurn();

                description.push(`‣ **${turn[1].user.username}** defended! The next enemy attack's power will be reduced by 50%`);

                if (turn[0].effects.includes(`Resistance`)) {
                    require(`./effects/Resistance.js`)(turn, description);
                }

                if (turn[0].effects.includes(`Paralysis`)) {
                    require(`./effects/Paralysis.js`)(takeTurn, description, turn);
                }

                if (turn[0].effects.includes(`Breathless`)) {
                    require(`./effects/Breathless.js`)(turn, description);
                }

                if (turn[0].effects.includes(`Manoeuvre`)) {
                    require(`./effects/Manoeuvre.js`)(turn, description);
                }

                if (turn[1].effects.includes('Panic')) {
                    require(`./effects/Panic.js`)(turn, description, dealt);
                }

                healStamina();
                updateSTATS();
                checkIfUsable(turn[0]);
                await checkTurn();
                decrementCooldown();
                turn[0].resetAllMultipliers();
                checkWin(collector);
                return;
            } else {
                takeTurn();

                critical(turn[1]);

                if (turn[0].effects.includes(`Resistance`)) {
                    require(`./effects/Resistance.js`)(turn, description);
                }

                turn[1].attackPlayer(turn[1], turn[0], dealt, skill, crit);
                consumeStamina(skill);

                if (turn[1].skillsSet[skill].enemyEffects) {
                    applyEffects(false)
                }

                if (turn[1].skillsSet[skill].selfEffects) {
                    applyEffects(true)
                }

                applyCooldown(skill);

                if (turn[0].effects.includes(`Paralysis`)) {
                    require(`./effects/Paralysis.js`)(takeTurn, description, turn);
                }

                if (turn[0].effects.includes(`Breathless`)) {
                    require(`./effects/Breathless.js`)(turn, description);
                }

                if (turn[0].effects.includes(`Manoeuvre`)) {
                    require(`./effects/Manoeuvre.js`)(turn, description);
                }

                if (turn[1].effects.includes('Panic')) {
                    require(`./effects/Panic.js`)(turn, description, dealt);
                }

                healStamina();
                updateSTATS();
                checkIfUsable(turn[0]);
                await checkTurn();
                decrementCooldown();
                turn[0].resetAllMultipliers();
                checkWin(collector);
            }
        });

        collector.on('end', (coll, r) => {
            cache.del(message.channel.id);
            battle.delete();

            if (r === 'Surrender') {
                const resultEmbedYesSurr = new EmbedBuilder()
                    .setTitle(`This AI HUB shit got dangerous...`)
                    .setImage(victor.user.avatarURL())
                    .setDescription(`${loser.user.username} knelt to **${victor.user.username}**'s vigor!`)
                    .setColor('Aqua');

                message.channel.send({ embeds: [resultEmbedYesSurr] });
            } else if (r === 'idle') {
                const resultEmbedIdle = new EmbedBuilder()
                    .setTitle(`This AI HUB shit got dangerous...`)
                    .setImage(victor.user.avatarURL())
                    .setDescription(`The fear of vanquishment by **${victor.user.username}** immobilized ${loser.user.username}!`)
                    .setColor('Aqua');

                message.channel.send({ embeds: [resultEmbedIdle] });
            } else if (r === 'draw') {
                const resultEmbedDraw = new EmbedBuilder()
                    .setTitle(`This AI HUB shit got dangerous...`)
                    .setDescription(`It was a tide!`)
                    .setColor('Aqua');

                message.channel.send({ embeds: [resultEmbedDraw] });
            } else {
                const resultEmbedNoSurr = new EmbedBuilder()
                    .setTitle(`This AI HUB shit got dangerous...`)
                    .setImage(victor.user.avatarURL())
                    .setDescription(`**${victor.user.username}** dominated the battlefield!`)
                    .setColor('Aqua');

                message.channel.send({ embeds: [resultEmbedNoSurr] });
            }
        });
    }
}