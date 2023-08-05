module.exports = (turn, description) => {
    turn[0].updateStaminaAffectMultiplier(2 / 10);
    description.push(`‣ **${turn[0].user.username}** is unable to breathe! Their STA regen declined by 80%`);

    turn[0].effects.splice(turn[0].effects.findIndex(e => e === 'Breathless'), 1);
}