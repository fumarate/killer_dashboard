<template>
  <van-form @submit="submit">
    <van-cell-group inset>
      <van-field label="任务名" v-model="job.info"> </van-field>
      <van-field
        v-model="shopSelectedNameWithId"
        is-link
        readonly
        label="商家"
        placeholder="请选择商家"
        @click="shopSelectingStart"
      >
      </van-field>
      <van-popup v-model:show="shopSelecting" round position="bottom">
        <van-cascader
          :options="shops"
          :field-names="{ text: 'shop_name', value: 'shop_id' }"
          title="选择商家"
          @close="shopSelecting = false"
          @finish="onShopSelect"
        >
        </van-cascader>
      </van-popup>
      <van-collapse v-model="keyword" accordion>
        <van-collapse-item
          title="黑名单"
          :value="job.blackList.join(',')"
          name="1"
        >
          <van-swipe-cell
            v-for="(word, index) in job.blackList"
            :key="index"
            @close="removeBlackListNewWord(index)"
          >
            <van-field v-model="job.blackList[index]"></van-field>
            <template #right>
              <van-button type="danger">删除</van-button>
            </template></van-swipe-cell
          >
          <van-field v-model="blackListNewWord" placeholder="黑名单关键词">
            <template #button>
              <van-button @click="addBlackListNewWord" size="small"
                >添加</van-button
              >
            </template>
          </van-field>
        </van-collapse-item>
        <van-collapse-item
          title="需求"
          :value="
          Object.keys(job.needList).map((key) => key+'*'+job.needList[key]).join(',')
          "
          name="2"
        >
          <van-swipe-cell v-for="(value, key) in job.needList" :key="value">
            <van-cell :style="{ width: '100%' }" :title="key">
              <template #value>
                <van-stepper
                  v-model="job.needList[key]"
                  integer
                  min="1"
                  theme="round"
                ></van-stepper>
              </template>
            </van-cell>

            <template #right>
              <van-button
                :style="{ height: '100%' }"
                type="danger"
                @click="removeNeedListNewWord(key)"
                >删除
              </van-button>
            </template>
          </van-swipe-cell>
          <van-field v-model="needListNewWord" placeholder="需求关键词">
            <template #button>
              <van-button @click="addNeedListNewWord" size="small"
                >添加</van-button
              >
            </template>
          </van-field>
          <van-row class="tags" type="flex">
        <van-tag
          class="tag"
          v-for="(word, index) in recommendedKeywords"
          :key="index"
          type="warning"
          round
          @click="needListNewWord = word"
          >{{ word }}</van-tag
        >
      </van-row>
        </van-collapse-item>
      </van-collapse>
      

      <van-field
        v-model="time"
        is-link
        readonly
        label="时间"
        placeholder="请选择时间"
        @click="timeSelecting = true"
      >
      </van-field>
      <van-popup v-model:show="timeSelecting" round position="bottom">
        <van-time-picker
          ref="timePicker"
          v-model="job.time"
          title="选择时间"
          @confirm="timeSelecting = false"
          @cancel="timeSelecting = false"
        />
      </van-popup>
      <van-field readonly label="超时">
        <template #input>
          <van-slider
            v-model="timeoutFakeValue"
            :min="0"
            :max="28"
            :step="0.01"
            class="timeout"
            @change="onTimeoutChange"
          >
            <template #button>
              <van-tag class="tag" type="primary" round
                >{{ timeoutRealValue }}
              </van-tag>
            </template>
          </van-slider>
        </template>
      </van-field>

      <van-field readonly label="运行状态" @click="job.enable = !job.enable">
        <template #right-icon>
          <van-switch
            v-model="job.enable"
            size="20"
            @click="job.enable = !job.enable"
          ></van-switch>
        </template>
      </van-field>
      <van-cell center>
        <van-radio-group v-model="job.mode" direction="horizontal">
          <van-radio :name="1">触发一次</van-radio>
          <van-radio :name="2">直到成功</van-radio>
          <van-radio :name="3">持续触发</van-radio>
        </van-radio-group>
      </van-cell>
    </van-cell-group>
    <div style="margin: 16px">
      <van-button type="primary" native-type="submit" round size="large">{{
        update ? "更新" : "添加"
      }}</van-button>
    </div>
  </van-form>
</template>

