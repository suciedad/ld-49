export const phase1 = {
  time: 30000,
  electricityOff: 0,
  electricityTurnOn: 40,
  circleAccident: {
    chance: 12,
    time: 10000,
  },
  sequenceAccident: {
    chance: 20,
    length: 3,
    time: 5000,
  },
  sineAccident: {
    chance: 3,
    time: 7000,
  },
};

export const phase2 = {
  time: 40000,
  electricityOff: 10,
  electricityTurnOn: 40,
  circleAccident: {
    chance: 10,
    time: 10000,
  },
  sequenceAccident: {
    chance: 15,
    length: 4,
    time: 4000,
  },
  sineAccident: {
    chance: 1,
    time: 7000,
  },
};

export const phase3 = {
  time: 50000,
  electricityOff: 10,
  electricityTurnOn: 40,
  circleAccident: {
    chance: 15,
    time: 10000,
  },
  sequenceAccident: {
    chance: 20,
    length: 5,
    time: 3500,
  },
  sineAccident: {
    chance: 5,
    time: 7000,
  },
};

export const phase4 = {
  time: 60000,
  electricityOff: 10,
  electricityTurnOn: 30,
  circleAccident: {
    chance: 15,
    time: 8000,
  },
  sequenceAccident: {
    chance: 20,
    length: 5,
    time: 2800,
  },
  sineAccident: {
    chance: 10,
    time: 6000,
  },
};

export const phase5 = {
  time: 60000,
  electricityOff: 15,
  electricityTurnOn: 25,
  circleAccident: {
    chance: 20,
    time: 8000,
  },
  sequenceAccident: {
    chance: 25,
    length: 5,
    time: 2500,
  },
  sineAccident: {
    chance: 15,
    time: 6000,
  },
};

export const phase6 = {
  time: 80000,
  electricityOff: 15,
  electricityTurnOn: 25,
  circleAccident: {
    chance: 20,
    time: 8000,
  },
  sequenceAccident: {
    chance: 20,
    length: 5,
    time: 2300,
  },
  sineAccident: {
    chance: 20,
    time: 5000,
  },
};

export const phases = [phase1, phase2, phase3, phase4, phase5];
// export const phases = [phase1];
