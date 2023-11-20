<!--
 * @Author: kofybq 404633218@qq.com
 * @Date: 2022-06-07 10:16:15
 * @LastEditors: kofybq 404633218@qq.com
 * @LastEditTime: 2022-10-14 00:02:51
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
    <el-container>
      <el-container>
        <el-main>
          <div
            id="maingraph"
            style="display: block; width: 100%; height: 800px"
          >
            main graph
          </div>
        </el-main>
      </el-container>
      <el-aside width="30%">
        <div style="width: 100%; display: block; text-align: left">
          
          <el-autocomplete
            style="width:70%"
            v-model="formula"
            :fetch-suggestions="get_formula_suggestions"
            @keyup.enter.native="add_mark"
          >
          </el-autocomplete>
          <input type="color" v-model="mark_color"/>
          <!-- <el-select
            v-model="mark_color"
            placeholder=""
            size="small"
            style="width: 60px"
          >
            <el-option
              v-for="c in ['red','green','purple']"
              :key="c"
              :label="''"
              :value="c"
              :style="{ backgroundColor: c, color: c }"
            >
            </el-option>
          </el-select> -->
          <el-button
            style="padding:12px 5px"
            type="success"
            size="'small"
            @click="add_mark"
            >+mark
          </el-button>

          <el-button
            type="success"
            @click="clear_mark"
            style="padding:12px 5px"
            >clear
          </el-button>
        </div>
        <div
          style="
            width: 100%;
            height: 40px;
            display: block;
            text-align: left;
            margin-top: 10px;
          "
        >
          <el-slider
            style="width: 120px; float: left; margin: 0 10px 0 10px"
            :max="99"
            :step="0.05"
            v-model="percent_convert_pos"
            @change="
              graph_percent(percent_convert_index, true, percent_convert_pos)
            "
          >
          </el-slider>
          <el-button-group>
            <el-button
              type="primary"
              icon="el-icon-arrow-left"
              size="mini"
              style="width: 20px; padding-left: 3px"
              @click="graph_percent2(percent_convert_index, true, -0.05)"
            ></el-button>
            <el-button
              type="primary"
              size="mini"
              style="width: 20px; padding-right: 1px; padding-left: 0px"
              @click="graph_percent2(percent_convert_index, true, 0.5)"
              ><i class="el-icon-arrow-right el-icon--right"></i
            ></el-button>
          </el-button-group>
          <el-select
            v-model="percent_convert_index"
            placeholder="请选择"
            size="small"
            style="width: 70px"
          >
            <el-option
              v-for="count in graphs.length"
              :key="count"
              :label="count"
              :value="count"
            >
            </el-option>
          </el-select>
          <el-button
            class="button-new-tag"
            size="small"
            @click="
              graph_percent(percent_convert_index, false, percent_convert_pos)
            "
            >{{ current_date }}</el-button
          >
          <!-- <span style="font-size:14px">{{current_date}}</span> -->
        </div>
        <!-- <el-select v-model="category" filterable  placeholder="请选择">
            <el-option
                v-for="v in categories"
                :label="v"
                :value="v">
            </el-option>
        </el-select> -->
        <!-- 添加类别<div style="width:100%;text-align:left">
          <el-tag
          style="margin:2px"
            v-for="tag in categories_selected"
            :key="tag"
            closable
            :disable-transitions="false"
            @close="categories_selected.splice(categories_selected.indexOf(tag), 1)">
            {{tag}}
          </el-tag>
          <el-button class="button-new-tag" size="small" @click="dialogTableVisible=true">+ New Tag</el-button>

        </div> -->
        <el-button
          class="button-new-tag"
          size="small"
          @click="add_graphstr(true)"
          style="float: left"
          >+ New Graph</el-button
        >

        <el-button size="small" style="float: left" @click="get_graph()"
          ><i class="el-icon-refresh"></i>Reflesh</el-button
        >
        <el-button size="small" style="float: left" @click="fold"
          ><i class="el-icon-refresh"></i>fold</el-button
        >
        <el-button size="small" style="float: left" @click="add_mark"
          ><i class="el-icon-refresh"></i>test</el-button
        >
        <draggable
          v-model="graphs"
          animation="1000"
          @change="reindex"
          ref="graphstrlist"
        >
          <el-card class="box-card" v-for="(v, i) in graphs">
            <div
              slot="header"
              style="padding: 0px; font-size: 14px"
              @click="hide_show_graphstr($event)"
            >
              <span>{{ i + 1 }}</span
              ><span style="margin-left: 10px" v-for="(j, k) in v.split('$')">{{
                j.split("@")[1]
              }}</span>
            </div>
            <div class="item">
              <el-input
                class="subgraph"
                type="textarea"
                v-model="graphs[i]"
                onmousedown="this.parentNode.parentNode.parentNode.parentNode.draggable=false"
                autosize
              >
              </el-input>
            </div>
          </el-card>
        </draggable>
        <div>
          <el-button
            class="button-new-tag"
            size="big"
            @click="add_graphstr(false)"
            style="float: left"
            >+ New Graph</el-button
          >
          <el-button
            class="button-new-tag"
            size="big"
            @click="briefcolumns_Visible = true"
            >Columns</el-button
          >
          <el-button size="big" style="float: left" @click="get_graph()"
            ><i class="el-icon-refresh"></i>Reflesh</el-button
          >

          <el-button size="big" style="float: left" @click="add_mark"
            ><i class="el-icon-refresh"></i>test</el-button
          >
        </div>
      </el-aside>
    </el-container>
    <el-dialog
      title="category"
      width="60%"
      style="padding: 0"
      :visible.sync="dialogTableVisible"
    >
      <div style="height: auto; margin: 0px 0">
        <el-button
          style="margin: 2px"
          v-for="tag in categories"
          :key="tag"
          :type="category_disable(tag)"
          @click="select_category(tag, category_disable(tag))"
        >
          {{ tag }}
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="brief-columns"
      width="60%"
      style="padding: 0"
      :visible.sync="briefcolumns_Visible"
    >
      <div style="height: auto; margin: 0px 0">
        <el-button
          style="margin: 2px"
          v-for="bc in brief_columns[0]"
          :key="bc"
          type="primary"
          @click="copy_to_clipboard(bc)"
        >
          {{ bc }}
        </el-button>
      </div>
    </el-dialog>
    <back-to-top />

  </div>

 
