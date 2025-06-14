<template>
  <div class="rotation-game">
      <h1 class="title">Copy Rotation</h1>
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
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import { toHandlers } from 'vue';
export default {
  data() {
    return {
      isRunning: false,
      totalLives : 3,
      heartIcon : '../public/icon/heart1.png',
      brokenheartIcon: '../public/icon/heart2.png',
      gameName: 'Copy Rotation',
      connection: null,
      errorCount: 0,
      correct: null,
      elapsedSeconds: 0,
      timer: null,
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
  },
   async mounted() {
    // this.connection = new HubConnectionBuilder()
    //   .withUrl('/gameHub', { withCredentials: true })
    //   .configureLogging(LogLevel.Information)
    //   .withAutomaticReconnect()
    //   .build()

    // this.connection.on('PotentiometerUpdated', this.handleDataUpdated)

    // try {
    //   await this.connection.start()
    //   console.log('SignalR connected.')
    // } catch (err) {
    //   console.error('SignalR connection failed:', err)
    // }
  }
  
}
</script>
<style>
.rotation-game {
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
  grid-row: 3 / 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 2rem;
}

.button{
  width: 150px;
  height: 60px;
  font-size: 1.6rem;
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