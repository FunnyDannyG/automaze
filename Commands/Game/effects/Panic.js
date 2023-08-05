module.exports = (turn, description, dealt) => {
    turn[1].affectHealth(turn[1], Math.round(dealt / 10));
    description.push(`‣ **${turn[1].user.username}** is panicking! They accidentally harmed themselves, inflicting on themselves 10% of the damage they dealt`);

    turn[1].effects.splice(turn[1].effects.findIndex(e => e === 'Panic'), 1);
}