</template>
<style>
.subgraph .el-input__inner {
  height: 24px;
  padding: 0 5px;
}
</style>
<script>
import axios from "axios";
import * as echarts from "echarts";
import draggable from "vuedraggable";
import comm from "../js/common.js";
import BackToTop from "./BackToTop.vue";
export default {
  name: "panorama",
  components: { draggable ,BackToTop},
  data: function () {
    return {
      mark_color:'#E00000',
      errinfo: "",
      start: 60,
      start_date: "",
      brief_columns: [],
      current_date: "recovery",
      percent_convert_index: 1,
      percent_convert_pos: 0,
      dialogTableVisible: false,
      briefcolumns_Visible: false,
      categories_selected: ["all"],
      categories: ["asdasd", "vvv", "asdas1", "1231ad", "2131asda"],
      period: [5, 10, 20, 60, 120, 240],
      graphs: ["pct", "amount", "value_diff", "cost_20", "cost_10"],
      columns: [],
      formula: "@range_min('a300',10)",
      formula_suggestions: [{ value: "111" }, { value: "222" }],
      myCharts: {},
      options: {},
      originindex: [],
    };
  },
  methods: {
    get_formula_suggestions(queryString, cb) {
      cb(this.formula_suggestions);
    },
    fold() {
      var parent = this.$refs.graphstrlist;
      for (var i = 0; i < parent.$children.length; i++) {
        if (parent.$children[i].$el.children[1].hidden) {
          parent.$children[i].$el.children[1].hidden = false;
        } else {
          parent.$children[i].$el.children[1].hidden = true;
        }
      }
      // console.log(this.$refs.graphstrlist.$children[0].$el.children[1].hidden);
    },
    hide_show_graphstr(e) {
      var target = e.target.parentElement.parentElement.children[1];
      if (target.hidden) {
        target.hidden = false;
      } else {
        target.hidden = true;
      }
      // console.log(e);
    },
    add_mark() {
      if (this.formula.startsWith("@")) {
        // console.log(this.formula.slice(1));
        var items=this.formula.slice(1).split(',')
        if(items[0]=='range_max'){
          daterangeindex=comm.range_max(this.get_data(items[1]),parseInt(items[2]))
        }
        if(items[0]=='range_min'){
          daterangeindex=comm.range_min(this.get_data(items[1]),parseInt(items[2]))
        }
        if(items[0]=='cross'){
          daterangeindex=comm.cross(this.get_data(items[1]),this.get_data(items[2]),items[3])
        }
        // console.log(daterangeindex)
        // daterangeindex = eval("this." + this.formula.slice(1));
      } else {
        var daterangeindex = this.parse(this.formula);
      }
      // console.log(daterangeindex);
      var daterange = this.operate(daterangeindex);
      comm.add_markerea(this.myCharts["maingraph"],daterange, this.mark_color);

      axios
        .get("stockapi/get_config_cache_data/formula_history/" + this.formula)
        .then((response) => {
          if (response.data != "") {
            this.formula_suggestions = response.data.map(function (value) {
              return { value: value }; 
            });
          }
        });
    },
    
    notice(title, content) {
      const h = this.$createElement;
      this.errinfo = content;
      this.$notify({
        title: title,
        position: "top-left",
        message: h("i", { style: "color: teal" }, content),
      });
    },
    copy_to_clipboard(v1) {
      comm.copy_to_clipboard(v1), (briefcolumns_Visible = false);
    },
    graph_percent2(index, flag, delta) {
      this.percent_convert_pos += delta;
      this.graph_percent(index, flag, this.percent_convert_pos);
    },
    graph_percent(index, flag, pos) {
      let graph_index = index - 1;
      var g = this.myCharts["maingraph"];
      if (flag) {
        let xaxis = this.options["maingraph"]["xAxis"][index - 1]["data"];
        let pos_ = parseInt((pos / 100) * xaxis.length);
        this.current_date = xaxis[pos_];

        let s = comm.series_percent(
          pos,
          this.options["maingraph"]["series"],
          graph_index
        );
        g.setOption({ series: s });
      } else {
        this.current_date = "";
        this.percent_convert_pos = 0;
        g.setOption({ series: this.options["maingraph"]["series"] });
      }
    },
    category_disable(tag) {
      for (var i = 0; i < this.categories_selected.length; i++) {
        if (this.categories_selected[i] == tag) {
          return "danger";
        }
      }
      return "primary";
    },
    select_category(tag, type) {
      if (type == "primary") {
        this.categories_selected.push(tag);
      } else {
        this.categories_selected.splice(
          this.categories_selected.indexOf(tag),
          1
        );
      }
    },
    clear_mark() {
      var graph = this.myCharts["maingraph"];
      var o = graph.getOption();
      for (var i = 0; i < o["series"].length; i++) {
        o["series"][i]["markArea"] = [];
      }
      graph.setOption(o);
    },
    parse(str) {
      var r = /([a-z0-9_@]+)([+\-<>=]+?)([\-a-z0-9._]+)/;
      var group = str.match(r);
      // console.log(group[1]);
      // console.log(group[3]);
      if (["<", ">", "=", ">=", "<="].includes(group[2])) {
        return this.compare(
          eval("this.get_data(group[1])"),
          eval("this.get_data(group[3])"),
          group[2]
        );
      }
    },
    // add(arr1, arr2) {
    //   return arr1.map(function (num, idx) {
    //     return num + arr2[idx];
    //   });
    // },
    // sub(arr1, arr2) {
    //   return arr1.map(function (num, idx) {
    //     return num - arr2[idx];
    //   });
    // },
    compare(arr1, arr2, operator) {
      // console.log(arr2)
      var result = arr1.map(function (num, idx) {
        if (typeof num == "object") {
          if (num != null) {
            // console.log(num);
            num = num[1];
          }
        }
        if (num == null) {
          return false;
        }
        if (typeof arr2 == "number") {
          // console.log(eval('num' +operator+ 'arr2'))
          return eval("num" + operator + "arr2");
        } else {
          var num2 = arr2[idx];
          if (typeof num2 == "object") {
            num2 = num2[1];
          }
          if (num2 == null) {
            return false;
          }
          // console.log(eval('num' +operator+ 'num2'))
          return eval("num" + operator + "num2");
        }
      });
      var l = [];
      for (var i = 0; i < result.length; i++) {
        if (result[i]) {
          l.push(i);
        }
      }
      return l;
    },
    operate(dateindexlist) {
      // console.log(dateindexlist)
      // var dateindexlist
      var graph = this.myCharts["maingraph"];
      var o = graph.getOption();
      var xAxis = o["xAxis"][0]["data"];
      // dateindexlist.map(function(dateindex){return xAxis[dateindex]})
      var daterange = [[]];
      var current = daterange[daterange.length - 1];
      if (dateindexlist.length == 0) {
        return null;
      }
      if (dateindexlist.length >= 1) {
        current.push(dateindexlist[0]);
      }
      for (var i = 1; i < dateindexlist.length; i++) {
        if (current[current.length - 1] + 1 == dateindexlist[i]) {
          current.push(dateindexlist[i]);
        } else {
          daterange.push([]);
          current = daterange[daterange.length - 1];
          current.push(dateindexlist[i]);
        }
      }
      for (var i = 0; i < daterange.length; i++) {
        if (daterange[i].length == 1) {
          if (daterange[i][0] == 0) {
            daterange[i].push(1);
          } else {
            daterange[i].splice(0, 0, daterange[i][0] - 1);
          }
        } else {
          daterange[i].splice(1, daterange[i].length - 2);
          daterange[i][0]=daterange[i][0]-1
        }
      }
      daterange = daterange.map(function (pair) {
        return [xAxis[pair[0]], xAxis[pair[1]]];
      });
      return daterange;
    },
    get_data(name) {
      var graph = this.myCharts["maingraph"];
      var o = graph.getOption();
      if (isNaN(Number(name))) {
        var names = name.split(".");
        for (var i = 0; i < o["series"].length; i++) {
          if (o["series"][i]["name"] == names[0]) {
            var data = o["series"][i]["data"];
            if (data[0].length > 1) {
              data = data.map(function (row) {
                return row[1]; // 返回每一行的第二个元素
              });
            }
            if (names.length > 1) {
              if (names[1] == "last") {
                return data[data.length - 1];
              }
            }
            return data;
          }
        }
      } else {
        return Number(name);
      }
      return null;
    },
    
    reindex(arg) {
      var ii = Array(this.graphs.length);
      var oldIndex = arg["moved"]["oldIndex"];
      var newIndex = arg["moved"]["newIndex"];
      for (var i = 0; i < this.graphs.length; i++) {
        if (i == oldIndex) {
          ii[i] = newIndex;
          continue;
        }
        if (oldIndex > newIndex) {
          if (i < oldIndex && i >= newIndex) {
            ii[i] = i + 1;
            continue;
          }
        } else {
          if (i > oldIndex && i <= newIndex) {
            ii[i] = i - 1;
            continue;
          }
        }
        ii[i] = i;
      }

      var option = this.myCharts["maingraph"].getOption();
      var titles=option['title']
      var new_titles=[]
      for (var i=0;i<ii.length;i++){
        new_titles.push(titles[ii[i]]['text'].slice(3))
      }
      for (var i=0;i<titles.length;i++){
        titles[i]['text']=titles[i]['text'].slice(0,3)+new_titles[i]
      }
      option['title']=titles
      console.log(ii)
      for (var i = 0; i < this.graphs.length; i++) {
        option["xAxis"][this.originindex[i]]["gridIndex"] = ii[i];
        option["yAxis"][this.originindex[i]]["gridIndex"] = ii[i];
        option["legend"][this.originindex[i]]["top"] =
          option["grid"][ii[i]]["top"];
      }
      var ori = Array(this.graphs.length);
      for (var i = 0; i < this.graphs.length; i++) {
        for (var j = 0; j < this.graphs.length; j++) {
          if (ii[j] == i) {
            ori[i] = this.originindex[j];
          }
        }
      }
      this.originindex = ori;
      this.myCharts["maingraph"].setOption(option);
    },
    get_graph() {
      if (this.myCharts["maingraph"]) {
        this.start = Math.round(
          this.myCharts["maingraph"].getOption().dataZoom[1].start
        );
      }
      var graphs = [];
      for (var i = 0; i < this.graphs.length; i++) {
        if (this.graphs[i] != "") {
          graphs.push(this.graphs[i]);
        }
      }
      this.graphs = graphs;
      var graph_strs_encode = encodeURIComponent(graphs.join("|"))//window.btoa(unescape(encodeURIComponent(graphs.join("|"))));
      if (this.categories_selected.length == 0) {
        this.categories_selected.push("all");
      }
      var panorama = this;
      let url = "stockapi/get_panorama_series_graphs/";
      // console.log(graph_strs_encode)
      axios({
        method: "post",
        url: url,
        data: {
          graphstr: graph_strs_encode,
          start: this.start,
          // category: window.btoa(
          //   unescape(encodeURIComponent(this.categories_selected.join("|")))
          // ),
        },
      })
        .then((response) => {
          echarts.dispose(document.getElementById("maingraph"));
          var data = response.data;
          var maingraph_div = document.getElementById("maingraph");
          maingraph_div.style.height = graphs.length * 250 + "px";
          panorama.options["maingraph"] = data;
          panorama.myCharts["maingraph"] = echarts.init(maingraph_div);
          panorama.myCharts["maingraph"].setOption(data);
          panorama.originindex = [...Array(this.graphs.length).keys()];
          // panorama.myCharts['maingraph'].on('click', function(a){console.log(a)})
        })
        .catch(function (err) {
          panorama.notice("获取错误", String(err));
        });
    },
    add_graphstr(head) {
      if (head) {
        if (this.graphs[0] == "") {
        } else {
          this.graphs.unshift("");
        }
      } else {
        if (this.graphs[this.graphs.length - 1] == "") {
        } else {
          this.graphs.push("");
        }
      }
    },
    show_category() {},
  },
  mounted() {
    window.panorama = this;
    axios.get("stockapi/get_config/panoramagraphstr").then((response) => {
      if (response.data != "") {
        this.graphs = response.data["graphstr"].split("|");
        this.categories_selected = response.data["show_category"].split("|");
        this.start = response.data["start"];
      }
      this.get_graph();
    });
    axios.get("stockapi/get_config/category").then((response) => {
      if (response.data != "") {
        this.categories = Object.keys(response.data);
        this.categories.push("all", "300", "500", "1000");
      }
    });
    axios.get("stockapi/get_brief_columns/").then((response) => {
      this.brief_columns = response.data;
    });
    axios
        .get("stockapi/get_config/formula_history")
        .then((response) => {
          if (response.data != "") {
            this.formula_suggestions = response.data.reverse().map(function (value) {
              return { value: value }; 
            });
            this.formula=this.formula_suggestions[0]['value']
          }
        });
  },
};
</script>
