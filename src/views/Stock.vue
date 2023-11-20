<!--
 * @Author: your name
 * @Date: 2021-12-15 10:51:02
 * @LastEditTime: 2022-11-30 00:52:07
 * @LastEditors: kofybq 404633218@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \src\views\Stock.vue
-->
<template>
  <div>
    <el-container>
      <el-container>
        <!-- <el-header>Header</el-header> -->
        <el-main>
          <div
            id="maingraph"
            style="display: block; width: 100%; height: 800px"
          >
            main graph
          </div>
          <draggable v-model="graphstr" animation="1000">
            <div
              v-for="(v, i) in graphstr"
              v-bind:id="v.filter(filter).join('~')"
              :key="v"
              @dblclick="zoom_graph(v.filter(filter).join('~'))"
              v-bind:style="{
                display: 'block',
                float: 'left',
                margin: '2px 0 0 2px',
                width: i == -1 ? '100%' : '33%',
                height: i == -1 ? '500px' : '250px',
              }"
            >
              {{ v.filter(filter).join("~") }},{{ i }}
            </div>
          </draggable>
          <el-dialog
            title=""
            width="85%"
            top="10vh"
            :visible.sync="dialogTableVisible"
          >
            <div>
              <div
                id="zoom"
                style="width: 100%; height: 700px; margin: 5px 0"
              ></div>
            </div>
          </el-dialog>
        </el-main>
        <!-- <el-footer>Footer</el-footer> -->
      </el-container>
      <el-aside width="30%" class="aaa">
        <el-autocomplete
          class="inline-input"
          v-model="code"
          :fetch-suggestions="querySearch"
          placeholder="请输入内容"
          :trigger-on-focus="false"
          @focus="focus($event)"
          @select="handleSelect"
          @keypress.native.enter="get_all_graph(code)"
        >
          <template slot-scope="{ item }">
            <div class="name">
              {{ item.value }} <span class="addr">{{ item.name }}</span>
            </div>
          </template>
        </el-autocomplete>
        <div style="text-align: left; padding-left: 4px">
          <el-button
            class="latest_click"
            v-for="(v, i) in latest"
            type="text"
            @click="get_all_graph(v.split('|')[0])"
            >{{ v.split("|")[1] }}</el-button
          >
        </div>
        <el-tabs type="border-card" v-model="active_tab">
          <el-tab-pane label="摘要" name="abstract">
            <el-descriptions
              class="margin-top"
              title="带边框列表"
              :column="3"
              border
            >
              <template slot="extra">
                <el-button type="primary" size="small">操作</el-button>
              </template>
              <el-descriptions-item v-for="(v, i) in abstract">
                <template slot="label">
                  {{ i }}
                </template>
                {{ v }}
              </el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>
          <el-tab-pane label="主图" name="maingraph">
            <draggable v-model="maingraphstr" animation="1000">
              <el-card class="box-card" v-for="(v, i) in maingraphstr">
                <div slot="header" style="padding: 0px">
                  <span>{{ i + 1 }}</span>
                  <el-button
                    style="float: right; padding: 0px 0; width: 30px"
                    @click="add_submaingraph(i)"
                    >+</el-button
                  >
                </div>
                <div v-for="(v_, i_) in maingraphstr[i]" class="item">
                  <el-input
                    class="subgraph"
                    type="textarea"
                    autosize
                    onmousedown="this.parentNode.parentNode.parentNode.parentNode.draggable=false"
                    :id="graphstrId('maingraphstr', i, i_)"
                    @focus="focuson = 'maingraphstr_' + i + '_' + i_"
                    v-model="maingraphstr[i][i_]"
                    @change="$forceUpdate()"
                  >
                  </el-input>
                </div>
              </el-card>
            </draggable>
            <div>
              <el-button
                class="button-new-tag"
                size="big"
                @click="add_maingraphstr"
                style="float: left"
                >+ New Graph</el-button
              >
              <el-button size="big" style="float: left" @click="get_graph(code)"
                ><i class="el-icon-refresh"></i>Reflesh</el-button
              >
              <el-button
                size="big"
                style="float: left"
                @click="drawer = !drawer"
                ><i class="el-icon-s-unfold"></i>ShowData</el-button
              >
            </div>
          </el-tab-pane>
          <el-tab-pane label="副图" name="auxiliary">
            <el-drawer
              title="数据"
              :visible.sync="drawer"
              :wrapperClosable="false"
              direction="ltr"
              :append-to-body="true"
              :modal="false"
              :size="500"
              class="drawer"
            >
              <el-collapse :value="Object.keys(financial_items)">
                <el-collapse-item
                  v-for="(v, i) in financial_items"
                  :title="i"
                  :name="i"
                >
                  <el-button
                    v-for="(v1, i1) in financial_items[i]"
                    type="warning"
                    style="
                      float: left;
                      font-size: 14px;
                      margin: 2px 3px;
                      padding: 5px;
                    "
                    @click="add_item(v1)"
                    >{{ v1 in report_map ? report_map[v1] : v1 }}</el-button
                  >
                </el-collapse-item>
              </el-collapse>
            </el-drawer>
            <draggable v-model="graphstr" animation="1000">
              <el-card class="box-card" v-for="(v, i) in graphstr">
                <div slot="header" style="padding: 0px">
                  <span>{{ i + 1 }}</span>
                  <el-button
                    style="
                      float: right;
                      padding: 0px 0;
                      margin: 0 0px 0 2px;
                      width: 30px;
                      height: 20px;
                    "
                    @click="add_subgraph(i)"
                    >+</el-button
                  >

                  <el-switch
                    style="float: right"
                    v-model="graphstr_switch[i]"
                    @change="
                      graph_percent(
                        v.filter(filter).join('~'),
                        graphstr_switch[i],
                        graphstr_switch_pos[i]
                      )
                    "
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                  >
                  </el-switch>
                  <div style="width: 70px; float: right; margin: -8px 8px 0 0">
                    <el-slider
                      v-model="graphstr_switch_pos[i]"
                      :max="99"
                      @input="
                        graph_percent(
                          v.filter(filter).join('~'),
                          graphstr_switch[i],
                          graphstr_switch_pos[i]
                        )
                      "
                    >
                    </el-slider>
                  </div>

                  <el-switch
                    style="float: right; margin: 0 14px 0 0"
                    v-model="graphstr_interval_switch[i]"
                    @change="
                      graph_interval_percent(
                        v.filter(filter).join('~'),
                        graphstr_interval_switch[i],
                        graphstr_interval[i]
                      )
                    "
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                  >
                  </el-switch>
                  <div style="width: 70px; float: right; margin: -8px 8px 0 0">
                    <el-slider
                      v-model="graphstr_interval[i]"
                      :max="4"
                      :min="1"
                      @input="
                        graph_interval_percent(
                          v.filter(filter).join('~'),
                          graphstr_interval_switch[i],
                          graphstr_interval[i]
                        )
                      "
                    >
                    </el-slider>
                  </div>
                </div>
                <div v-for="(v_, i_) in graphstr[i]" class="item">
                  <el-input
                    class="subgraph"
                    type="textarea"
                    autosize
                    :id="graphstrId('graphstr', i, i_)"
                    @focus="focuson = 'graphstr_' + i + '_' + i_"
                    v-model="graphstr[i][i_]"
                    @change="$forceUpdate()"
                  >
                  </el-input>
                </div>
              </el-card>
            </draggable>
            <div>
              <el-button
                class="button-new-tag"
                size="big"
                @click="add_graphstr"
                style="float: left"
                >+ New Graph</el-button
              >
              <el-button size="big" style="float: left" @click="get_graph(code)"
                ><i class="el-icon-refresh"></i>Reflesh</el-button
              >
              <el-button
                size="big"
                style="float: left"
                @click="drawer = !drawer"
                ><i class="el-icon-s-unfold"></i>ShowData</el-button
              >
            </div>
          </el-tab-pane>
        </el-tabs>
        <el-input v-model="locate" style="width: 200px"> </el-input>
        <el-input v-model="offset" style="width: 200px"> </el-input>
        <el-button
          type="success"
          style=""
          @click="add_markerea(locate, offset, 'red')"
          >locate
        </el-button>

        <el-button
          type="success"
          style="width: 80%; height: 60px; margin: 5px 0"
          @click="get_graph(code)"
          >222
        </el-button>
      </el-aside>
    </el-container>
  </div>
