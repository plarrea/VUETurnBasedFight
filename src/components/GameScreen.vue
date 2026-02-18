<template>
  <div>
    <header>
      <h1>Turn Based Fight</h1>
    </header>
    <div id="game">
      <section id="monster" class="container">
        <h2>Monster Health</h2>
        <div class="healthbar">
          <div class="healthbar__value" :style="monsterBarStyles"></div>
        </div>
      </section>
      <section id="player" class="container">
        <h2>Your Health</h2>
        <div class="healthbar">
          <div class="healthbar__value" :style="playerBarStyles"></div>
        </div>
      </section>
      <section class="container" v-if="winner">
        <h2>Game Over!</h2>
        <h3 v-if="winner === 'player'">You Won!</h3>
        <h3 v-else-if="winner === 'monster'">You Lost!</h3>
        <h3 v-else>It's a draw!</h3>
        <button @click="startGame">Start New Game</button>
      </section>
      <section id="controls" v-else>
        <button @click="attackMonster">ATTACK</button>
        <button :disabled="canUseSpecialAttack" @click="specialAttackMonster">SPECIAL ATTACK</button>
        <button @click="healPlayer">HEAL</button>
        <button @click="surrender">SURRENDER</button>
      </section>
      <section id="log" class="container">
        <h2>Battle Log</h2>
        <ul>
          <li v-for="log in logMessages" :key="log.id">
            <span style="text-transform: capitalize;" :class="{'log--player': log.actionBy === 'player', 'log--monster': log.actionBy === 'monster'}">{{ log.actionBy }}</span>
            <span v-if="log.actionType === 'heal'"> heals himself for <span class="log--heal">{{ log.actionValue }}</span></span>
            <span v-else-if="log.actionType === 'attack'"> attacks and deals <span class="log--damage">{{ log.actionValue }}</span></span>
            <span v-else-if="log.actionType === 'special'"> uses special attack and deals <span class="log--damage">{{ log.actionValue }}</span></span>
            <span v-else-if="log.actionType === 'surrender'"> gives up</span>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script>
const getRandomValue = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min
}

export default {
  name: 'GameScreen',
  data() {
    return {
      playerHealth: 100,
      monsterHealth: 100,
      currentRound: 0,
      winner: null,
      logMessages: []
    }
  },
  computed: {
    monsterBarStyles() {
      if(this.monsterHealth < 0) return { width: 0 }
      return { width: `${this.monsterHealth}%` }
    },
    playerBarStyles() {
      if(this.playerHealth < 0) return { width: 0 }
      return { width: `${this.playerHealth}%` }
    },
    canUseSpecialAttack() {
      return this.currentRound % 3 !== 0
    }
  },
  watch: {
    playerHealth(value) {
      if(value <= 0 && this.monsterHealth <= 0){
        // a draw
        this.winner = 'draw'
      } else if (value <= 0) {
        // Player lost
        this.winner = 'monster'
      }
    },
    monsterHealth(value) {
      if(value <= 0 && this.playerHealth <= 0){
        // a draw
        this.winner = 'draw'
      } else if (value <= 0) {
        // Monster lost
        this.winner = 'player'
      }
    }
  },
  methods: {
    startGame() {
      this.playerHealth = 100
      this.monsterHealth = 100
      this.currentRound = 0
      this.winner = null,
      this.logMessages = []
    },
    attackMonster() {
      this.currentRound++
      // deal between 5 and 12 damage
      const damage = getRandomValue(5, 12)
      this.monsterHealth -= damage;
      this.addLogMessage('player', 'attack', damage)
      this.attackPlayer()
    },
    attackPlayer() {
      // deal between 8 and 15 damage
      const damage = getRandomValue(8, 15)
      this.playerHealth -= damage;
      this.addLogMessage('monster', 'attack', damage)
    },
    specialAttackMonster() {
      this.currentRound++
      // deal between 10 and 25 damage
      const damage = getRandomValue(10, 25)
      this.monsterHealth -= damage;
      this.addLogMessage('player', 'special', damage)
      this.attackPlayer()
    },
    healPlayer() {
      this.currentRound++
      const healValue = getRandomValue(8, 20)
      if(this.playerHealth + healValue > 100) {
        this.playerHealth = 100;
      } else {
        this.playerHealth += healValue;
      }
      this.addLogMessage('player', 'heal', healValue)
      this.attackPlayer()
    },
    surrender() {
      this.winner = 'monster'
      this.addLogMessage('player', 'surrender', null)
    },
    addLogMessage(who, what, value) {
      const time = new Date()
      this.logMessages.unshift({
        actionBy: who,
        actionType: what,
        actionValue: value,
        actionTime: time,
        id: `${time}-${who}-${what}-${value}`
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
header {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  padding: 0.5rem;
  background-color: #880017;
  color: white;
  text-align: center;
  margin-bottom: 2rem;
}

section {
  width: 90%;
  max-width: 40rem;
  margin: auto;
}

.healthbar {
  width: 100%;
  height: 40px;
  border: 1px solid #575757;
  margin: 1rem 0;
  background: #fde5e5;
}

.healthbar__value {
  background-color: #00a876;
  width: 100%;
  height: 100%;
}

.container {
  text-align: center;
  padding: 0.5rem;
  margin: 1rem auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  border-radius: 12px;
}

#monster h2,
#player h2 {
  margin: 0.25rem;
}

#controls {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}

button {
  font: inherit;
  border: 1px solid #88005b;
  background-color: #88005b;
  color: white;
  padding: 1rem 2rem;
  border-radius: 12px;
  margin: 1rem;
  width: 12rem;
  cursor: pointer;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.26);
}

button:focus {
  outline: none;
}

button:hover,
button:active {
  background-color: #af0a78;
  border-color: #af0a78;
  box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.26);
}

button:disabled {
  background-color: #ccc;
  border-color: #ccc;
  box-shadow: none;
  color: #3f3f3f;
  cursor: not-allowed;
}

#log ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

#log li {
  margin: 0.5rem 0;
}

.log--player {
  color: #7700ff;
}

.log--monster {
  color: #da8d00;
}

.log--damage {
  color: red;
}

.log--heal {
  color: green;
}
</style>
