<template>
  <div class="replicate-number">
      <h1 class="title">Replicate Numbers</h1>
       <div class="game-result">
          <h2 class="instruction">Game Answer</h2>
          <p>Correct Answer:</p>
          <p>2 3</p>
          <p>Your Answer:</p>
          <p>2</p>
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
      </div>

      <div class="buttons">
        <el-button class="button"
        :type="isRunning ? 'danger' : 'success'"
        round
        @click="controlGame"      >
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
      // currentStars: 1,
      // maxStars: 3,
      gameName: 'Replicate Number',
      serialPort: null,
      inputSequence: '',
      // isInputting: false
    }
  },
  methods: {
    appendToSequence(char){
      this.inputSequence += char;
    },
    async controlGame() {
      if(!this.isRunning){
        this.inputSequence = '';
      }
      else{
        if(!this.serialPort){
          await this.sendToArduino({
            sequence: this.inputSequence});
        }
        if (this.serialPort) {
          await this.serialPort.close();
          this.serialPort = null;
        }
      }
      this.isRunning = !this.isRunning
    },
    async sendToArduino({level, sequence}) {
      try {
        const jsonData = JSON.stringify({level, sequence});
        const dataString = jsonData + '\n';
        console.log(dataString);
        this.serialPort = await navigator.serial.requestPort();
        await this.serialPort.open({ baudRate: 9600 });
        const writer = this.serialPort.writable.getWriter();
        await writer.write(new TextEncoder().encode(dataString));
        writer.releaseLock();
        console.log(`Serial communication success: ${dataString}`);
      } catch (error) {
        console.error("Serial communication failed!:", error);
      }
    },

  },
  created() {
  // this.currentStars = parseInt(sessionStorage.getItem(`stars-${this.gameName}`)) || 0;
  }
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
.game-result {
  grid-column: 1 / 2;
  grid-row: 2 / 5;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 260px;
  min-height: 280px;
  padding: 1rem;

}
</style>