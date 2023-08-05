module.exports = (turn, description) => {
    turn[0].updateStaminaAffectMultiplier(15 / 10);
    description.push(`‣ **${turn[0].user.username}'s manoeuvrability is increased!** Their STA regen increases by 50%!`);

    turn[0].effects.splice(turn[0].effects.findIndex(e => e === 'Manoeuvre'), 1);
}