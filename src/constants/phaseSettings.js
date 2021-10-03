export const phase1 = {
  time: 20000,
  electricityOff: 10,
  electricityTurnOn: 20,
  circleAccident: {
    chance: 10,
    time: 10000,
  },
  sequenceAccident: {
    chance: 10,
    length: 3,
    time: 5000,
  },
  sineAccident: {
    chance: 10,
  },
};

export const phase2 = {
  time: 70000,
  electricityOff: 10,
  electricityTurnOn: 20,
  circleAccident: {
    chance: 15,
    time: 10000,
  },
  sequenceAccident: {
    chance: 15,
    length: 4,
    time: 5000,
  },
  sineAccident: {
    chance: 15,
  },
};

export const phase3 = {
  time: 90000,
  electricityOff: 10,
  electricityTurnOn: 20,
  circleAccident: {
    chance: 20,
    time: 10000,
  },
  sequenceAccident: {
    chance: 20,
    length: 5,
    time: 5000,
  },
  sineAccident: {
    chance: 20,
  },
};

export const phases = [phase1, phase2, phase3];
