/*
 * @Author: kofybq 404633218@qq.com
 * @Date: 2022-09-05 02:27:24
 * @LastEditors: kofybq 404633218@qq.com
 * @LastEditTime: 2022-10-05 16:00:06
 * @FilePath: \src\js\common.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from "axios";
const asc = arr => arr.sort((a, b) => a - b);

const sum = arr => arr.reduce((a, b) => a + b, 0);

const mean = arr => sum(arr) / arr.length;

// sample standard deviation
const std = (arr) => {
    const mu = mean(arr);
    const diffArr = arr.map(a => (a - mu) ** 2);
    return Math.sqrt(sum(diffArr) / (arr.length - 1));
};

const quantile = (arr, q) => {
    const sorted = asc(arr);
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (sorted[base + 1] !== undefined) {
        return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    } else {
        return sorted[base];
    }
};
function tofix(x, n) {
    // console.log(typeof(x))
    // console.log(x)
    if (typeof (x) == "undefined") {
        return 'NaN'
    } else {
        return x.toFixed(n)
    }
};
function copy_to_clipboard(txt_str) {
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.setAttribute('value', txt_str);
    input.select();
    if (document.execCommand('copy')) {
        document.execCommand('copy');
        // console.log('复制成功');
        //Alert(500,'复制成功');
    }
    document.body.removeChild(input);
}
function series_percent(pos, series, index) {
    // console.log(pos)
    // var g=this.myCharts[id]

    // var s=g.getOption()['series']
    var s = JSON.parse(JSON.stringify(series))
    for (var i in s) {
        if (index >= 0) {
            if (index != s[i]['xAxisIndex']) {
                continue
            }
        }
        // console.log(s[i]['name'])
        var d = s[i]['data']
        // console.log(d)
        var start = null
        var pos_ = parseInt(pos / 100 * d.length)

        let data_type = 'num'
        for (var j in d) {//排除null
            if (j < pos_) { continue }
            if (d[j] == null) { continue }
            if (typeof (d[j]) == 'object') {
                if (d[j][1] == null) { continue }
                start = d[j][1]
                data_type = 'arr'
                break
            } else {
                start = d[j]
                data_type = 'num'
                break
            }

        }
        if (data_type == 'arr') {
            for (var j in d) {
                if (d[j][1] != null)
                    d[j][1] = d[j][1] * 100 / start - 100
            }
        } else {
            for (var j in d) {
                if (d[j] != null)
                    d[j] = d[j] * 100 / start - 100
            }
        }
    }
    // g.setOption({'series':s})
    return s

}
function bool2index(arr) {
    var result = []
    for (var i = 0; i < arr.length; i++) {
        // 遍历每个元素
        if (arr[i]) {
            // 如果元素为 true
            result.push(i); // 将其索引添加到 result 中
        }
    }
    return result
}


function range_min_max(arr1, N, min) {
    // var arr1 = this.get_data(data_name)
    var arr2 = arr1
        .map(function (value, index) {
            // 使用 map 方法映射每个元素
            if (min) {
                return {
                    value: value, // 原始值
                    min: Math.min(...arr1.slice(Math.max(0, index - N), index + N + 1)), // 前后 N 范围内的最小值
                };
            } else {
                return {
                    value: value, // 原始值
                    min: Math.max(...arr1.slice(Math.max(0, index - N), index + N + 1)), // 前后 N 范围内的最小值
                };
            }
        }).reduce(function (acc, cur) {
            // 使用 reduce 方法归约所有元素
            acc.push(cur.value === cur.min); // 将原始值是否等于最小值的布尔值推入累积数组中
            return acc; // 返回累积数组
        }, []);

    return bool2index(arr2)
}
function range_min(arr1, N) {
    return range_min_max(arr1, N, true)
}
function range_max(arr1, N) {
    return range_min_max(arr1, N, false)
}

function cross(arr1, arr2,direction) {

    // var arr1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // 给定的数组
    // var arr2 = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]; // 给定的数组
    var arr3 = [false]; // 返回的布尔数组
    for (var i = 1; i < arr1.length; i++) {
        // 遍历每个元素
        var a = arr1[i - 1] - arr2[i - 1]; // 计算 a[i]
        var b = arr1[i] - arr2[i]; // 计算 b[i]
        var temp=i
        while (a === 0 && i > 0) {
            // 如果 a[i] 等于零
            i--; // 向前回溯
            a = arr1[i - 1] - arr2[i - 1]; // 更新 a[i]
        }
        i=temp
        while (b === 0 && i  >0) {
            // 如果 b[i] 等于零
            i--; // 向前回溯
            b = arr1[i] - arr2[i]; // 更新 b[i]
        }
        i=temp
        if (a * b < 0) {
            // 如果 a * b 小于零
            if(direction=='up'){
                if(a<0){
                    arr3.push(true)
                }else{
                    arr3.push(false)
                }
            }
            else if(direction=='down'){
                if(a>0){
                    arr3.push(true)
                }else{
                    arr3.push(false)
                }
            }else{
                arr3.push(true); // 将 true 添加到 arr3 中
            }
            
        } else {
            // 如果 a * b 大于等于零
            arr3.push(false); // 将 false 添加到 arr3 中
        }
    }
    //     console.log(arr1.length);}
    // console.log(arr3.length); // 打印结果
    return bool2index(arr3)
   
}

function add_markerea(graph,daterange, color) {
    if (!daterange) {
      return;
    }
    // var daterange = [["2022-03-10", "2022-04-11"]];
    // var color = "green";
    // var graph = this.myCharts["maingraph"];
    var gridindex = [];
    var o = graph.getOption();
    delete o["markArea"];

    for (var i = 0; i < o["xAxis"].length; i++) {
      gridindex[i] = true;
    }
    var data = [];
    for (var i = 0; i < daterange.length; i++) {
      // data.push([{ xAxis: daterange[i][0] }, { xAxis: daterange[i][1] }]);
      data.push([{ xAxis: daterange[i][0], itemStyle: { color: color ,opacity:.34}}, { xAxis: daterange[i][1] }]);
    }
    for (var i = 0; i < o["series"].length; i++) {
      if (gridindex[o["series"][i]["xAxisIndex"]]) {
        // o["series"][i]["markArea"] = {
        //   itemStyle: {
        //     color: color,
        //     opacity: 0.4,
        //   },
        //   data: data,
        // };
        // o['series'][1]['markArea']={data:[[{ 'xAxis': '2023-09-01', 'itemStyle': { 'color': 'green' } }, { 'xAxis': '2023-09-15' }] ]}
        if(!o["series"][i]["markArea"]){
          o['series'][i]['markArea']={data:[]}
        }
        o['series'][i]['markArea']['data'].splice(o['series'][i]['markArea']['data'].length, 0, ...data)
        gridindex[o["series"][i]["xAxisIndex"]] = false;
      }
    }
    graph.setOption(o);
  }
export default { quantile, std, tofix, copy_to_clipboard, series_percent, bool2index, range_max, range_min, cross,add_markerea}