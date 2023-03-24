<template>
  <van-pull-refresh
    style="min-height: 100vh"
    v-model="refreshing"
    @refresh="onRefresh"
  >
    <van-skeleton :loading="entering" :row="3">
      <!-- <van-list
        v-model:loading="loading"
        :finished="!hasNextPage"
        finished-text="没有更多了"
        @load="onLoad"
        immediate-check="false"
      > -->
      <van-cell-group inset>
        <van-cell
          center
          is-link
          :value="jobNum + ' job(s) in Total'"
          @click="gotoJob"
        >
          <template #title>
            <van-icon name="orders-o" size="30" />
          </template>
        </van-cell>
        <div v-for="(job, index) in jobs" :key="index">
          <van-swipe-cell>
            <van-cell :style="{ width: '100%' }">
              <template #title>
                <van-tag :type="job.is_on ? 'success' : 'danger'"
                  >{{ job.is_on ? "运行" : "停止" }}
                </van-tag>
                {{
                  job.job_name == ""
                    ? "[无备注]"
                    : job.job_name.length >= 20
                    ? job.job_name.slice(20)
                    : job.job_name
                }}
              </template>
              <template #label>
                <van-tag
                  :type="
                    statusIdToTypeAndString(job.last_run_status.run_status)
                      .tag_type
                  "
                  >{{
                    statusIdToTypeAndString(job.last_run_status.run_status)
                      .tag_string
                  }}</van-tag
                >
                {{ timestampToDate(job.last_run_status.timestamp) }}
              </template>
              <template #value>
                <van-icon name="close"></van-icon>
                {{ job.black_list.length ? job.black_list.join(",") : "[无]" }}
                <br />
                <van-icon name="passed"></van-icon>
                {{
                  job.need_list
                    .map((need) => need.keyword + "*" + need.amount)
                    .join(",")
                }}
              </template>
            </van-cell>
            <template #left>
              <van-button
                :style="{ height: '100%' }"
                type="primary"
                @click="editJob(job.job_id)"
                >编辑
              </van-button>
              <van-button
                :style="{ height: '100%' }"
                @click="runJob(job.job_id)"
                >运行</van-button
              >
            </template>
            <template #right>
              <van-button
                :style="{ height: '100%' }"
                v-if="job.enable"
                @click="enableJob(job.job_id, 0)"
              >
                关闭
              </van-button>
              <van-button
                :style="{ height: '100%' }"
                v-else
                @click="enableJob(job.job_id, 1)"
                >开启
              </van-button>
              <van-button
                :style="{ height: '100%' }"
                type="danger"
                @click="deleteJob(job.job_id)"
                >删除
              </van-button>
            </template>
          </van-swipe-cell>
        </div>
      </van-cell-group>
      <!-- </van-list> -->
    </van-skeleton>
  </van-pull-refresh>
</template>

<script>
import moment from "moment";
import { getJobAmount, getJobs } from "../api/job";
export default {
  async mounted() {
    this.jobNum = await getJobAmount();
    this.jobs = await getJobs();
  },
  data() {
    return {
      jobs: [],
      jobNum: 0,
      refreshing: false,
      loading: false,
      nextPage: 1,
      pageSize: 10,
      hasNextPage: true,
      entering: false,
    };
  },
  methods: {
    async onRefresh() {
      await mounted();
    },
    gotoJob() {
      this.$router.push("/job");
    },
    timestampToDate(timestamp) {
      return moment.unix(timestamp).format("YYYY/MM/DD HH:mm:SS");
    },
    statusIdToTypeAndString(statusId) {
        statusId = Number.parseInt(statusId)
      const statusString = ["未知状态","成功", "失败", "部分成功"][statusId<=3?statusId:0];
      const statusType = ["warning","success", "danger", "primary"][
        statusId <= 3 ? statusId : 0
      ];
      return {
        tag_string: statusString,
        tag_type: statusType,
      };
    },
  },
};
</script>

<style scoped>
</style>