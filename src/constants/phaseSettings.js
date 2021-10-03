export const phase1 = {
  time: 10000,
  electricityOff: 1,
  electricityTurnOn: 20,
  circleAccident: {
    chance: 3,
    time: 10000,
  },
  sequenceAccident: {
    chance: 3,
    length: 3,
    time: 5000,
  },
  sineAccident: {
    chance: 3,
  },
};

export const phase2 = {
  time: 7000,
  electricityOff: 2,
  electricityTurnOn: 20,
  circleAccident: {
    chance: 3,
    time: 10000,
  },
  sequenceAccident: {
    chance: 3,
    length: 4,
    time: 5000,
  },
  sineAccident: {
    chance: 3,
  },
};

export const phase3 = {
  time: 5000,
  electricityOff: 3,
  electricityTurnOn: 20,
  circleAccident: {
    chance: 3,
    time: 10000,
  },
  sequenceAccident: {
    chance: 3,
    length: 5,
    time: 5000,
  },
  sineAccident: {
    chance: 3,
  },
};

export const phases = [phase1, phase2, phase3];
