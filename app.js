const getRandomValue = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min
}

const app = Vue.createApp({
  data() {
    return {
      playerHealth: 100,
      monsterHealth: 100,
      currentRound: 0,
      winner: null
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
      this.winner = null
    },
    attackMonster() {
      this.currentRound++
      // deal between 5 and 12 damage
      const damage = getRandomValue(5, 12)
      this.monsterHealth -= damage;
      this.attackPlayer()
    },
    attackPlayer() {
      // deal between 8 and 15 damage
      const damage = getRandomValue(8, 15)
      this.playerHealth -= damage;
    },
    specialAttackMonster() {
      this.currentRound++
      // deal between 10 and 25 damage
      const damage = getRandomValue(10, 25)
      this.monsterHealth -= damage;
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
      this.attackPlayer()
    },
    surrender() {
      this.winner = 'monster'
    }
  }
})

app.mount('#game')