<!--
 * @Author: kofybq 404633218@qq.com
 * @Date: 2022-08-31 14:22:20
 * @LastEditors: kofybq 404633218@qq.com
 * @LastEditTime: 2022-12-05 20:56:09
 * @FilePath: \src\views\Panorama copy.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--
 * @Author: kofybq 404633218@qq.com
 * @Date: 2022-05-16 00:00:56
 * @LastEditors: kofybq 404633218@qq.com
 * @LastEditTime: 2022-05-17 02:25:04
 * @FilePath: \src\views\Panorama.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
<div>
        
        <div style="display: inline-block;">
            <span style="display: inline-block;font: 14px Arial;margin-right:0px;width:170px" v-for="i in main_index_data">
                <div style="width: 50px;text-overflow: ellipsis; white-space: nowrap;display: block" >{{i['name']}} <span style="color:chocolate" v-if="['上证指数','深证成指'].includes(i.name)">{{ Math.round(i['amount']/1e+8) }}亿</span></div> 
                <span :style="{color: i.diff >= 0 ? 'red' : 'green'}"> <span style="opacity: 0.9;margin-left:0px">{{ i.quote>1000 ?Math.round(i['quote']):i['quote']}}</span>
                <i class="el-icon-caret-top" v-if="i.diff >= 0 "></i> 
                <i class="el-icon-caret-bottom" v-if="i.diff < 0 "></i> 
                <span style="font:bold Arial">{{i['diff_rate']}}%</span>
                <span style="opacity: 0.7;">[{{ i['diff'] }}]</span></span>
            </span>
            <span style="display: inline-block;font: 14px Arial;margin-right:0px;width:170px">
                <div style="width: 50px;text-overflow: ellipsis; white-space: nowrap;display: block" >涨跌统计 </div> 
                <span style="color:red"><i class="el-icon-caret-top" ></i> {{ up_down_count.up }}</span>
                <span style="color:green"><i class="el-icon-caret-bottom" ></i> {{ up_down_count.down }}</span>
                <span style="color:gray"><i class="el-icon-caret-right" ></i>{{ up_down_count.even }}</span>
            </span>
            <span style="display: inline-block;font: 14px Arial;margin-right:0px;width:170px" v-for="i in money_flow">
                <div style="width: 50px;text-overflow: ellipsis; white-space: nowrap;display: block" >{{i.name}}(亿) </div> 
                沪<span :style="{color: i.sh >= 0 ? 'red' : 'green'}"> {{ Math.round(i.sh/1e+4) }}</span>&nbsp;
                深<span :style="{color: i.sz >= 0 ? 'red' : 'green'}"> {{ Math.round(i.sz/1e+4) }}</span>&nbsp;
                总<span :style="{color: (i.sz+i.sh) >= 0 ? 'red' : 'green'}"> {{ Math.round((i.sz+i.sh)/1e+4) }}</span>
            </span>
            <span style="display: inline-block;font: 14px Arial;margin-right:0px;width:170px">
                <div style="width: 50px;text-overflow: ellipsis; white-space: nowrap;display: block" >主力流向(亿) </div> 
                成交<span style="color:purple" > {{ zhuli.f6 }}</span>&nbsp;
                主力<span :style="{color: zhuli >= 0 ? 'red' : 'green'}"> {{ zhuli.f62 }}</span>&nbsp;
                
            </span>

        </div>
        <div style="margin-bottom:8px">
            <div style="display: inline-block;vertical-align:middle">
                <el-select v-model="graph_struct" placeholder="请选择" @change="get_graph" style="width:150px">
                    <el-option value='industry' label='行业'></el-option>
                    <el-option value='market_cap' label='市值'></el-option>
                </el-select>
                <el-select v-model="group1" placeholder="请选择" style="width:200px">
                    <el-option value='3' :label="'一级[3]:'+column3"></el-option>
                    <el-option value='2' :label="'一级[2]:'+column2"></el-option>
                    <el-option value='0' label='一级:等权0'></el-option>
                </el-select>
                <el-select v-model="group2" placeholder="请选择" style="width:200px">
                    <el-option value='3' :label="'二级[3]:'+column3"></el-option>
                    <el-option value='2' :label="'二级[2]:'+column2"></el-option>
                    <el-option value='0' label='二级:等权0'></el-option>
                </el-select>

                  
            </div>
            <div style="display: inline-block;vertical-align:middle">
                
                <el-button ref='start' :type="status_type" :icon="status_word" style="font-size:2rem;padding:3px;margin:0 10px" @click="start" circle></el-button>
            </div>
            <el-date-picker
                v-model="date_"
                style='width:140px;'
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
            </el-date-picker>

            <div style="display: inline-block;vertical-align:middle">
                <el-input style="width:200px"  placeholder="1"  v-model="column1" ></el-input>
                <el-select v-model="unit1" placeholder="请选择" style="width:80px">
                    <el-option value='%' label='%'></el-option>
                    <el-option value='none' label='none'></el-option>
                    <el-option value='亿' label='亿'></el-option>
                    <el-option value='万' label='万'></el-option>
                </el-select>
                <el-input style="width:200px"  placeholder="2"  v-model="column2" ></el-input>
                <el-select v-model="unit2" placeholder="请选择" style="width:80px">
                    <el-option value='%' label='%'></el-option>
                    <el-option value='none' label='none'></el-option>
                    <el-option value='亿' label='亿'></el-option>
                    <el-option value='万' label='万'></el-option>
                </el-select>
                <el-input style="width:200px"  placeholder="3"  v-model="column3" ></el-input>
                <el-select v-model="unit3" placeholder="请选择" style="width:80px">
                    <el-option value='%' label='%'></el-option>
                    <el-option value='none' label='none'></el-option>
                    <el-option value='亿' label='亿'></el-option>
                    <el-option value='万' label='万'></el-option>
                </el-select>

                <el-button size="big"  @click="get_rolling()"><i class="el-icon-refresh"></i>Load</el-button>
                <el-switch
                    v-model="midpoint"
                    inactive-text="0中点">
                </el-switch>
                <el-button id='express'  type="warn" @click="tips=!tips" icon="el-icon-date" ></el-button>
            </div>
        </div>
        <div >
            <div style="width:20%;height:830px;float:left">
                <div style="display: block;height:100px">
                    <el-badge :value="i.length" class="item" :hidden="i.length==0"  style="width:30px;margin:10px" v-for="i,v in event_date">
                        <el-button size="small" @click="scheduleVisible=true;schedule_detail=i;schedule_date=v" :style="{'border-color':v==new Date(new Date()- (new Date().getTimezoneOffset()*60*1000)).toISOString().split('T')[0]?'red':''}">{{v.substring(8,10)}}</el-button>
                    </el-badge>
                    <el-badge  class="item" :hidden="true"  style="width:30px;margin:10px" >
                        <el-button size="small" @click="get_schedule" ><i class="el-icon-refresh-left" ></i></el-button>
                    </el-badge>
                    <el-dialog
                        :visible.sync="scheduleVisible"
                        :title="schedule_date"
                        width="50%">
                        <ul class="economics">
                        <li v-for="i in schedule_detail" v-if="i.type=='economics'" style="padding:10px;">
                                <span style="color:purple;width:40px;display:inline-block">{{ i.pub_time_unix }}</span>
                                <span :style="{color: i.country =='中国' ? 'red' : 'blue',width:'40px',display:'inline-block'}">{{ i.country }}</span>
                                <span style="color:darkcyan;width:350px;display:inline-block">{{i.name}} </span>
                                前值:<span style="color:brown;width:60px;display:inline-block">{{ i.previous }} </span>
                                预期:<span style="color:brown;width:60px;display:inline-block">{{ i.consensus }} </span>
                                公布值:<span style="color:brown;width:60px;display:inline-block">{{ i.actual }}</span>
                                <span style="width:20px;display:inline-block"><a  target="_blank" :href="'https://rili.jin10.com/detail/'+i.id"><i class="el-icon-s-data" ></i></a></span>
                        </li>
                        <li>--------------event--------------</li>
                        <li v-for="i in schedule_detail" v-if="i.type=='event'"  style="padding:10px;">
                            <span style="color:purple;width:40px;display:inline-block">{{ i.event_time.substring(12,16) }} </span>
                           <span :style="{color: i.country =='中国' ? 'red' : 'blue',width:'40px',display:'inline-block'}">{{ i.country }}</span>
                           <span style="color:darkcyan;width:350px;display:inline-block">{{ i.event_content }} </span>
                        </li>
                    </ul>
                        <span slot="footer" class="dialog-footer">
                        </span>
                    </el-dialog>
                </div>
                <div id='news' style="height:730px;float:left;align:center; overflow: auto;">
                    <div v-for="i,v in news_list_array" style="display:block; word-break: break-all;width:95%">
                        
                        <!--for gelonghui msg <h4 style="margin:10px 0;color:red"><span style="color:blueviolet">{{new Date(i[1]['createTimestamp']*1000).toTimeString().substring(0,5)}}</span> {{i[1]['title']}}</h4>
                        <span style="font-size:12px">{{i[1]['content']}}</span> -->

                        <h4 style="margin:10px 0;color:red"><span style="color:blueviolet">{{i[1]['showtime'].substring(11,20)}}</span> {{i[1]['title']}}</h4>
                        <span style="font-size:12px">{{i[1]['digest']}}</span>
                    </div>
                </div>
            </div>
            <div id='treemap' style="width:80%;height:830px;float:left">
                hello
            </div>

        </div>
        <el-drawer
                title="数据"
                :visible.sync="tips"
                :wrapperClosable="false"
                direction="ltr"
                :append-to-body="true"
                :modal="false"
                :size="400"
                class='drawer'
            >
            <el-collapse :value="Object.keys(columns)">
                <el-collapse-item
                  v-for="(v, i) in columns"
                  :title="i"
                  :name="i"
                >
                  <el-button
                    v-for="(v1, i1) in columns[i]"
                    type="warning"
                    style="
                      float: left;
                      font-size: 20px;
                      margin: 2px 3px;
                      padding: 5px;
                    "
                    @click="copy_to_clipboard(v1)"
                    >{{v1}}</el-button
                  >
                </el-collapse-item>
              </el-collapse>
        </el-drawer>
   
