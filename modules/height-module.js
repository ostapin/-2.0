// ========== МОДУЛЬ РОСТА ==========

function generateRandomHeight(raceId) {
    const range = raceHeightRanges[raceId];
    return range ? Math.floor(Math.random() * (range.max - range.min + 1)) + range.min : 170;
}

function generateHeightForSelectedRace() {
    const selectedRace = document.getElementById('characterRace').value;
    if (!selectedRace) {
        alert('❌ Сначала выберите расу!');
        return;
    }
    
    const randomHeight = generateRandomHeight(selectedRace);
    document.getElementById('characterHeight').value = randomHeight;
    document.getElementById('generateHeightBtn').disabled = true;
    saveCharacterData();
    alert(`📏 Новый рост: ${randomHeight} см`);
}