</template>
<style>
.el-drawer__wrapper.drawer {
  width: 500px;
}
.box-card {
  margin-bottom: 10px;
}
.box-card .el-card__body {
  padding: 2px;
}
.box-card .el-card__header {
  padding: 4px 10px;
  text-align: left;
  height: 30px;
  font-size: 10px;
  font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
  background-color: rgb(255, 202, 193);
}
.box-card .item {
  margin-bottom: 4px;
}
.subgraph .el-input__inner {
  height: 24px;
  padding: 0 5px;
}

.latest_click.el-button {
  color: rgb(219, 63, 36);
  font-size: 14px;
  line-height: 10%;
}
.focus .el-textarea__inner {
  background-color: #f5ffff;
}
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  /* line-height: 60px; */
}
.graphstr {
  font-size: 15px;
  margin: 2px 0px 0 0;
}
.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  /* line-height: 200px; */
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  /* line-height: 160px; */
}
</style>
<script>
import axios from "axios";
import * as echarts from "echarts";
import report_map from "@/report_map.json";
import draggable from "vuedraggable";
import cookie from "js-cookie";
import comm from "../js/common.js";
export default {
  name: "stock",
  components: { draggable },
  data: function () {
    return {
      locate: "",
      offset: 10,
      report_map: report_map,
      options: {},
      financial_items: {
        融资港股: [
          "kline",
          "kline_x",
          "close",
          "open",
          "high",
          "low",
          "vol",
          "amount",
          "shares",
          "liquidity",
          "diff",
          "pre_close",
          "pre_amount",
          "ganggutong",
          "financing_buy",
          "financing_sell",
          "financing_remain",
          "securities_loan",
          "securities_repay",
          "securities_remain",
        ],
        利润: [
          "OPERATE_INCOME",
          "OPERATE_PROFIT",
          "NETPROFIT",
          "PARENT_NETPROFIT",
          "DEDUCT_PARENT_NETPROFIT",
          "OPERATE_COST",
          "RESEARCH_EXPENSE",
          "SALE_EXPENSE",
          "MANAGE_EXPENSE",
          "FINANCE_EXPENSE",
        ],
        资产负债: [
          "TOTAL_ASSETS",
          "MONETARYFUNDS",
          "NOTE_ACCOUNTS_RECE",
          "LONG_RECE",
          "INVENTORY",
          "TOTAL_CURRENT_ASSETS",
          "TOTAL_NONCURRENT_ASSETS",
          "TOTAL_LIABILITIES",
          "SHORT_LOAN",
          "STAFF_SALARY_PAYABLE",
          "NOTE_ACCOUNTS_PAYABLE",
          "TOTAL_OTHER_PAYABLE",
          "NONCURRENT_LIAB_1YEAR",
          "TOTAL_NONCURRENT_LIAB",
          "TOTAL_EQUITY",
          "TOTAL_PARENT_EQUITY",
        ],
        现金流量: [
          "TOTAL_OPERATE_INFLOW",
          "TOTAL_OPERATE_OUTFLOW",
          "TOTAL_INVEST_INFLOW",
          "TOTAL_INVEST_OUTFLOW",
          "TOTAL_FINANCE_INFLOW",
          "TOTAL_FINANCE_OUTFLOW",
          "END_CCE",
          "PAY_STAFF_CASH",
        ],
      },
      graphstr: [[""]], //['kline','{OPERATE_INCOME}','{OPERATE_PROFIT}-{INVENTORY}'],
      graphstr_switch: [],
      graphstr_switch_pos: [],
      graphstr_interval: [],
      graphstr_interval_switch: [],
      maingraphstr: [[""]],
      focuson: "",
      stocklist: [],
      dialogTableVisible: false,
      code: "",
      latest: [],
      abstract: {},
      drawer: false,
      myCharts: {},
      active_tab: "maingraph",
    };
  },
  methods: {
    add_markerea(date_point, offset, color) {
      // var date_point='2021-04-20'
      offset = Number(offset);

      // var color = "green";
      var graph = this.myCharts["maingraph"];
      var gridindex = [];
      var o = graph.getOption();
      delete o["markArea"];

      //set zoomdata position

      var xAxis = o["xAxis"][0]["data"];
      var xAxis_len = xAxis.length;
      var point_index = xAxis.indexOf(date_point);
      if (point_index < 0) {
        for (var i = 0; i < xAxis.length; i++) {
          if (xAxis[i] > date_point) {
            point_index = i;
            date_point = xAxis[i];
            break;
          }
        }
      }
      var second_point_index = point_index + offset;
      second_point_index = Math.min(second_point_index, xAxis_len - 1);
      second_point_index = Math.max(0, second_point_index);
      var second_point = xAxis[second_point_index];
      var interval = Math.abs(second_point_index - point_index);
      var position = (point_index * 100) / xAxis_len;

      console.log(position);
      if (
        position > o["dataZoom"][0]["end"] ||
        position < o["dataZoom"][0]["start"]
      ) {
        var center_offset =
          (o["dataZoom"][0]["start"] + o["dataZoom"][0]["end"]) / 2;
        center_offset = position - center_offset;
        o["dataZoom"][0]["start"] = o["dataZoom"][0]["start"] + center_offset;
        o["dataZoom"][0]["end"] = o["dataZoom"][0]["end"] + center_offset;
      }

      var daterange = [[date_point, second_point]];
      for (var i = 0; i < o["xAxis"].length; i++) {
        gridindex[i] = true;
      }
      var data = [];
      for (var i = 0; i < daterange.length; i++) {
        data.push([{ xAxis: daterange[i][0] }, { xAxis: daterange[i][1] }]);
      }
      for (var i = 0; i < o["series"].length; i++) {
        if (gridindex[o["series"][i]["xAxisIndex"]]) {
          o["series"][i]["markArea"] = {
            itemStyle: {
              color: color,
              opacity: 0.4,
            },
            data: data,
          };
          gridindex[o["series"][i]["xAxisIndex"]] = false;
        }
      }

      graph.setOption(o);
    },
    handleSelect(item) {
      this.get_graph(item.value);
    },
    focus(event) {
      event.currentTarget.select();
    },
    querySearch(queryString, cb) {
      axios.get("stockapi/get_code_suggest/" + queryString).then((response) => {
        var results = response.data;
        cb(results);
      });
    },
    zoom_graph(id) {
      var stock = this;
      this.dialogTableVisible = true;
      this.$nextTick(() => {
        echarts.dispose(document.getElementById("zoom"));
        var myChart = echarts.init(document.getElementById("zoom"));
        // myChart.setOption(stock.options[id]);
        myChart.setOption(this.myCharts[id].getOption());
      });
    },
    add_graphstr() {
      if (
        this.graphstr[this.graphstr.length - 1].length == 1 &&
        this.graphstr[this.graphstr.length - 1][0] == ""
      ) {
      } else {
        this.graphstr.push([""]);
        this.graphstr_switch.push(false);
        this.graphstr_switch_pos.push(0);
        this.graphstr_interval.push(1);
        this.graphstr_interval_switch.push(false);
      }
    },
    add_maingraphstr() {
      if (
        this.maingraphstr[this.maingraphstr.length - 1].length == 1 &&
        this.maingraphstr[this.maingraphstr.length - 1][0] == ""
      ) {
      } else {
        this.maingraphstr.push([[""]]);
      }
    },
    add_subgraph(i) {
      this.graphstr[i].push("");
    },
    graph_interval_percent(id, flag, interval) {
      var g = this.myCharts[id];
      if (flag) {
        var s = JSON.parse(JSON.stringify(this.options[id]["series"]));
        for (var i in s) {
          var d = s[i]["data"];
          var d_after = d.slice();
          var d_before = d.slice();
          var result = [];
          for (var j = 0; j < interval; j++) {
            d_after.shift();
            d_before.pop();
            result.push(null);
          }

          for (var k in d_after) {
            if (
              d_after[k][1] == null ||
              d_before[k][1] == null ||
              d_before[k][1] == 0
            ) {
              result.push(null);
            } else {
              var r = ((d_after[k][1] - d_before[k][1]) * 100) / d_before[k][1];
              result.push(r);
            }
          }
          s[i]["data"] = result;
          console.log(d_before);
          console.log(d_after);
          console.log(result);
        }
        g.setOption({ series: s });
      } else {
        g.setOption({ series: this.options[id]["series"] });
      }
    },
    graph_percent(id, flag, pos) {
      console.log(pos);
      var g = this.myCharts[id];
      if (flag) {
        let s = comm.series_percent(pos, this.options[id]["series"], -1);
        g.setOption({ series: s });
      } else {
        g.setOption({ series: this.options[id]["series"] });
      }
    },
    add_submaingraph(i) {
      this.maingraphstr[i].push("");
    },
    add_item(item) {
      if (this.focuson != "") {
        var focuson = this.focuson;
        var a = this.focuson.split("_");
        var d = document.getElementById(focuson);
        var index = d.selectionStart;
        if (a[0] == "graphstr") {
          var origin = this.graphstr[a[1]][a[2]];
          this.graphstr[a[1]][a[2]] =
            origin.slice(0, index) + "{" + item + "}" + origin.slice(index);
        } else {
          var origin = this.maingraphstr[a[1]][a[2]];
          this.maingraphstr[a[1]][a[2]] =
            origin.slice(0, index) + "{" + item + "}" + origin.slice(index);
        }
        this.$forceUpdate();
        this.focuson = "";

        d.focus();
        // document.getElementById(focuson).setSelectionRange(0,5)//=index+item.length+2
        // document.getElementById(focuson).selectionEnd=index+item.length+2
      }
    },
    filter(s) {
      // console.log(s)
      return s && s.trim();
    },
    get_graph(code) {
      this.code = code;
      //添加最近访问
      for (var cc in this.stocklist) {
        if (this.stocklist[cc][0] == code) {
          var new_list = [];
          for (var i in this.latest) {
            var l = this.latest[i].split("|");
            if (l[0] != code) {
              new_list.push(this.latest[i]);
            }
          }
          this.latest = new_list.slice(0, 19);
          this.latest.unshift(code + "|" + this.stocklist[cc][1]);
          cookie.set("latest", this.latest.join(","));
          break;
        }
      }

      //获取摘要
      axios.get("stockapi/get_base_info/" + code).then((response) => {
        this.abstract = response.data;
      });

      //获取图
      function filter(s) {
        return s && s.trim();
      }
      function filter2d(s) {
        var graphstr_temporary = [];
        for (var i = 0; i < s.length; i++) {
          graphstr_temporary.push(s[i].filter(filter).join("~"));
        }
        return graphstr_temporary.filter(filter).join("|");
      }

      // var graphstr_temporary = [];
      // for (var i = 0; i < this.graphstr.length; i++) {
      //   graphstr_temporary.push(this.graphstr[i].filter(filter).join(","));
      // }

      var maingraph_strs = filter2d(this.maingraphstr);
      console.log(maingraph_strs);

      var maingraph_strs_encode = window.btoa(maingraph_strs);

      this.list = new Array();
      var stock = this;
      this.$nextTick(() => {
        //获取maingraph数据
        document.getElementById("maingraph").style.height =
          maingraph_strs.split("|").length * 250  + "px";
        axios
          .get("stockapi/get_maingraph/" + code + "/" + maingraph_strs_encode)
          .then((response) => {
            echarts.dispose(document.getElementById("maingraph"));
            var data = response.data;
            stock.options["maingraph"] = data;
            stock.myCharts["maingraph"] = echarts.init(
              document.getElementById("maingraph")
            );
            stock.myCharts["maingraph"].setOption(data);

            if (this.locate != "") {
              this.add_markerea(this.locate, this.offset, "red");
            }
          });
      });
    },
    get_finance_graph(code) {
      function filter(s) {
        return s && s.trim();
      }
      function filter2d(s) {
        var graphstr_temporary = [];
        for (var i = 0; i < s.length; i++) {
          graphstr_temporary.push(s[i].filter(filter).join("~"));
        }
        return graphstr_temporary.filter(filter).join("|");
      }
      var graph_strs = filter2d(this.graphstr);
      var graph_strs_encode = window.btoa(graph_strs);
      var stock = this;
      this.$nextTick(() => {
        var graphs = graph_strs.split("|");
        console.log(graphs);
        //获取graph数据
        axios
          .get("stockapi/get_graph/" + code + "/" + graph_strs_encode)
          .then((response) => {
            for (var i in graphs) {
              echarts.dispose(document.getElementById(graphs[i]));
              stock.myCharts[graphs[i]] = echarts.init(
                document.getElementById(graphs[i])
              );
              var o = response.data[graphs[i]];
              o["title"] = {
                text: parseInt(i) + 1,
                x: "left",
              };
              stock.myCharts[graphs[i]].setOption(o);
              stock.options[graphs[i]] = response.data[graphs[i]];
              // console.log(i)
            }
          });
      });
    },
    graphstrId(prefix, i, i_) {
      return prefix + "_" + i + "_" + i_;
    },
    get_all_graph(code) {
      this.get_graph(code);
      this.get_finance_graph(code);
    },
  },
  mounted() {
    window.stock = this;
    if (cookie.get("latest")) {
      this.latest = cookie
        .get("latest")
        .split(",")
        .filter(function (s) {
          return s && s.trim(); // 注：IE9(不包含IE9)以下的版本没有trim()方法
        });
    }

    axios.get("stockapi/get_config/graphstr").then((response) => {
      var d1 = response.data.split("|");
      this.graphstr_switch = new Array(d1.length);
      this.graphstr_switch_pos = new Array(d1.length);
      this.graphstr_interval == new Array(d1.length);
      this.graphstr_interval_switch = new Array(d1.length);
      for (var i = 0; i < d1.length; i++) {
        d1[i] = d1[i].split("~");
        this.graphstr_switch[i] = false;
        this.graphstr_switch_pos[i] = 0;
        this.graphstr_interval_switch[i] = false;
        this.graphstr_interval[i] = 1;
      }
      this.graphstr = d1;
      this.get_finance_graph(this.latest[0].split("|")[0]);
    });

    axios.get("stockapi/get_config/maingraphstr").then((response) => {
      var d1 = response.data.split("|");

      for (var i = 0; i < d1.length; i++) {
        d1[i] = d1[i].split("~");
      }
      this.maingraphstr = d1;

      if (this.latest.length > 0) {
        this.get_graph(this.latest[0].split("|")[0]);
      }
    });
    axios.get("stockapi/get_config/stocklist").then((response) => {
      this.stocklist = response.data;
    });
  },
};
</script>