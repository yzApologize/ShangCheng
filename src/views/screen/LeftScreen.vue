<template>
  <div class="leftScreenContainer">
    <div class="tourist">
      <div class="touristTitle">
        <p>实时游客统计</p>
        <img src="@/assets/images/screen/dataScreen-title.png" alt="" />
        <p>可预约总量：<span style="color: orange">9999</span> 人</p>
        <div class="touristNumber">
          <span v-for="item in touristNumber">{{ item }}</span>
        </div>
        <div class="water" ref="water"></div>
      </div>
    </div>
    <div class="sex">
      <div class="sexTitle">
        <p>男女比例</p>
        <img src="@/assets/images/screen/dataScreen-title.png" alt="" />
      </div>
      <div class="sexBox">
        <div class="man">
          <img src="@/assets/images/screen/man.png" alt="" />
        </div>
        <div class="woman">
          <img src="@/assets/images/screen/woman.png" alt="" />
        </div>
      </div>
      <div class="percent" ref="percent">
        <span style="position: absolute; left: 10%; top: 10%">男性：82%</span>
        <span style="position: absolute; right: 10%; top: 10%">女生：18%</span>
      </div>
    </div>
    <div class="age">
      <div class="ageTitle">
        <p>年龄比例</p>
        <img src="@/assets/images/screen/dataScreen-title.png" alt="" />
      </div>
      <div class="pieCharts" ref="pie"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';
import 'echarts-liquidfill';
import { Right } from '@element-plus/icons-vue';
const touristNumber = ref('215908人');
const water = ref();
const percent = ref();
const pie = ref();
let waterCharts;
let percentCharts;
let pieCharts;
const initWaterCharts = () => {
  if (!waterCharts) {
    waterCharts = echarts.init(water.value);
    const option = {
      series: [
        {
          type: 'liquidFill',
          data: [0.5], // 初始值
          radius: '80%', // 半径
          itemStyle: {
            color: 'aqua'
            // opacity: 0.1
          },
          backgroundStyle: {
            // borderWidth: 5,
            // borderColor: 'red',
            color: {
              type: 'radial',
              x: 0.5,
              y: 0.5,
              r: 0.5,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(5, 244, 252, 0.1)'
                },
                {
                  offset: 0.5,
                  color: 'rgba(5, 244, 252, 0.5)'
                },
                {
                  offset: 1,
                  color: 'rgba(5, 244, 252, 1)'
                }
              ],
              global: false
            }
          },
          outline: {
            show: true, // 显示边框
            borderDistance: 10, // 边框距离
            itemStyle: {
              borderColor: 'aqua',
              borderType: 'dashed', // 关键配置：虚线样式
              borderWidth: 2
            }
          }
        }
      ]
    };
    waterCharts.setOption(option);
  }
};
const initPercentCharts = () => {
  if (!percentCharts) {
    percentCharts = echarts.init(percent.value);
    const option = {
      xAxis: {
        type: 'value',
        show: false
      },
      yAxis: {
        type: 'category',
        show: false
      },
      title: {
        text: '男女比例',
        left: 'center',
        top: '0',
        textStyle: {
          color: 'aqua',
          fontSize: 15
        }
      },
      grid: {
        top: '0',
        left: '10%',
        right: '10%',
        bottom: '0'
      },
      series: [
        {
          type: 'bar',
          data: [82],
          barWidth: 20,
          itemStyle: {
            color: 'aqua',
            borderRadius: [10, 10, 10, 10]
          },
          z: 3,
          label: {
            show: true,
            position: 'insideLeft',
            color: 'white',
            fontSize: 15,
            fontWeight: 'bold',
            formatter: '{c}%'
          }
        },
        {
          type: 'bar',
          data: [100],
          barWidth: 20,
          barGap: '-100%',
          itemStyle: {
            color: 'red',
            borderRadius: [10, 10, 10, 10]
          },
          label: {
            show: true,
            position: 'insideRight',
            color: 'white',
            fontSize: 15,
            fontWeight: 'bold',
            formatter: function (params) {
              return `${100 - 82}%`;
            }
          }
        }
      ]
    };
    percentCharts.setOption(option);
  }
};
const initPieCharts = () => {
  if (!pieCharts) {
    pieCharts = echarts.init(pie.value);
    const option = {
      grid: {
        top: '0',
        left: '0',
        right: '0',
        bottom: '0'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical', // 垂直显示
        top: '30',
        right: '50',
        textStyle: {
          color: 'white', // 设置图例文字颜色为白色
          fontSize: 15, // 设置图例文字大小为15px
          fontWeight: 'bold' // 设置图例文字为粗体
        }
      },
      series: [
        {
          type: 'pie',
          radius: ['50%', '80%'], // 内外半径
          center: ['40%', '50%'], // 圆心位置
          label: {
            show: true, // 显示标签
            position: 'inside', // 标签位置
            formatter: '{b}', // 标签格式
            fontSize: 15, // 标签文字大小
            color: 'white' // 标签文字颜色
          },
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          data: [
            { value: 20, name: '18-25岁' },
            { value: 30, name: '26-35岁' },
            { value: 16, name: '36-45岁' },
            { value: 10, name: '46-55岁' },
            { value: 10, name: '56-65岁' },
            { value: 5, name: '65岁以上' }
          ]
        }
      ]
    };
    pieCharts.setOption(option);
  }
};
onMounted(() => {
  initWaterCharts();
  initPercentCharts();
  initPieCharts();
});
</script>

<style scoped lang="scss">
.leftScreenContainer {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .tourist {
    width: 100%;
    flex: 5;
    background: url('@/assets/images/screen/dataScreen-main-lt.png') no-repeat;
    background-size: 100% 100%;
    background-position: center center;
    .touristTitle {
      color: white;
      position: relative;
      p {
        &:nth-child(3) {
          position: absolute;
          right: 5px;
        }
      }
    }
    .touristNumber {
      width: 100%;
      height: 60px;
      margin-top: 30px;
      display: flex;
      span {
        flex: 1;
        height: 100%;
        margin-left: 3px;
        margin-right: 3px;
        text-align: center;
        line-height: 60px;
        font-size: 40px;
        color: aqua;
        background-image: url('@/assets/images/screen/total.png');
        background-size: 100% 100%;
      }
    }
    .water {
      width: 100%;
      height: 300px;
      // background-color: red;
    }
  }
  .sex {
    width: 100%;
    flex: 4;
    background: url('@/assets/images/screen/dataScreen-main-lc.png') no-repeat;
    background-size: 100% 100%;
    display: flex;
    flex-direction: column;
    margin: 10px 0px;
    .sexTitle {
      color: white;
    }
    .sexBox {
      width: 100%;
      height: 150px;
      display: flex;
      justify-content: center;
      align-items: center;
      .man {
        display: flex;
        height: 111px;
        width: 80px;
        justify-content: center;
        align-items: center;
        background-image: url('@/assets/images/screen/man-bg.png');
        background-size: 100% 100%;
        margin-right: 30px;
      }
      .woman {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 111px;
        width: 80px;
        background-image: url('@/assets/images/screen/woman-bg.png');
        background-size: 100% 100%;
      }
    }
    .percent {
      position: relative;
      flex: 1;
      color: white;
    }
  }
  .age {
    width: 100%;
    flex: 4;
    display: flex;
    flex-direction: column;
    background: url('@/assets/images/screen/dataScreen-main-lb.png') no-repeat;
    background-size: 100% 100%;
    .ageTitle {
      color: white;
    }
    .pieCharts {
      flex: 1;
      width: 100%;
    }
  }
}
</style>
