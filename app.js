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
      this.currentRound ++
      // deal between 5 and 12 damage
      const damage = getRandomValue(5, 12)
      this.monsterHealth -= damage;
      if(this.monsterHealth <= 0) this.monsterHealth = 0
      this.attackPlayer()
    },
    attackPlayer() {
      // deal between 8 and 15 damage
      const damage = getRandomValue(8, 15)
      this.playerHealth -= damage;
      if(this.playerHealth <= 0) this.playerHealth = 0
    },
    specialAttackMonster() {
      this.currentRound ++
      // deal between 10 and 25 damage
      const damage = getRandomValue(10, 25)
      this.monsterHealth -= damage;
      if(this.monsterHealth <= 0) this.monsterHealth = 0
      this.attackPlayer()
    }
  }
})

app.mount('#game')