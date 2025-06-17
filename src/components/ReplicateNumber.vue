<template>
  <div class="replicate-number">
      <h1 class="title">Replicate Numbers</h1>
       <div class="lives">
         <img v-for="(life, index) in totalLives" 
         :key="index"
         :src="index < (3 - errorCount) ? heartIcon : brokenheartIcon"
         class="heart">
        </div>
       <div class="sidebar">
        <div class="instructions">
          <h2 class="instruction">Instructions</h2>
          <p>Instructions</p>
        </div>
        <div class="records">
          <h2 class="record">Records</h2>
          <p>Mistakes: {{ errorCount }}</p>
          <p>Time: {{ elapsedSeconds === null ? '00:00' : formattedTime }}</p>
        </div>
      </div>
    
      <div class="dial">
        <el-row>
          <el-button class="number" @click="appendToSequence('1')">1</el-button>
          <el-button class="number" @click="appendToSequence('2')">2</el-button>
          <el-button class="number" @click="appendToSequence('3')">3</el-button>
        </el-row>
        <el-row>
          <el-button class="number" @click="appendToSequence('4')">4</el-button>
          <el-button class="number" @click="appendToSequence('5')">5</el-button>
          <el-button class="number" @click="appendToSequence('6')">6</el-button>
        </el-row>
        <el-row>
          <el-button class="number" @click="appendToSequence('7')">7</el-button>
          <el-button class="number" @click="appendToSequence('8')">8</el-button>
          <el-button class="number" @click="appendToSequence('9')">9</el-button>
        </el-row>
        <el-row>
          <el-button class="number semi-yellow" @click="appendToSequence('*')">*</el-button>
          <el-button class="number" @click="appendToSequence('0')">0</el-button>
          <el-button class="number semi-yellow" @click="appendToSequence('#')">#</el-button>
        </el-row>
        <el-row style="margin-top: 1rem;">
            <el-button type="primary " @click="submitAnswer">Submit</el-button>
        </el-row>
      </div>
      
      <div class="buttons">    
        <el-button class="button"
        :type="isRunning ? 'danger' : 'success'"
        round
        @click="isRunning? abortGame() : startGame()"        
      >
        {{ isRunning ? 'Abort' : 'Start' }}
      </el-button>
      </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isRunning: false,
      totalLives : 3,
      heartIcon : '../public/icon/heart1.png',
      brokenheartIcon: '../public/icon/heart2.png',
      gameName: 'Replicate Number',
      errorCount: 0,
      correct: null,
      elapsedSeconds: 0,
      timer: null,
      inputSequence : ''
    }
  },
  computed: {
    formattedTime() {
      const mins = Math.floor(this.elapsedSeconds / 60)
      const secs = this.elapsedSeconds % 60
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
  },
  methods: {
    saveGameState(gameName, errorCount, elapsedSeconds) {
      const state = { errorCount, elapsedSeconds };
      sessionStorage.setItem(`gameState_${gameName}`, JSON.stringify(state));
    },
    loadGameState(gameName) {
      const stateStr = sessionStorage.getItem(`gameState_${gameName}`);
      if (stateStr) {
        return JSON.parse(stateStr);
      }
      return null;
    },
    appendToSequence(char){
      this.inputSequence += char;
    },
    async startGame(){
    this.elapsedSeconds = null;
    this.isRunning = true;
    this.errorCount = 0;
    this.correct = null;
    this.timer = setInterval(() => {
        this.elapsedSeconds++
      }, 1000)
    try{
      await this.$signalR.invoke('startGame');//startGame
      console.log("successful connection.")
    }catch (err){
      console.log("failed connection.")
    }
   },
   async abortGame(){
    this.isRunning = false;
     if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      };
    try{
      await this.$signalR.invoke("abortGame");//abortGame
    }catch(err){
      console.log("failed connection.")
    }
   },
   handleDataUpdated(status, mistakes){
    this.errorCount = mistakes;
    this.status = status;
    if(this.errorCount >= 3){
      this.isRunning = false;
      alert("GAME OVER!");
      this.abortGame();
    }
   },
    async sendToArduino({sequence}) {
      try {
    if (!this.$signalR || this.$signalR.state !== 'Connected') {
      console.error("SignalR is not connected!");
      return;
    }
    await this.$signalR.invoke("SendAnswer", { sequence });
    console.log("SignalR send success:", sequence);
  } catch (error) {
    console.error("SignalR send failed:", error);
  }
    },
    async submitAnswer() {
    if (!this.isRunning) {
      alert("Please Start Game!");
      return;
    }
    if (!this.inputSequence) {
      alert("Submit before Inputting!");
      return;
    }
    const sequence = this.inputSequence;
    console.log(sequence)
        await this.sendToArduino({ sequence });
    this.inputSequence = '';
  },
  },
  async mounted() {
    const savedState = this.loadGameState(this.gameName);
    if (savedState) {
      this.errorCount = savedState.errorCount;
      this.elapsedSeconds = savedState.elapsedSeconds;
    }
    const connection = this.$signalR
    connection.on('PotentiometerUpdated', this.handleDataUpdated)
  },
   watch: {
    errorCount(newVal) {
      this.saveGameState(this.gameName, newVal, this.elapsedSeconds);
    },
    elapsedSeconds(newVal) {
      this.saveGameState(this.gameName, this.errorCount, newVal);
    },
  },
}
</script>
<style scoped>
.replicate-number {
  display: grid;
  background: linear-gradient(to bottom, #fdfbfb, #ebedee);
  grid-template-columns: 1fr 250px;
  grid-template-rows: auto auto auto auto auto;
  gap: 1rem;
  padding: 1rem;
  min-height: 100vh;
  box-sizing: border-box;
}

.title {
  font-family: 'Comic Sans MS', 'Baloo 2', cursive;
  margin-bottom: 2rem;
  color: #2c3e50;
  grid-column: 1 / 3;
  grid-row: 1 / 5;
  text-align: center;
  color: #2c3e50;
  font-size: 3rem;
  letter-spacing: 1.5px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
}

.sidebar {
  grid-column: 2 / 3;
  grid-row: 2 / 5;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.instructions, .records {
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.buttons {
  grid-column: 1 / 3;
  grid-row:  3 / 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 2rem;
}

.dial {
  grid-column: 1 / 3;
  grid-row:  2 / 5 ;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}

.button{
  width: 150px;
  height: 60px;
  font-size: 1.6rem;
}

.number {
  margin-right: -12px;
  margin-bottom: 0px;
  width: 60px;
  height: 60px;
  font-size: 18px;
  padding: 20px 20px;
  text-align: center;
}
.semi-yellow {
  background-color: rgba(255, 255, 255, 0.1);
}
.lives {
  grid-column: 1 / 2;
  grid-row: 2 / 5;
  display: flex;
  left: 12px;
  bottom: 12px;
  display: flex;
  gap: 3px;
}
.heart {
  width: 25px;
  height: 25px;
}
</style>