// modules/battle/core/3-draw.js
// Отрисовка гексов, существ, объектов

BattleModule.drawGrid = function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.ctx.save();
    this.ctx.translate(this.offsetX, this.offsetY);
    this.ctx.scale(this.scale, this.scale);
    
    this.ctx.strokeStyle = this.gridColor;
    this.ctx.lineWidth = 2 / this.scale;
    this.ctx.fillStyle = '#2a1a0f';
    
    this.hexes.forEach(hex => {
        this.drawHexagon(hex.x, hex.y, false);
    });
    
    if (this.moveModeActive && this.availableMoveHexes.length > 0) {
        this.ctx.fillStyle = this.moveHighlightColor;
        this.ctx.globalAlpha = 0.3;
        this.availableMoveHexes.forEach(hex => {
            this.drawHexagon(hex.x, hex.y, false);
        });
        this.ctx.globalAlpha = 1;
        
        if (this.showNumbers) {
            this.ctx.font = `${this.hexSize * 0.8}px Arial`;
            this.ctx.fillStyle = '#ffffff';
            this.ctx.shadowColor = '#000000';
            this.ctx.shadowBlur = 4;
            this.availableMoveHexes.forEach((hex, index) => {
                this.ctx.fillText(index + 1, hex.x, hex.y);
            });
            this.ctx.shadowBlur = 0;
        }
    }
    
    if (this.attackModeActive && this.availableAttackTargets.length > 0) {
        this.ctx.fillStyle = this.attackHighlightColor;
        this.ctx.globalAlpha = 0.3;
        this.availableAttackTargets.forEach(hex => {
            this.drawHexagon(hex.x, hex.y, false);
        });
        this.ctx.globalAlpha = 1;
        
        if (this.showNumbers) {
            this.ctx.font = `${this.hexSize * 0.8}px Arial`;
            this.ctx.fillStyle = '#ffffff';
            this.ctx.shadowColor = '#000000';
            this.ctx.shadowBlur = 4;
            this.availableAttackTargets.forEach((hex, index) => {
                this.ctx.fillText(index + 1, hex.x, hex.y);
            });
            this.ctx.shadowBlur = 0;
        }
    }
    
    if (this.rangedAttackModeActive && this.availableRangedTargets.length > 0) {
        this.ctx.fillStyle = this.attackHighlightColor;
        this.ctx.globalAlpha = 0.3;
        this.availableRangedTargets.forEach(hex => {
            this.drawHexagon(hex.x, hex.y, false);
        });
        this.ctx.globalAlpha = 1;
        
        if (this.showNumbers) {
            this.ctx.font = `${this.hexSize * 0.8}px Arial`;
            this.ctx.fillStyle = '#ffffff';
            this.ctx.shadowColor = '#000000';
            this.ctx.shadowBlur = 4;
            this.availableRangedTargets.forEach((hex, index) => {
                this.ctx.fillText(index + 1, hex.x, hex.y);
            });
            this.ctx.shadowBlur = 0;
        }
    }
    
    this.hexes.forEach(hex => {
        if (hex.object) {
            this.drawObject(hex);
        }
    });
    
    this.hexes.forEach(hex => {
        if (hex.creature) {
            this.drawCreature(hex);
        }
    });
    
    this.ctx.strokeStyle = this.gridColor;
    this.ctx.lineWidth = 2 / this.scale;
    this.hexes.forEach(hex => {
        this.drawHexagon(hex.x, hex.y, true);
    });
    
    this.ctx.restore();
};

BattleModule.drawHexagon = function(x, y, stroke = true) {
    this.ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const angle = i * Math.PI / 3 - Math.PI / 6;
        const hx = x + this.hexSize * Math.cos(angle);
        const hy = y + this.hexSize * Math.sin(angle);
        
        if (i === 0) {
            this.ctx.moveTo(hx, hy);
        } else {
            this.ctx.lineTo(hx, hy);
        }
    }
    this.ctx.closePath();
    
    if (stroke) {
        this.ctx.stroke();
    } else {
        this.ctx.fill();
    }
};

