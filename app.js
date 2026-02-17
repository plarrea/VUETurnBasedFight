const getRandomValue = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min
}

const app = Vue.createApp({
  data() {
    return {
      playerHealth: 100,
      monsterHealth: 100,
      currentRound: 0
    }
  },
  computed: {
    monsterBarStyles() {
      return { width: `${this.monsterHealth}%` }
    },
    playerBarStyles() {
      return { width: `${this.playerHealth}%` }
    },
    canUseSpecialAttack() {
      return this.currentRound % 3 !== 0
    }
  },
  methods: {
    attackMonster() {
      this.currentRound++
      // deal between 5 and 12 damage
      const damage = getRandomValue(5, 12)
      this.monsterHealth -= damage
      if (this.monsterHealth - damage < 0) {
        this.monsterHealth = 0
      } else {
        this.monsterHealth -= damage;
      }
      this.attackPlayer()
    },
    attackPlayer() {
      // deal between 8 and 15 damage
      const damage = getRandomValue(8, 15)
      if (this.playerHealth - damage < 0) {
        this.playerHealth = 0
      } else {
        this.playerHealth -= damage;
      }
    },
    specialAttackMonster() {
      this.currentRound++
      // deal between 10 and 25 damage
      const damage = getRandomValue(10, 25)
      if (this.monsterHealth - damage < 0) {
        this.monsterHealth = 0
      } else {
        this.monsterHealth -= damage;
      }
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
    }
  }
})

app.mount('#game')