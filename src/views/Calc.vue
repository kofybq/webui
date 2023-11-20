<template>
  <div class="about">

  <el-select id='select' v-model="pattern" placeholder="请选择" size='medium' @change="reset">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select> 

    <div style='font-size:160px;letter-spacing:20px'>{{express}}  {{input}} 
    <i v-if="show&&correct" class="el-icon-check"  style="font-size:120px;color:green" ></i> 
    <i v-if="show&&!correct" style="font-size:120px;color:red"  class="el-icon-close"></i><div v-if="show&&!correct" style="color:gray;font-size:40px;letter-spacing:0px">the right anwser is {{anwser}}</div></div>
    
    <div  style="font-size:120px">
      <i class="el-icon-circle-check"  style="font-size:140px;color:green" ></i> {{yes}} 
      <i style="font-size:140px;color:red"  class="el-icon-circle-close"></i> {{no}} 
      <el-button id='express'  type="warn" round @click="start">{{status_word}}</el-button>
      <span style="font-size:20px">{{now_time.toFixed(2)}}</span>

  <!-- <el-popover
    placement="right"
    width="950"
    trigger="focus"
    v-model="visible">
    <img :src="require('@/assets/9_9.jpg')"  width=950px>
    <el-button   slot="reference" type="warning" icon="el-icon-star-off" style="font-size:120px;margin-left:80px" circle></el-button>
  </el-popover> -->
    
    </div>
<el-button type="primary" round @click="get_random_numbers">生成数字</el-button>
<div v-if="show_random_number" style='font-size:120px;letter-spacing:0px;width:100%;display:block'>
    <span v-for='c in random_numbers' style="margin:0 30px;float:left">{{c}}</span>
</div>
<div style="display:block;float:left">
<el-button type="primary" round @click="get_random_clock">生成时钟</el-button>

<div  v-if="show_clock" style="display:block;float:left;width:100%">
 <clock v-for='c in random_time'  :time="c"></clock>
</div>


</div>
    <div v-for='c in wronglist' class='content'>
                      {{c[0]}} {{c[1]}} 
                    </div>
    </div>
  </div>
 

</template>
<style>
/* .el-input__inner{
//       height: 264px;
//       font-size:200px;
 }*/
