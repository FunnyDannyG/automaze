module.exports = (turn, description) => {
    turn[0].updateHealthAffectMultiplier(5 / 10)
    description.push(`‣ **${turn[0].user.username}** increased their resistance! The enemy's damage is reduced by 50%`);

    turn[0].effects.splice(turn[0].effects.findIndex(e => e === 'Resistance'), 1);
}