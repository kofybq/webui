<!--
 * @Author: kofybq 404633218@qq.com
 * @Date: 2022-05-16 00:00:56
 * @LastEditors: kofybq 404633218@qq.com
 * @LastEditTime: 2022-09-27 14:59:28
 * @FilePath: \src\views\Panorama.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
<div>
    <div style="display: inline-block;vertical-align:middle">
        <el-date-picker
                v-model="date_"
                style='width:140px;'
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
        </el-date-picker>
        <el-input style="width:1400px"  placeholder="3"  v-model="columns_str" ></el-input>
            

        <el-select v-model="cata" filterable  placeholder="请选择">
            <el-option
                v-for="v in categorys"
                :label="v"
                :value="v">
            </el-option>
        </el-select>
        <el-button size="big"  @click="get_graph(date_)"><i class="el-icon-refresh"></i>Load</el-button>
    </div>
    <el-container>
        <el-main>
        <div v-bind:style="{display: 'block',width:'100%'}">
            <div 
            v-for="(v, i) in oneday_graph"
            v-bind:id="'@'+v"
            v-bind:style="{
                    display: 'block',
                    float: 'left',
                    margin: '2px 0 0 2px',
                    width:  '16%',
                    height: '250px',
                }">
            {{i}}
            </div>
        </div>
        
        <div v-for="(columns, i_) in columns"
        v-bind:style="{display: 'block',width:'100%'}">
            <div 
            v-for="(v, i) in period"
            v-bind:id="columns+'_'+v"
            v-bind:style="{
                    display: 'block',
                    float: 'left',
                    margin: '2px 0 0 2px',
                    width:  '16%',
                    height: '250px',
                }">
            {{i}}
            </div>
        </div>
        </el-main>
    </el-container>
</div>
</template>
<script>
import axios from "axios";
import * as echarts from "echarts";
import draggable from "vuedraggable";
export default {
    name: "panorama",
    components: { draggable },
    data: function () {
        return {
            cata:'all',
            date_:(new Date()).toISOString().split('T')[0],
            period:[5,10,20,60,120,240],
            columns_str:'pct,averageprice,pos,max,min,drawdown,climbup,minpos,maxpos',
            oneday_graph_str:'diff,amount_pct,streak,average_pct,amplitude,open2close',
            oneday_graph:[],
            columns:['pct','averageprice','pos','max','min','drawdown','climbup','minpos','maxpos'],
            myCharts:{},
            options: {},
            categorys:[],
        }
    },
    methods: {
        
        get_graph(date) {
            this.columns=this.columns_str.split(',')
            this.oneday_graph=this.oneday_graph_str.split(',')
            var graphs= []
            for (var i = 0; i < this.columns.length; i++) {
                for (var j = 0; j < this.period.length; j++) {
                    graphs.push(this.columns[i]+'_'+this.period[j])
                }
            }
            for (var i = 0; i < this.oneday_graph.length; i++) {
                    graphs.push('@'+this.oneday_graph[i])
            }
            var graph_strs_encode=window.btoa(graphs.join('|'))
            console.log(graphs.join('|'))
            var panorama = this;
            var url="stockapi/get_panorama/"+this.cata+"/" + date + "/" + graph_strs_encode
            console.log(url)
            axios
            .get(url)
            .then((response) => {
              for (var i in graphs) {
                console.log(graphs[i])
                echarts.dispose(document.getElementById(graphs[i]));
                panorama.myCharts[graphs[i]] = echarts.init(document.getElementById(graphs[i]));
                var o=response.data[graphs[i]]
                o['title']= {
                    text: (parseInt(i)+1),
                    x: 'left'
                  }
                panorama.myCharts[graphs[i]] .setOption(o);
                panorama.options[graphs[i]] = o;
                // console.log(i)
              }
            });
        },
        get_latest_date(){
            var url="stockapi/get_latest_date/"
            axios.get(url)
            .then((response) => {
                this.date_=response.data
                this.get_graph(this.date_)
            }
            )
        },
        get_categorys(){
            var url="stockapi/get_category/"
            var panorama = this;
            axios
            .get(url)
            .then((response) => {
                panorama.categorys=response.data
            })
        },
    },
    mounted() {
        window.panorama = this;
        this.get_latest_date()
        this.get_categorys()
        // this.get_graph(this.date)
    },

}
</script>