<script>
import * as moment from "moment";
import { getRecommendedKeywords } from "../api/misc";
import { getShop } from "../api/shop";
import { addJob, getJobById } from "../api/job";
import { showSuccessToast, showFailToast, showConfirmDialog } from "vant";
export default {
  data() {
    return {
      accountOptions: [],
      shops: [],
      shopSelecting: false,
      shopSelected: {
        shop_name: "",
        shop_id: -1,
      },
      keyword: null,
      targetSelecting: false,
      timeSelecting: false,
      blackListNewWord: "",
      needListNewWord: "",
      job: {
        target: -1,
        shopId: null,
        time:['08','00'],
        blackList: [],
        needList: {},
        enable: true,
        timeout: 300,
        info: "",
        mode: 1,
      },
      update: false,
      recommendedKeywords: [],
      loading: true,
      timeoutFakeValue: 900,
    };
  },
  async mounted() {
    this.recommendedKeywords = await getRecommendedKeywords();
    this.shops = await getShop();
    if (this.$route.query.id) {
      this.update = true;
      this.job = getJobById(this.$route.query.id);
    }
    this.loading = false;
  },
  methods: {
    submit() {
      if (this.update) {
        this.updateJob();
      } else {
        this.addJob();
      }
    },
    onTimeoutChange() {
      this.job.timeout = this.timeoutRealValue;
    },
    shopSelectingStart() {
      this.shopSelecting = true;
    },
    onShopSelect(action) {
      this.shops.forEach((shop) => {
        if (shop.shop_id == action.value) {
          this.shopSelected = shop;
        }
      });
      this.shopSelecting = false;
    },
    keyWordCheck(keyWord){
return keyWord.replaceAll('"', "")
        .replaceAll("'", "");
    },
    addBlackListNewWord() {
      if (!this.blackListNewWord) return;
      const newKey = this.keyWordCheck(this.blackListNewWord)
      let flag = true;
      this.job.blackList.forEach((word) => {
        if (newKey === word) {
          flag = false;
          showFailToast("关键词已存在！");
        }
      });
      if (flag) {
        this.job.blackList.push(newKey);
        this.blackListNewWord = "";
        showSuccessToast("添加成功。");
      }
    },
    removeBlackListNewWord(index) {
      showConfirmDialog({
        message: '删除黑名单关键词"' + this.job.blackList[index] + '"?',
      }).then(() => {
        if (index < this.job.blackList.length) {
          this.job.blackList.splice(index, 1);
        }
      });
    },
    addNeedListNewWord() {
      if (!this.needListNewWord) return;
      const newKey = this.keyWordCheck(this.needListNewWord);
      let flag=true;
      Object.keys(this.job.needList).forEach((word) => {
        if (newKey === word) {
          flag = false;
          showFailToast("关键词已存在！");
        }
      });
      if (flag) {
        this.job.needList[newKey] = 1;
        this.needListNewWord = "";
        showSuccessToast("添加成功。");
      }
    },
    removeNeedListNewWord(word) {
      showConfirmDialog({ message: '删除需求"' + word + '"?' }).then(() => {
        if (word in this.job.needList) {
          delete this.job.needList[word];
        }
        showSuccessToast("删除成功。");
      });
    },
    add: function () {
      if (this.job.source != null && this.job.needList != {}) {
        if (this.job.info == "") {
          this.job.info = Object.keys(this.job.needList)
            .map((key) => key + "*" + this.job.needList[key])
            .join(",");
        }
        showConfirmDialog({ message: "添加任务?" }).then(() => {
          const result = addJob(this.job);
          if (result != null) {
            showSuccessToast("添加成功");
            this.$router.back();
          }
        });
      }
    },
    updateJob() {
      Dialog.confirm({ message: "更新任务?" }).then(() => {
        fetch(api + "/job/" + this.job.id, {
          method: "PUT",
          body: JSON.stringify(this.job),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((resp) => resp.json())
          .then((respJson) => {
            if (respJson.status) {
              Dialog.alert({ message: "添加成功。" }).then(() => {
                this.$router.back();
              });
            } else {
              Dialog.alert({ message: respJson.message });
            }
          });
      });
    },
  },
  computed: {
    timeoutRealValue() {
      const tfv = Math.floor(this.timeoutFakeValue);
      if (tfv >= 0 && tfv <= 10) {
        return tfv;
      } else {
        return [
          20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 400, 500, 600, 700,
          800, 900, 999,
        ][tfv <= 28 ? tfv - 11 : 28];
      }
    },
    time() {
      let timeObject = moment(new Date())
        .hour(this.job.time[0])
        .minute(this.job.time[1]);
      return timeObject.format("HH:mm");
    },
    shopSelectedNameWithId() {
      if (this.shopSelected.shop_id == -1) {
        return "未选择";
      } else
        return (
          this.shopSelected.shop_name + "(" + this.shopSelected.shop_id + ")"
        );
    },
  },
};
</script>

<style scoped>
.tags {
  margin-left: 15px;
  margin-right: 15px;
}

.tag {
  padding: 5px;
  margin: 2px;
}
</style>