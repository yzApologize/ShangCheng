<template>
  <div class="rightScreen">
    <div class="rightScreenTop">
      <div class="topTitle">
        <p>热门景区排行</p>
        <img src="@/assets/images/screen/dataScreen-title.png" alt="" />
      </div>
      <div class="topContent">
        <ul>
          <li>排名</li>
          <li>景区</li>
          <li>预约数量</li>
        </ul>
      </div>
      <div class="tableContent">
        <tableItem />
      </div>
    </div>
    <div class="rightScreenCenter">
      <div class="centerTitle">
        <p>年度游客量对比</p>
        <img src="@/assets/images/screen/dataScreen-title.png" alt="" />
      </div>
    </div>
    <div class="rightScreenBottom">
      <div class="bottomTitle">
        <p>预约渠道数据统计</p>
        <img src="@/assets/images/screen/dataScreen-title.png" alt="" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import tableItem from './components/tableItem.vue';
</script>

<style scoped lang="scss">
.rightScreen {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .rightScreenTop {
    width: 100%;
    flex: 4;
    display: flex;
    flex-direction: column;
    background-image: url('@/assets/images/screen/dataScreen-main-rt.png');
    background-size: 100% 100%;
    .topTitle {
      color: white;
    }
    .topContent {
      width: 100%;
      height: 40px;
      margin-top: 10px;
      background-image: url('@/assets/images/screen/rankingChart-bg.png');
      background-size: 100% 100%;
      ul {
        width: 100%;
        height: 100%;
        display: flex;
        li {
          text-align: center;
          line-height: 40px;
          color: orange;
          &:nth-child(1) {
            width: 20%;
          }
          &:nth-child(2) {
            width: 20%;
          }
          &:nth-child(3) {
            width: 60%;
          }
        }
      }
    }
    .tableContent {
      flex: 1;
    }
  }
  .rightScreenCenter {
    width: 100%;
    flex: 3;
    margin: 10px 0px;
    background-image: url('@/assets/images/screen/dataScreen-main-rc.png');
    background-size: 100% 100%;
    .centerTitle {
      color: white;
    }
  }

  .rightScreenBottom {
    width: 100%;
    flex: 3;
    background-image: url('@/assets/images/screen/dataScreen-main-rb.png');
    background-size: 100% 100%;
    .bottomTitle {
      color: white;
    }
  }
}
</style>
