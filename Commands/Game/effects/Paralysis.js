module.exports = (takeTurn, description, turn) => {
    takeTurn();
    description.push(`‣ **${turn[1].user.username}** is **paralyzed**! Their turn is forfeited!`);

    turn[1].effects.splice(turn[1].effects.findIndex(e => e === 'Paralysis'), 1);
}