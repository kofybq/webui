<template>
  <div v-if='detail!=null'>
      <div v-show="step1"  >
          <el-card class="box-card">
            <div slot="header" class="clearfix" style="padding:0">
              <div>
              <span style="font-size:36px;font-weight:600;margin:0 20px">{{detail.word}}</span> 
              <span style="font-size:14px;color:#969696;margin:0 10px" >[{{detail.phonetic}}]</span> 
              <i  @click="palyaudio()"  style="font-size:30px;" class="el-icon-microphone"></i>
              </div>
            </div>
            <div>
                <span><i class="el-icon-s-flag" style='color:#990033;font-size:8px' v-show="detail.oxford==1"></i></span>
                <span><i v-for="i in detail.collins "  class="el-icon-star-on" style='color:#FFCC66;font-size:8px'></i></span>
                <span class='text'>[{{detail.tag}}]</span> 
                
              </div>

          </el-card>
          <div class='foot' >
            <div>
              <el-button type="success" ref="simple" style="width:80%;height:60px;margin:0" v-bind:disabled="!(words[word].state==0&words[word].displaycount==0)" v-show="words[word].state==0&words[word].displaycount==0" @click="state=3;step1=false">太简单</el-button>
            </div>
            <div><el-button type="danger"  style="width:80%;height:60px;margin:10px 0" @click="state=1;step1=false">不认识</el-button> </div>
            <div><el-button type="primary" style="width:80%;height:60px;margin:0" @click="state=2;step1=false">认识</el-button></div>
          </div>
      </div>




      <div v-show="!step1">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <div>
              <span style="font-size:36px;font-weight:600;margin:0 20px">{{detail.word}}</span> 
              <span style="font-size:14px;color:#969696;margin:0 10px" >[{{detail.phonetic}}]</span> 
              <i   @click="palyaudio()" style="font-size:30px;"  class="el-icon-microphone"></i>
              
              </div>
              <div>
                <span><i class="el-icon-s-flag" style='color:#990033;font-size:8px' v-show="detail.oxford==1"></i></span>
                <span><i v-for="i in detail.collins "  class="el-icon-star-on" style='color:#FFCC66;font-size:8px'></i></span>
                <span class='text'>[{{detail.tag}}]</span> 
                <el-button style="margin: 0px 0;font-size:10px;float:right" v-show="state==3||this.state==2" type="text" @click="state=1">取消认识</el-button>
              </div>
              <div v-if="detail.exchange!=''" style="font-size:14px;color:808080">{{detail.exchange}}</div>
              
            </div>
            <div class="text item" >
              <el-collapse v-model="activeNames">
                <el-collapse-item title="英文释义" name="1">
                  <span  v-html="definition"></span>
                </el-collapse-item>
                <el-collapse-item title="解释" name="2">
                  <span  v-html="translate" style="font-size:16px;font-weight:800"></span>
                </el-collapse-item>
                <el-collapse-item title="同义" name="3">
                  <div v-for='r in detail.resemble' class='resemble'>
                    <!-- <div style="background-color: #CCFFFF;border-radius:5px"><span v-for='w in r.words' class='words'>{{w}}</span></div> -->
                    <div v-for='c in r.content' class='content'>
                      {{c}}
                    </div>
                    <el-divider></el-divider>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
            
          </el-card>
        
          <div>
            <div class='foot' ><el-button type="primary" @click="nextword" style="width:80%;height:60px; margin:0">下一个</el-button></div>
          </div>

        
      </div>

  </div>
</template>


