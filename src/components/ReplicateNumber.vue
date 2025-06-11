<template>
  <div class="replicate-number">
      <h1 class="title">Replicate Numbers</h1>
       <div class="game-result">
          <h2 class="instruction">Game Answer</h2>
          <p>Correct Answer:</p>
          <p> {{ currentResult.correctAnswer }}</p>
          <p>Your Answer:</p>
          <p>{{ currentResult.userAnswer }}</p>
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
        <el-row style="margin-top: 1rem;">
            <el-button type="primary " @click="submitAnswer">Submit</el-button>
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
      currentResult: { correctAnswer:'', correctAnswer: '', isCorrect:''},
      mock: true,
    }
  },
  methods: {
    appendToSequence(char){
      this.inputSequence += char;
    },
    async controlGame() {
      if(!this.isRunning){
        this.inputSequence = '';
        this.currentResult.correctAnswer='';
        this.currentResult.userAnswer = '';
        await this.openSerialPort();
      }
      else{
        if (this.serialPort) {
          await this.serialPort.close();
          this.serialPort = null;
        }
      }
      this.isRunning = !this.isRunning
    },
    async openSerialPort(){
    try {
      this.serialPort = await navigator.serial.requestPort();
      await this.serialPort.open({ baudRate: 9600 });
      console.log("Open Serial Port successfully!");
    } catch (error) {
      console.error("Failed to open Serial Port!:", error);
    }
    },
    async sendToArduino({sequence}) {
      try {
      //    if (!this.serialPort) {
      //   console.error("Serial port is not open and data cannot be sent!");
      //   return;
      // }
        const jsonData = JSON.stringify({sequence});
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
    if(!this.mock)
    {
        await this.sendToArduino({ sequence });
    }
    const result = await this.readFromArduino();
    this.currentResult.userAnswer = result.userAnswer;
    this.currentResult.correctAnswer = result.correctAnswer;
    if (!result.isCorrect) {
      this.isRunning = false;
      alert("Game Over!");
      await this.serialPort.close();
      this.serialPort = null;
    } else{
          this.inputSequence = '';
    }
  },
  async readFromArduino() {
     if (this.mock) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        correctAnswer: '2',
        userAnswer: this.inputSequence,
        isCorrect: this.inputSequence === '2'
      };
    }
    if (!this.serialPort) return null;
    try {
      const decoder = new TextDecoderStream();
      const readableStreamClosed = this.serialPort.readable.pipeTo(decoder.writable);
      const reader = decoder.readable.getReader();
  
      const { value, done } = await reader.read(); 
      reader.releaseLock();
  
      if (value) {
        const result = JSON.parse(value.trim());
        return result;
      }
    } catch (err) {
      console.error("Failed to read from Arduino:", err);
    }
  
    return null;
}

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