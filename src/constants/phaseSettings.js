export const testPhase = {
  electricityOff: 1,
  electricityTurnOn: 20,
  circleAccident: {
    chance: 3,
  },
  sequenceAccident: {
    chance: 3,
    length: 5,
  },
};

export const phase1 = {
  electricityOff: 1,
  electricityTurnOn: 20,
  circleAccident: {
    chance: 3,
  },
  sequenceAccident: {
    chance: 3,
    length: 3,
  },
  sineAccident: {
    chance: 3,
  },
};

export const phase2 = {
  electricityOff: 2,
  electricityTurnOn: 20,
  circleAccident: {
    chance: 3,
  },
  sequenceAccident: {
    chance: 3,
    length: 4,
  },
  sineAccident: {
    chance: 3,
  },
};

export const phase3 = {
  electricityOff: 3,
  electricityTurnOn: 20,
  circleAccident: {
    chance: 3,
  },
  sequenceAccident: {
    chance: 3,
    length: 5,
  },
  sineAccident: {
    chance: 3,
  },
};

export const phases = [phase1, phase2, phase3];
