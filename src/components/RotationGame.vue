<template>
  <div class="rotation-game">
      <h1 class="title">Copy Rotation</h1>
       <div class="star-badge">
         <span
           v-for="n in maxStars"
           :key="n"
           class="star"
           :class="{ filled: n <= currentStars }"
         >★</span>
        </div>

      <div class="sidebar">
        <div class="instructions">
          <h2 class="instruction">Instructions</h2>
          <p>Instructions</p>
        </div>
        <div class="records">
          <h2 class="record">Records</h2>
          <p>Mistakes: 0</p>
          <p>Time: 00:00</p>
        </div>
      </div>

      <div class="buttons">
        <el-button class="button"
        :type="isRunning ? 'danger' : 'success'"
        round
        @click="controlGame"
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
      currentStars: 1,
      maxStars: 3,
      gameName: 'Copy Rotation',
      serialPort: null
    }
  },
  methods: {
    async controlGame() {
      if(!this.isRunning){
        if (this.currentStars < this.maxStars) {
        this.currentStars += 1;
        sessionStorage.setItem(`stars-${this.gameName}`, this.currentStars);
      }
      await this.sendLevelToArduino(this.currentStars);
      }
      else{
        if (this.serialPort) {
          await this.serialPort.close();
          this.serialPort = null;
        }
      }
      this.isRunning = !this.isRunning
    },
    async sendLevelToArduino(starLevel) {
      try {
        this.serialPort = await navigator.serial.requestPort();
        await this.serialPort.open({ baudRate: 9600 });
        const writer = this.serialPort.writable.getWriter();
        await writer.write(new TextEncoder().encode(starLevel.toString()));
        writer.releaseLock();
        console.log(`Serial communication success: ${starLevel}`);
      } catch (error) {
        console.error("Serial communication failed!:", error);
      }
    },

  },
  created() {
  this.currentStars = parseInt(sessionStorage.getItem(`stars-${this.gameName}`)) || 0;
  }
}
</script>
<style>
.rotation-game {
  display: grid;
  background: linear-gradient(to bottom, #fdfbfb, #ebedee);
  grid-template-columns: 1fr 250px;
  grid-template-rows: auto auto 1fr auto;
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
  text-align: center;
  color: #2c3e50;
  font-size: 3rem;
  letter-spacing: 1.5px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
}

.sidebar {
  grid-column: 2 / 3;
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

.star-badge {
  grid-column: 1 / 2;
  display: flex;
  left: 12px;
  bottom: 12px;
  display: flex;
  gap: 3px;
}

.star {
  font-size: 1.2rem;
  color: #d0d0d0; 
}

.star.filled {
  color: #FFD700; 
  text-shadow: 0 0 4px rgba(255, 215, 0, 0.5);
}
</style>