.about {
  -webkit-touch-callout: none; /*系统默认菜单被禁用*/
  -webkit-user-select: none; /*webkit浏览器*/
  -khtml-user-select: none; /*早期浏览器*/
  -moz-user-select: none; /*火狐*/
  -ms-user-select: none; /*IE10*/
  user-select: none;
}
</style>
<script>
// import params from "../../public/params.config.json" //"@/assets/1.json"
// import params from
import Clock from 'vue-clock2'
// import Vue from 'vue'
// let params=this.params
export default {
  
  components: { Clock},
  data() {
    return {
      time:'10:40',
      ranges: this.params.ranges,
      express: "",
      input: "",
      yes: 0,
      no: 0,
      show: false,
      show_clock:false,
      random_time:[],
      random_numbers:[],
      show_random_number:false,
      random_number_range:this.params.random_number_range,
      correct: true,
      anwser: 0,
      wronglist: [],
      imgUrl: require("@/assets/9_9.jpg"),
      visible: false,
      options: [
        {
          value: "++",
          label: "++",
        },
        {
          value: "--",
          label: "--",
        },
        {
          value: "+-",
          label: "+-",
        },
        {
          value: "*",
          label: "*",
        },
        {
          value: "/",
          label: "÷",
        },
        {
          value: "*/",
          label: "*/",
        },
      ],
      pattern: this.params.pattern,
      n_paramas: this.params.n_paramas,
      now_time:0,
      start_status:false,
      status_word:'开始',
      interval:null
    };
  },
  methods: {
    start(){
      this.start_status=!this.start_status
      if(this.start_status){
        this.now_time=0
        this.yes=0
        this.no=0
        var aa=this
        this.status_word='结束'
        this.reset()
        this.interval=setInterval(function(){aa.now_time+=0.05},50);
        document.getElementById('express').blur()
      }else{
        this.interval=clearInterval(this.interval)  
        this.status_word='开始'
        document.getElementById('express').blur()
        this.wronglist.push(['结束计时', this.now_time.toFixed(2)]);
        this.wronglist.push(['答对', this.yes]);
        this.wronglist.push(['答错', this.no])
      }
      
    },
    reset() {
      var qna = this.question();
      this.express = qna[0];
      this.anwser = qna[1];
      this.input = "";
    },
    question() {
      console.log(this.pattern)
      switch (this.pattern) {
        case "++":
          return this.question_plus(["+", "+"]);
        case "--":
          return this.question_plus(["-", "-"]);
        case "+-":
          return this.question_plus(["+", "-"]);
        case "*":
          return this.question_mult();
        case "/":
          return this.question_divide();
        case "*/":
          return this.question_divide_mult();
      }

      // return this.question_mult()
    },
    question_plus(signs) {
      // var signs=['+','+']
      var signindex = Math.floor(Math.random() * 2);
      var signindex2 = Math.floor(Math.random() * 2);
      var sign = signs[signindex];
      var sign2 = signs[signindex2];
      var n1 =
        Math.floor(Math.random() * this.ranges[0][0]) + this.ranges[0][1];
      var n2 =
        Math.floor(Math.random() * this.ranges[1][0]) + this.ranges[1][1];
      var n3 =
        Math.floor(Math.random() * this.ranges[2][0]) + this.ranges[2][1];
      n1 = n1 * 1;
      n2 = n2 * 1;
      n3 = n3 * 1;
      if (sign == "-") {
        if (n1 < n2) {
          var tmp = n1;
          n1 = n2;
          n2 = tmp;
        }
      }

      var express = n1 + sign + n2;
      if (this.n_paramas == 3) {
        express += sign2 + n3;
      }

      var anwser = eval(express);
      return [express + "=", anwser];
    },
    question_mult() {
      var n1 = Math.floor(Math.random() * 8) + 2;
      var n2 = Math.floor(Math.random() * 8) + 3;

      var express = n1 + "*" + n2;
      var anwser = eval(express);
      return [express + "=", anwser];
    },
    question_divide() {
      var n1 = Math.floor(Math.random() * 8) + 2;
      var n2 = Math.floor(Math.random() * 8) + 3;
      var rr=n1*n2
      var express = rr + "÷" + n2;
      var anwser = n1;
      return [express + "=", anwser];
    },
    question_divide_mult() {
      var signs=['*','÷']
      var signindex = Math.floor(Math.random() * 2);
      var signindex2 = Math.floor(Math.random() * 2);
      console.log(signindex)
      var sign = signs[signindex];
      var sign2 = signs[signindex2];
      if(sign=='*'){
        return this.question_mult()
      }else{
        return this.question_divide()
      }

    },
    get_random_numbers(){
      this.show_random_number=true
      this.random_numbers=[]
      for(var i=0;i<5;i++){
        var r=Math.floor(Math.random() * this.random_number_range[0]) + this.random_number_range[1]; 
        this.random_numbers.push(r)
      }
    },
    get_random_clock(){
      this.show_clock=true
      this.random_time=[]
      for(var i=0;i<5;i++){
        var r=Math.floor(Math.random() * 12) +":"+ Math.floor(Math.random() * 60) 
        this.random_time.push(r)
      }
    }
  },
  created: function () {
    window.calc=this
    var _self = this;
    //set the hotkey
    // console.log(this.ranges)
    this.reset()
    
    document.onkeydown = function (e) {
      //禁止F5
      var key = window.event.keyCode;
      if (key == 116) {
        return false;
      }
    };
    document.oncontextmenu = function (e) {
      //禁止右键弹出菜单
      return false;
    };
    document.onkeyup = function (e) {
      var key = window.event.keyCode;
      console.log(key)
      if (key >= 48 && key <= 57) {
        //数字0-9
        if (!_self.show) _self.input += key - 48 + "";
      }
      if (key ==189) {
        //数字0-9
        if (!_self.show) _self.input += "-";
      }


      if (key == 27) {
        //esc
        if (_self.show) {
          _self.show = false;
          _self.reset();
        } else {
          _self.input = "";
        }
      }
      if (key == 13) {
        //enter
        if (_self.show) {
          _self.show = false;
          _self.reset();
          return;
        }
        if (_self.input == "") {
          return;
        }
        var result = _self.input;
        if(typeof(_self.anwser)=='number'){
          result = Number(_self.input);
        }
        // alert(result)
        if (result == _self.anwser) {
          //right
          _self.yes += 1;
          // _self.reset()
          _self.correct = true;
        } else {
          //wrong
          _self.no += 1;
          _self.correct = false;
          _self.wronglist.push([_self.express, result]);
        }
        _self.show = true;
      }
      if (key == 8) {
        //退格
        if (!_self.show) {
          _self.input = _self.input.slice(0, -1);
        }
      }
      return;
    };
  },
};
//style='width:200px;font-size:200px;height:300px'
</script>

