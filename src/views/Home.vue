<template>
  <div class=startpage>
    <el-select v-model="wordcount"  v-show='total==0' placeholder="select count of words">
      <el-option
        v-for="item in options"
        :key="item"
        :label="item"
        :value="item">
      </el-option>
    </el-select>
    <el-progress type="dashboard" :width=250 v-show='total!=0' :percentage="Math.floor(complete*100/(total))"  ></el-progress>
    <br/>
    <div class='foot' >
      <el-button type="primary" style="width:80%;height:60px;margin:0" v-bind:disabled="startbutton" :loading="loading" @click="getstart">{{startbuttonstring}} </el-button>
      <el-button type="success" style="width:80%;height:60px;margin:5px 0" v-if="startbutton&!loading" @click="summarize">重置任务 </el-button>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import axios  from 'axios'
export default {
  name: 'home',
  components: {
  },
  data:function(){return{
      options:[50,100,150,200,300,500,700],
      wordcount:100,
      loading:true,
      total:10,
      complete:0,
      startbutton:false,
      startbuttonstring:'开始学习',
      test:'',
    }
  },
  methods:{
      summarize(){
        axios.get('/dictapi/summarize/'+this.$root.user)
          .then((response)=>{
            this.$router.go(0);
          })
      },
      getstart(){
        this.loading=true
        var user=this.$root.user
        if(this.$root.words==null || this.$root.queue==null){
          console.log('Home: load words')
          axios.get('dictapi/get_words/'+user+'/'+this.wordcount)
            .then((response)=>{
              // console.log(response.data)
                this.$root.words=response.data
                let words=response.data
                var arr=[[],[],[]]
                for(var w in words){
                  let dc=words[w].displaycount
                  if(dc>=4){
                    dc=2
                  }else if(dc>0&dc<4){
                    dc=1
                  }
                  arr[dc].push(w)
                }
                var interval=Math.ceil(arr[0].length*0.8/arr[1].length)
                for(var i=0;i<arr[1].length;i++){
                  arr[0].splice((i+1)*interval,0,arr[1][i])
                }
                
                this.$root.queue=arr[0]
                // console.log(arr[0])
                this.loading=false
                this.$router.push('word')
              }
            )
        }else{
          this.$router.push('word')
        }
        
      }
  },
  mounted(){
        var user=this.$root.user
        // this.test='kaishi'
        axios.get('/dictapi/get_state/'+user)
        // axios.get('http://baidu.com')
        .then( (response) =>{
            var d=response.data;
            // console.log(d.complete)
            this.total=d.total;
            this.complete=d.complete;
            this.loading=false;
            if(this.total>0){
              this.startbuttonstring='开始学习'+ this.complete+'/'+this.total
              if(this.total==this.complete){
                this.startbuttonstring='今天任务完成'
                this.startbutton=true
              }
            }
            
        })
        .catch( (error)=> {
          console.log(error);
          // this.test='nimei'+error
        });
        
      }
}


</script>

<style>
.startpage{
  width: 100%;
  text-align:center;
}
.foot{
    position: fixed; bottom:0;text-align:center;width:100%;background-color: aliceblue;margin: 5px 0;
  }
</style>