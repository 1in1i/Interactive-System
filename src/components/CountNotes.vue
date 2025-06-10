<template>
  <div class="count-notes">
      <h1 class="title">Count Notes</h1>
       <div class="sidebar">
        <div class="instructions">
          <h2 class="instruction">Instructions</h2>
          <p>Instructions</p>
        </div>
        <div class="records">
          <h2 class="record">Records</h2>
          <p>Mistakes: 0</p>
          <p>Time: 01:00</p>
        </div>
      </div>
    
      <div class="question-bar">
        <p style="font-size: 18px;">How many 'Do' notes did you hear?</p>
        <div class="input-group">
            <el-input v-model="input" placeholder="Please input number" style="width: 160px;"></el-input>
            <el-button type="success">Submit</el-button>
        </div>
      </div>
      <div class="colorButtons">
        <el-row>
          <el-button class="colorButton" @click="appendToSequence('1'); playNote('do')" >Do</el-button>
          <el-button class="colorButton" @click="appendToSequence('2'); playNote('re')">Re</el-button>
          <el-button class="colorButton" @click="appendToSequence('3'); playNote('mi')">Mi</el-button>
          <el-button class="colorButton" @click="appendToSequence('4'); playNote('fa')">Fa</el-button>
          <el-button class="colorButton" @click="appendToSequence('5'); playNote('sol')">Sol</el-button>
          <el-button class="colorButton" @click="appendToSequence('6'); playNote('la')">La</el-button>
          <el-button class="colorButton" @click="appendToSequence('7'); playNote('si')">Si</el-button>
        </el-row>
      </div>

      <div class="buttons">
        <el-button class="button"
        :type="isRunning ? 'danger' : 'success'"
        round
        @click="controlGame">
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
      input:'',
    //   currentStars: 1,
    //   maxStars: 3,
      gameName: 'Replicate Number',
      serialPort: null,
      inputSequence: '',
      // isInputting: false
    }
  },
  methods: {
    playNote(note) {
     const audio = new Audio(`../../public/sound/${note}.mp3`);
      audio.play().catch(e => console.error("erroe:", e));
    },
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
//   this.currentStars = parseInt(sessionStorage.getItem(`stars-${this.gameName}`)) || 0;
  }
}
</script>
<style scoped>
.count-notes {
  display: grid;
  background: linear-gradient(to bottom, #fdfbfb, #ebedee);
  grid-template-columns: 1fr 250px;
  grid-template-rows: auto auto auto auto auto auto;
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
  grid-row:  4 / 6;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 2rem;
}

.colorButtons {
  grid-column: 1 / 3;
  grid-row:  3 / 6 ;
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

.colorButton {
  margin-right: -12px;
  margin-bottom: 2px;
  width: 50px;
  height: 90px;
  font-size: 16px;
  padding: 20px 20px;
  text-align: center;
}
.question-bar {
  grid-column: 1 / 3;
  grid-row:  2 / 6 ;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 2rem;
}
.input-group {
    display: flex;
    gap: 15px;
    margin-top: 10px;
}
</style>