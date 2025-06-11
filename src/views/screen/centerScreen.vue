<template>
  <div class="centerScreen">
    <div class="chinaMapContainer" ref="map">
      <div class="chinaMap" ref="map"></div>
      <div class="chinaMapTitle">实时客流量</div>
    </div>
    <div class="line">
      <div class="lineTitle">
        <p>未来7天游客数量趋势图</p>
        <img src="@/assets/images/screen/dataScreen-title.png" alt="" />
      </div>
      <div class="lineContent" ref="line"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';
import chinajson from '@/china.json';
import cityjson from '@/city.json';
const futureDates = ref([]);
let map = ref();
let line = ref();
let mapCharts: any;
let lineCharts: any;
const initChinaMap = () => {
  if (!mapCharts) {
    //注册地图
    console.log('注册地图');
    // echarts.registerMap('china', chinajson);
    echarts.registerMap('city', cityjson);
    mapCharts = echarts.init(map.value);
    const option = {
      geo: {
        map: 'city', // 地图名称，即注册的地图名称
        roam: true, // 是否开启鼠标缩放和平移漫游
        zoom: 1, // 初始缩放级别
        left: 100,
        top: 20,
        bottom: 0,
        right: 100,
        label: {
          emphasis: {
            show: true,
            color: 'white'
          }
        },
        itemStyle: {
          normal: {
            // 地图省份的背景颜色
            areaColor: '#01214a',
            borderColor: '#195BB9',
            borderWidth: 1
          },
          emphasis: {
            areaColor: '#2B91B7'
          }
        }
      },
      series: [
        {
          type: 'lines',
          zlevel: 2, // 调整层级，确保线在地图上方
          effect: {
            show: true, // 显示特效
            period: 6, // 特效动画的时间，单位为秒
            trailLength: 0.7, // 特效尾迹的长度
            symbol: 'arrow', // 箭头
            symbolSize: 5 // 箭头大小
          },
          lineStyle: {
            normal: {
              color: '#00FFFF', // 线的颜色
              width: 1, // 线的宽度
              curveness: 0.2 // 线的曲度
            }
          },
          data: [
            {
              coords: [
                [120.153576, 30.287459], // 起点
                [91.132212, 29.660361] // 终点
              ]
            }
          ]
        },
        {
          type: 'lines',
          zlevel: 2, // 调整层级，确保线在地图上方
          effect: {
            show: true, // 显示特效
            period: 6, // 特效动画的时间，单位为秒
            trailLength: 0.7, // 特效尾迹的长度
            symbol: 'arrow', // 箭头
            symbolSize: 5 // 箭头大小
          },
          lineStyle: {
            normal: {
              color: '#00FFFF', // 线的颜色
              width: 1, // 线的宽度
              curveness: 0.2 // 线的曲度
            }
          },
          data: [
            {
              coords: [
                [114.502461, 38.045474], // 起点
                [113.280637, 23.125178] // 终点
              ]
            }
          ]
        },
        {
          // 绘制起点和终点
          type: 'effectScatter',
          coordinateSystem: 'geo', // 使用地理坐标系
          zlevel: 2, // 调整层级，确保点在地图上方
          symbolSize: 10, // 点的大小
          label: {
            normal: {
              show: true, // 显示标签
              position: 'right', // 标签位置
              formatter: '{b}' // 标签内容，这里显示名称
            }
          },
          data: [
            {
              name: '起点(杭州)', // 名称
              value: [120.153576, 30.287459] // 坐标
            },
            {
              name: '终点(拉萨)', // 名称
              value: [91.132212, 29.660361] // 坐标
            }
          ]
        },
        {
          // 绘制起点和终点
          type: 'effectScatter',
          coordinateSystem: 'geo', // 使用地理坐标系
          zlevel: 2, // 调整层级，确保点在地图上方
          symbolSize: 10, // 点的大小
          label: {
            normal: {
              show: true, // 显示标签
              position: 'right', // 标签位置
              formatter: '{b}' // 标签内容，这里显示名称
            }
          },
          data: [
            {
              name: '起点(石家庄市)', // 名称
              value: [114.502461, 38.045474] // 坐标
            },
            {
              name: '终点(广州市)', // 名称
              value: [113.280637, 23.125178] // 坐标
            }
          ]
        }
      ]
    };
    mapCharts.setOption(option);
  }
};
const initLine = () => {
  if (!lineCharts) {
    lineCharts = echarts.init(line.value);
    const currentDate = new Date();
    for (let i = 0; i < 7; i++) {
      const nextDate = new Date(currentDate);
      nextDate.setDate(currentDate.getDate() + i);
      const year = nextDate.getFullYear();
      const month = String(nextDate.getMonth() + 1).padStart(2, '0');
      const day = String(nextDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      futureDates.value.push(formattedDate);
    }
    const option = {
      tooltip: {
        trigger: 'axis'
      },
      title: {
        text: '(访问量)',
        top: '7%',
        left: 50,
        textStyle: {
          color: 'white',
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: 'white' // 设置轴线颜色为白色
          }
        },
        data: futureDates.value
      },
      yAxis: {
        type: 'value',
        boundaryGap: false,
        axisLine: {
          show: true,
          lineStyle: {
            color: 'white' // 设置轴线颜色为白色
          }
        },
        axisTick: {
          show: true // 不显示刻度线
        },
        splitLine: {
          show: false // 显示分隔线
        },
        axisLabel: {
          formatter: '{value} 人'
        }
      },
      series: [
        {
          name: '访问量',
          type: 'line',
          smooth: true,
          data: [100, 200, 150, 300, 250, 700, 120],
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'blue' // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'yellow' // 100% 处的颜色
                }
              ],
              global: false // 缺省为 false
            }
          }
        }
      ]
    };
    lineCharts.setOption(option);
  }
};
onMounted(() => {
  initChinaMap();
  initLine();
});
</script>

<style scoped lang="scss">
.centerScreen {
  width: 100%;
  height: 100%;
  .chinaMapContainer {
    width: 100%;
    height: 70%;
    position: relative;
    // background-color: red;
    .chinaMap {
      width: 100%;
      height: 100%;
    }
    .chinaMapTitle {
      position: absolute;
      top: 80px;
      left: 10px;
      color: white;
      width: 150px;
      height: 30px;
      background-image: url('@/assets/images/screen/map-title-bg.png');
      background-size: 100% 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .line {
    width: 100%;
    height: 30%;
    display: flex;
    flex-direction: column;
    // background-color: green;
    background-image: url('@/assets/images/screen/dataScreen-main-cb.png');
    background-size: 100% 100%;
    .lineTitle {
      color: white;
    }
    .lineContent {
      flex: 1;
      // background-color: red;
    }
  }
}
</style>