</div>
</template>
<style>
.economics li:hover{background-color:antiquewhite;}
</style>
<script>
import axios from "axios";
import * as echarts from "echarts";
import draggable from "vuedraggable";
import comm from "../js/common.js"
export default {
    name: "treemap",
    components: { draggable },
    data: function () {
        return {
            threads:{},
            scheduleVisible:false,
            schedule_detail:[],
            schedule_date:'',
            event_date:{'2023-09-06':[]},
            midpoint:true,
            unit1:'%',
            unit2:'亿',
            unit3:'亿',
            date_:(new Date()).toISOString().split('T')[0],
            group1:'3',
            group2:'3',
            option: {},
            codes:[],
            code_pos:{},
            cata_pos:{},
            chart:'',
            start_status:false,
            status_word:'el-icon-video-play',
            status_type:'success',//danger
            interval:10000,
            graph_struct:'industry',
            // columns:{'diff':1,'amount':2},
            emphasis:[],
            emphasis_cata:[],
            data_type:'quote',
            column1:'diff',
            column2:'amount',
            column3:'market_cap',
            news_list:{},
            news_list_array:[],
            main_index_data:[],
            zhuli:{},
            up_down_count:{},
            money_flow:{},
            tips:false,
            columns:{'0':['diff','amount_pct','amplitude','amount','market_cap','vol','streak','financing_diff','financing_buy','financing_sell','financing_diff_divide_amount','financing_diff_divide_remain'],
                    '5,10,20,60,120,240':['max_','min_','plus_','minus_','drawdown_','climbup_','capital_earn_','capital_loss_','earn_','loss_','plus_ratio_','plus_n_ratio_','netprofit_','pct_','amount_','plus_n_','average_price_','current_postion_'],
                    '5,10,20,60':['financing_diff_','financing_buy_sum_','financing_sell_sum_','financing_diff_divide_amount_','financing_diff_divide_remain_']},
            test:'',
        };
    },
    methods: {
    copy_to_clipboard(v1){comm.copy_to_clipboard(v1)},
    start(){
        this.start_status=!this.start_status
        if(this.start_status){
            var aa=this
            this.status_word='el-icon-video-pause'
            this.status_type='danger'
            aa.get_quotes('quote',{'diff':1,'amount':2})
            this.interval=setInterval(function(){aa.get_quotes('quote',{'diff':1,'amount':2})},5000);
        }else{
            this.interval=clearInterval(this.interval)  
            this.status_word='el-icon-video-play'
            this.status_type='success'
        }
      
    },
    get_schedule(){
        var treemap = this;
        var url='stockapi/get_schedule/'
        axios.get(url).then((response) => {
            treemap.event_date=response.data
        })

    },
    main_index(){
        var treemap = this;
        var url='stockapi/main_index/'
        axios.get(url).then((response) => {
            treemap.main_index_data=response.data[0]
            treemap.up_down_count=response.data[1]
            treemap.money_flow=response.data[2]
            treemap.zhuli=response.data[3]
        })
    },
    update_gelonghui_news(){
        var treemap = this;
        var url = "stockapi/get_gelonghui_message/";
        var newlist=[]
        var updated=false
        axios.get(url).then((response) => {
            newlist=response.data
            for(var i = newlist.length-1; i >=0; i--) {
                
                if(!(newlist[i]['id'] in treemap.news_list)){
                    treemap.news_list[newlist[i]['id']]=newlist[i]
                    // console.log(newlist[i]['id'])
                    updated=true
                }
            }
            if(updated){
                var tempalte=Object.entries(treemap.news_list).slice().reverse()
                treemap.news_list_array=tempalte
            } 
        })
        
    },
    update_gelonghui_news(){
        var treemap = this;
        var url = "stockapi/get_eastmoney_message/";
        var newlist=[]
        var updated=false
        axios.get(url).then((response) => {
            newlist=response.data
            for(var i = newlist.length-1; i >=0; i--) {
                
                if(!(newlist[i]['id'] in treemap.news_list)){
                    treemap.news_list[newlist[i]['id']]=newlist[i]
                    // console.log(newlist[i]['id'])
                    updated=true
                }
            }
            if(updated){
                var tempalte=Object.entries(treemap.news_list).slice().reverse()
                treemap.news_list_array=tempalte
            } 
        })
        
    },
    get_graph() {
        var treemap = this;
        var url = "stockapi/get_quotes_graph/"+this.graph_struct;
        axios.get(url).then((response) => {
            echarts.dispose(document.getElementById("treemap"));
            this.chart = echarts.init(document.getElementById("treemap"));
            var o = response.data;
            o['tooltip']['formatter']=function (params) {return params.name + '(' + params.value[4]+') <br/> 市值：'+comm.tofix(params.value[3],2)+'<br/>'+'成交:'+ comm.tofix(params.value[2],2)+'<br/>'+params.value[1]+'%';},
            treemap.option=o
            treemap.chart.setOption(o);
            treemap.codes=[]
            treemap.code_pos={}
            treemap.cata_pos={}
            //初始化 股票代码列表与位置
            var cata=treemap.option['series'][0]['data']
            var codes=[]
            for (var i = 0; i < cata.length; i++) {
                treemap.cata_pos[cata[i]['name']]=i

                for (var j = 0; j < cata[i]['children'].length; j++) {
                    codes.push(cata[i]['children'][j]['value'][4])
                    treemap.code_pos[cata[i]['children'][j]['value'][4]]=[i,j]
                }
            }
            this.codes=codes

            //emphasis item
            axios.get("stockapi/get_config/customlist").then((response) => {
                if (response.data != "") {
                    treemap.emphasis = response.data
                }
            });

            //emphasis_cata item
            axios.get("stockapi/get_config/emphasis_cata").then((response) => {
                if (response.data != "") {
                    treemap.emphasis_cata = response.data
                }
            });
        });
        
    },
    emphasize(newlist,oldlist){
        var treemap=this
        var cata=treemap.option['series'][0]['data']
        var emphasis=newlist//['600460','300059']
        for(var eps in oldlist){
            if(oldlist[eps] in treemap.code_pos){
                var pos=treemap.code_pos[oldlist[eps]]
                cata[pos[0]]['children'][pos[1]]['label']={}
                cata[pos[0]]['children'][pos[1]]['itemStyle']={}
            }

            
        }
        for(var eps in emphasis){
            if(emphasis[eps] in treemap.code_pos){
                var pos=treemap.code_pos[emphasis[eps]]
                cata[pos[0]]['children'][pos[1]]['label']={'color':'yellow'}
                cata[pos[0]]['children'][pos[1]]['itemStyle']={borderWidth:3,borderColor:'#f6e495'}
            }
        }
        treemap.chart.setOption(treemap.option)
    },

    emphasize_cata(newlist,oldlist){
        var treemap=this
        var cata=treemap.option['series'][0]['data']
        var emphasis=newlist//['600460','300059']
        for(var eps in oldlist){
            if(oldlist[eps] in treemap.cata_pos){
                var pos=treemap.cata_pos[oldlist[eps]]
                cata[pos]['label']={}
                cata[pos]['itemStyle']={}
            }

            
        }
        for(var eps in emphasis){
            if(emphasis[eps] in treemap.cata_pos){
                var pos=treemap.cata_pos[emphasis[eps]]
                cata[pos]['label']={'color':'yellow'}
                cata[pos]['itemStyle']={borderWidth:3,borderColor:'#f6e495'}
            }
        }
        treemap.chart.setOption(treemap.option)
    },

    get_rolling(){
        let columns=[this.column1,this.column2,this.column3]
        let c_={}
        for(let i=0;i<3;i++){
            if(columns[i]!=''){
                c_[columns[i]]=i+1
            }
        }
        this.get_quotes('rolling',c_)
    },
    get_quotes(data_type,columns){
        let treemap = this;
        let url = "stockapi/get_quotes/";
        let cata=this.option['series'][0]['data']
        // this.columns={'pct_20':1,'pct_10':2}
        
        // this.data_type='rolling'
        axios({
            method:"post",
            url:url,
            data:{codes:this.codes,
                    columns:columns,
                    date:this.date_,
                    data_type:data_type}
        }).then((response) => {
            var diff=response.data
            var data_1=[]
            //设置二级单元显示formater
            var units=[this.unit1,this.unit2,this.unit3]
            var coefficients=[1,1,1]
            for(var i=0;i<3;i++){
                if(units[i]=='none'){
                    if(i==0){
                        treemap.option.series[0]['label']['formatter']='{b}\n{@[1]}'
                        treemap.option.series[0]['levels'][1]['upperLabel']['formatter']='{b}:{@[1]}'
                    }
                }
                else if(units[i]=='亿'){
                    if(i==0){
                        treemap.option.series[0]['label']['formatter']='{b}\n{@[1]}亿'
                        treemap.option.series[0]['levels'][1]['upperLabel']['formatter']='{b}:{@[1]}亿'
                    }
                    coefficients[i]=1/1e+8
                }
                else if(units[i]=='万'){
                    if(i==0){
                        treemap.option.series[0]['label']['formatter']='{b}\n{@[1]}万'
                        treemap.option.series[0]['levels'][1]['upperLabel']['formatter']='{b}:{@[1]}万'
                    }
                    coefficients[i]=1/1e+4
                }
                else{
                    if(i==0){
                        treemap.option.series[0]['label']['formatter']='{b}\n{@[1]}%'
                        treemap.option.series[0]['levels'][1]['upperLabel']['formatter']='{b}:{@[1]}%'
                    }
                    coefficients[i]=100
                }
            }
            treemap.option['tooltip']['formatter']=function (params) {return params.name + '(' + params.value[4]+') <br/> '+
                                                    treemap.column3+':'+comm.tofix(params.value[3],2)+treemap.unit3+'<br/>'+
                                                    treemap.column2+':'+comm.tofix(params.value[2],2)+treemap.unit2+'<br/>'+
                                                    treemap.column1+':'+comm.tofix(params.value[1],2)+treemap.unit1;}
            for(var key in diff){//数据赋值
                var pos=this.code_pos[key]
                for(var column in columns){
                    var value=Number((diff[key][column]*coefficients[columns[column]-1]).toFixed(2))
                    cata[pos[0]]['children'][pos[1]]['value'][columns[column]]=value
                    if(columns[column]==1){
                        data_1.push(value)
                    }
                }
                //设置二级单元大小 选用哪个数据作为依据
                if(treemap.group2=='2'){
                    cata[pos[0]]['children'][pos[1]]['value'][0]=Math.abs(cata[pos[0]]['children'][pos[1]]['value'][2])+0.001
                }else if(treemap.group2=='3'){
                    cata[pos[0]]['children'][pos[1]]['value'][0]=Math.abs(cata[pos[0]]['children'][pos[1]]['value'][3])+0.001
                }else if(treemap.group2=='0'){
                    cata[pos[0]]['children'][pos[1]]['value'][0]=1
                }
            }
            //设置色彩范围
            var max_=Math.abs(comm.quantile(data_1,.02))
            var min_=Math.abs(comm.quantile(data_1,.98))
            var range_max=Math.ceil(Math.max(max_,min_))
            if(this.midpoint){
                this.option['visualMap']['min']=-range_max
                this.option['visualMap']['max']=range_max
            // console.log('rangmax:'+range_max)
            }else{
                this.option['visualMap']['min']=-max_
                this.option['visualMap']['max']=min_
            }
            
            
            

            for (var i = 0; i < cata.length; i++) {//数据汇总
                var sum_1=0//更新diff汇总
                var sum_2=0//更新一级汇总
                for (var j = 0; j < cata[i]['children'].length; j++){
                    sum_1+=cata[i]['children'][j]['value'][1]
                    
                    if(treemap.group1=='2'){
                        sum_2+= Math.abs(cata[i]['children'][j]['value'][2])
                    }else if(treemap.group1=='3'){
                        sum_2+=Math.abs(cata[i]['children'][j]['value'][3])
                    }else if(treemap.group1=='0'){
                        sum_2+=1/cata[i]['children'].length
                    }
                    
                }
                var mean_=Number((sum_1/cata[i]['children'].length).toFixed(2))
                // console.log(cata[i]['children'].length)
                cata[i]['value'][1]=mean_
                // if(treemap.group1=='1'){
                cata[i]['value'][0]=sum_2
                // }
            }
            treemap.chart.setOption(this.option);
        });
        
    },
    
    get_latest_date(){
            var url="stockapi/get_latest_date/"
            axios.get(url)
            .then((response) => {
                this.date_=response.data
                // this.get_graph(this.date_)
            }
            )
        },
    },
    watch:{
        emphasis(newlist,oldlist){
            this.emphasize(newlist,oldlist)
        },
        emphasis_cata(newlist,oldlist){
            this.emphasize_cata(newlist,oldlist)
        }
    },
    mounted() {
        window.treemap = this;
        this.get_latest_date()
        this.get_graph();
        console.log('!!!!!!!!!!!!!!!show time!!!!!!!!!!!!!!!')
        this.threads['main_index']=setInterval(this.main_index,8000);
        this.threads['update_gelonghui_news']=setInterval(this.update_gelonghui_news,60000);
        this.main_index()
        this.update_gelonghui_news()
        this.get_schedule()
    },
};
</script>
