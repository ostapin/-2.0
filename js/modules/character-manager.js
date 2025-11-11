const CharacterManager = {
    currentCharacter: null,
    levelTable: {
        0: { expRequired: 1000, hp: 100, mana: 100, stamina: 100, points: 20 },
        1: { expRequired: 3000, hp: 200, mana: 200, stamina: 200, points: 30 },
        2: { expRequired: 5000, hp: 300, mana: 300, stamina: 300, points: 40 },
        3: { expRequired: 8000, hp: 400, mana: 400, stamina: 400, points: 50 },
        4: { expRequired: 12000, hp: 500, mana: 500, stamina: 500, points: 60 },
        5: { expRequired: 16000, hp: 600, mana: 600, stamina: 600, points: 70 },
        6: { expRequired: 20000, hp: 700, mana: 700, stamina: 700, points: 80 },
        7: { expRequired: 25000, hp: 800, mana: 800, stamina: 800, points: 90 },
        8: { expRequired: 30000, hp: 900, mana: 900, stamina: 900, points: 100 },
        9: { expRequired: 100000, hp: 1000, mana: 1000, stamina: 1000, points: 200 }
    }
};