<script>
import axios  from 'axios'
import Base64 from 'js-base64';
export default {
    components:{},
    data:function(){return {
          word:null,
          words:null,
          queue:null,
          step1:true,
          state:0,
          detail:null,
          sounds:{},
          cplay:'',
          activeNames:['2','3'],
          details:{},
        }},
    watch:{
          word:function(val){
            if(val in this.details){
              this.detail=this.details[val]
              // this.palyaudio()
            }else{
              this.detail=null
              axios.get('dictapi/get_word_detail/'+this.word).then(response=>{this.detail=response.data;this.details[val]=response.data})
            }
            
            
          },
          detail:function(val){
            this.cplay=this.sounds[this.word].networkState
            this.palyaudio()
          },
          step1:function(val){
            if(val==false){
              this.palyaudio()
            }
            
          }
    },
    computed:{
          definition:function(){
              return this.detail.definition.replace('\n','\<br/\>')
          },
          translate:function(){
              return this.detail.translation.replace('\n','\<br/\>')
          },
          canplay:function(){
            // console.log(this.sounds[this.word].readyState)
            // if(this.word in this.sounds){
            //   if('readyState' in this.sounds[this.word]){
            //     if(this.sounds[this.word].readyState !=0){
            //       return true
            //     }
            //   }
            // }
            // return false
            // return true
            },
    },
    methods:{
    
    palyaudio(){
              // console.log(this.word)
              // console.log(this.sounds[this.word].currentTime)
              if(this.sounds[this.word].readyState!=0){//0:fail \
                // this.sounds[this.word].pause()
                this.sounds[this.word].currentTime=0
                this.sounds[this.word].play()
              }
            },
    nextword(){
            let w=this.$root.queue.shift()
            
            if(this.state==3){
              // console.log(this.$root.words[this.word])
              this.$root.words[this.word].displaycount=4
              this.$root.words[this.word].okcount=5
            }
            if(this.state==2){
              if(this.$root.words[this.word].displaycount==0){
                this.$root.words[this.word].displaycount=4
                this.$root.words[this.word].okcount=4
              }else{
                this.$root.words[this.word].displaycount+=1
                this.$root.words[this.word].okcount+=1
              }
            }
            if(this.state==1){
              this.$root.words[this.word].displaycount+=1
            }

            if(this.$root.words[this.word].displaycount<4){
              let l=this.$root.queue.length
              let interval=Math.max(Math.floor(l/3),1)
              this.$root.queue.splice(interval*this.$root.words[this.word].displaycount,0,this.word)
            }
            axios.get('dictapi/update_schedule/'+this.$root.user+'/'+this.word+'/'+this.$root.words[this.word].displaycount+'/'+this.$root.words[this.word].okcount)
            .then((response)=>{
          //update oneday shcedule

              if(this.$root.queue.length<=0){
                this.$router.push('/')
                // console.log('congratulation! done!')
              }else{
                this.word=this.$root.queue[0]
                this.step1=true
                if(this.$root.queue.length>0){//preload the next word
                  let nextw=this.$root.queue[1]
                  if(!(nextw in this.details)){
                    axios.get('dictapi/get_word_detail/'+nextw).then(response=>{this.details[nextw]=response.data})
                  }
                  if(!(nextw in this.sounds)){
                    var sound = new Audio();
                    sound.src=axios.defaults.baseURL+'/mp3/'+nextw+'.mp3'
                    this.sounds[nextw]=sound
                  }
                }
              }
            })
            
            
          
         },
    },
    created:function(){
      console.log('created')
        if(this.$root.words==null || this.$root.queue==null ||this.$root.queue.length==0){
          console.log('WORD:back to home')
          this.$router.push('/')
          return
          
        }
        this.word=this.$root.queue[0]
        this.words=this.$root.words
        this.queue=this.$root.queue
        
        
        var sound = new Audio();
        sound.src=axios.defaults.baseURL+'/mp3/'+this.word+'.mp3'
        this.sounds[this.word]=sound

        axios.get('dictapi/get_word_detail/'+this.word).then(response=>{this.detail=response.data;this.details[this.word]=response.data})

        if(this.$root.queue.length>0){//preload the next word
                let nextw=this.$root.queue[1]
                if(!(nextw in this.details)){
                  axios.get('dictapi/get_word_detail/'+nextw).then(response=>{this.details[nextw]=response.data})
                }
                if(!(nextw in this.sounds)){
                  var sound = new Audio();
                  sound.src=axios.defaults.baseURL+'/mp3/'+nextw+'.mp3'
                  this.sounds[nextw]=sound
                }
          }


        // for(var ww in this.$root.queue){
        //   var sound = new Audio();
        //   // console.log(sound)
        //   sound.src='dictapi/get_word_mp3/'+this.$root.queue[ww]
        //   this.sounds[this.$root.queue[ww]]=sound
        // }

        ////set the hotkey
        // var _self = this;
        //     document.onkeyup = function(e){
        //       // console.log(_self)
        //       var key = window.event.keyCode;
        //       if(_self.step1){
        //         if(key==39&&!_self.$refs.simple.disabled){
        //           // 39:right to0 simple
        //           _self.state=3;_self.step1=false
        //         }
        //         if(key==40){
        //           //40 down   recognize
        //           _self.state=2;_self.step1=false
        //         }
        //         if(key==38){
        //           //38 up   too hard
        //           _self.state=1;_self.step1=false
        //         }
        //         return
        //       }
        //       if(!_self.step1){
        //         if(key==39){
        //           _self.nextword()
        //         }
        //       }   
        //     }
      },
      destroyed(){
        document.onkeyup=null
      } , 
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
<style>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 12px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 100%;
    margin-bottom: 60px;
  }
    .resemble{
      margin-bottom: 20px;
    }
  .resemble .words{
    font-size: 16px;
    font-weight: 1000;
    margin:0 10px;
  }
  .resemble .content{
    margin-bottom:10px;
    line-height: 130%
  }
  .el-card__header{
    padding: 5px;
  }
  .foot{
    position: fixed; bottom:0;text-align:center;width:100%;background-color: aliceblue;margin: 5px 0;
  }
</style>