BattleModule.drawCreature = function(hex) {
    const creature = this.creatures.find(c => c.id === hex.creature);
    if (!creature) return;
    
    const creatureData = this.activeCreatures.find(c => c.id === hex.creatureId);
    const isDead = creatureData && creatureData.currentHp <= 0;
    
    const isCurrentTurn = this.turnActive && 
                         this.turnOrder[this.currentTurnIndex] === hex.creatureId;
    
    let fillColor = creature.color;
    if (isDead) {
        fillColor = '#555555';
    } else if (isCurrentTurn) {
        fillColor = this.currentTurnHighlight;
    }
    
    this.ctx.fillStyle = fillColor;
    this.ctx.globalAlpha = isDead ? 0.5 : (isCurrentTurn ? 0.9 : 0.7);
    this.drawHexagon(hex.x, hex.y, false);
    this.ctx.globalAlpha = 1;
    
    this.ctx.font = `${this.hexSize * 1.2}px Arial`;
    this.ctx.fillStyle = isDead ? '#888888' : '#ffffff';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(creature.icon, hex.x, hex.y);
    
    if (creatureData && creatureData.isPreparingAttack) {
        this.ctx.font = `${this.hexSize * 0.8}px Arial`;
        this.ctx.fillStyle = '#ffaa00';
        this.ctx.fillText('⚔️', hex.x + this.hexSize/2, hex.y);
    }
    
    if (creatureData && creatureData.hasPreparedAttack) {
        this.ctx.font = `${this.hexSize * 0.8}px Arial`;
        this.ctx.fillStyle = '#ff5500';
        this.ctx.fillText('⚡', hex.x + this.hexSize/2, hex.y - this.hexSize/3);
    }
    
    if (this.showNumbers && !isDead && creatureData) {
        const creatureIndex = this.activeCreatures.findIndex(c => c.id === hex.creatureId) + 1;
        this.ctx.font = `${this.hexSize * 0.5}px Arial`;
        this.ctx.fillStyle = '#ffffaa';
        this.ctx.shadowColor = '#000000';
        this.ctx.shadowBlur = 3;
        this.ctx.fillText(`#${creatureIndex}`, hex.x - this.hexSize/2, hex.y - this.hexSize/2);
        this.ctx.shadowBlur = 0;
    }
    
    if (isDead) {
        this.ctx.strokeStyle = '#ff0000';
        this.ctx.lineWidth = 3 / this.scale;
        this.ctx.beginPath();
        this.ctx.moveTo(hex.x - this.hexSize/2, hex.y - this.hexSize/2);
        this.ctx.lineTo(hex.x + this.hexSize/2, hex.y + this.hexSize/2);
        this.ctx.moveTo(hex.x + this.hexSize/2, hex.y - this.hexSize/2);
        this.ctx.lineTo(hex.x - this.hexSize/2, hex.y + this.hexSize/2);
        this.ctx.stroke();
    }
    
    if (!isDead && creatureData) {
        const hpPercent = creatureData.currentHp / creatureData.maxHp;
        const barWidth = this.hexSize * 1.5;
        const barHeight = 4;
        const barX = hex.x - barWidth/2;
        const barY = hex.y - this.hexSize * 0.8;
        
        this.ctx.fillStyle = '#330000';
        this.ctx.fillRect(barX, barY, barWidth, barHeight);
        
        this.ctx.fillStyle = hpPercent > 0.5 ? '#00aa00' : (hpPercent > 0.2 ? '#aaaa00' : '#aa0000');
        this.ctx.fillRect(barX, barY, barWidth * hpPercent, barHeight);
        
        this.ctx.font = `${this.hexSize * 0.5}px Arial`;
        this.ctx.fillStyle = '#ffffaa';
        this.ctx.fillText(creatureData.currentInitiative, hex.x + this.hexSize/2, hex.y - this.hexSize/2);
    }
};

BattleModule.drawObject = function(hex) {
    const object = this.objects.find(o => o.id === hex.object);
    if (!object) return;
    
    this.ctx.fillStyle = object.color;
    this.ctx.globalAlpha = 0.4;
    this.drawHexagon(hex.x, hex.y, false);
    this.ctx.globalAlpha = 1;
    
    this.ctx.font = `${this.hexSize * 1}px Arial`;
    this.ctx.fillStyle = '#ffffff';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(object.icon, hex.x, hex.y);
};
