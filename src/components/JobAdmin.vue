<template>
    <van-pull-refresh v-model="jobLoading" @refresh="onRefresh">
        <van-cell-group inset>
            <van-button type="primary" @click="addJob" :style="{ width: '100%' }">添加任务</van-button>
            <van-swipe-cell v-for="(job, index) in jobs" :key="index">
                <van-button @click="viewJob(index)" :style="{ width: '100%' }">{{ job.source }}{{ job.needList }}
                </van-button>
                <template #right>
                    <van-button v-if="job.enable" @click="enableJob(job.hash, 0)">关闭</van-button>
                    <van-button v-else @click="enableJob(job.hash, 1)">开启</van-button>
                    <van-button @click="runJob(job.hash)">运行</van-button>
                    <van-button type="danger" @click="deleteJob(job.hash)">删除</van-button>
                </template>
            </van-swipe-cell>
        </van-cell-group>
    </van-pull-refresh>
</template>

<script>
//import * as moment from 'moment';
import {
    Button,
    Cell,
    CellGroup,
    Collapse,
    CollapseItem,
    DropdownMenu,
    DropdownItem,
    DatetimePicker,
    Dialog,
    Field,
    Popup,
    PullRefresh,
    SwipeCell
} from 'vant';
import { default as api } from '../api/api'
export default {
    components: {
        [Button.name]: Button,
        [Cell.name]: Cell,
        [CellGroup.name]: CellGroup,
        [Collapse.name]: Collapse,
        [CollapseItem.name]: CollapseItem,
        [DropdownMenu.name]: DropdownMenu,
        [DropdownItem.name]: DropdownItem,
        [DatetimePicker.name]: DatetimePicker,
        [Dialog.Component.name]: Dialog.Component,
        [Field.name]: Field,
        [Popup.name]: Popup,
        [PullRefresh.name]: PullRefresh,
        [SwipeCell.name]: SwipeCell,
    },
    data() {
        return {
            adding: false,
            jobs: [],
            jobLoading: false
        };
    },
    mounted() {
        this.getJob();
    },

    methods: {
        visitShop(shopId) {
            window.location.href =
                "http://service-h0jbiq9b-1300814016.sh.apigw.tencentcs.com/shop/" +
                shopId;
        },
        onRefresh() {
            setTimeout(() => {
                this.getJob();
            }, 1000);
        },
        addJob() {
            this.$router.push("/job/add");
        }
        ,
        getJob() {
            this.jobLoading = true;
            fetch(api + "/job", {
                method: "GET",
            })
                .then((resp) => resp.json())
                .then((respJson) => (this.jobs = respJson.data.jobs))
                .finally(() => {
                    this.jobLoading = false;
                });
        },
        enableJob(hash, enable) {
            Dialog.confirm({ message: enable ? "启动" : "停止" + "任务" + hash + "?" })
                .then(() => {
                    for (let i = 0; i < this.jobs.length; i++) {
                        if (this.jobs[i].hash == hash) {
                            this.jobs[i].enable = enable;
                            this.putJob(this.jobs[i]);
                        }
                    }
                })
        },
        putJob(job) {
            if (job != null) {
                fetch(api + "/job/" + job.hash, {
                    method: "PUT",
                    body: JSON.stringify(job), headers: {
                        "Content-Type": "application/json",
                    },
                })
                    .then((resp) => resp.json())
                    .then((respJson) => {
                        if (respJson.code == 0) {
                            this.onRefresh();
                        }
                    });
            }
        },
        viewJob(jobIndex) {
            this.$router.push({
                path: "/job/add",
                query: {
                    job: JSON.stringify(this.jobs[jobIndex]),
                    update:true
                },
            });
            /*
               const job = this.jobs[jobIndex];
               let info = "账号：" + job.source + "\n" + "目标：" + job.target + "\n" + "时间：";
               info += moment(new Date()).hour(job.hour).minute(job.minute).format("HH:mm");
               info += "\n黑名单：" + job.blackList + "\n" + "需求商品：";
               for (var index in job.needList) {
                   info += index;
                   info += + job.needList[index] + "份\n";
               }
               Dialog.alert({
                   "title": "任务详情",
                   "message": info
               })*/
        },
        runJob: function (jobHash) {
            Dialog.confirm({ message: "运行任务" + jobHash + "?" })
                .then(() => {
                    fetch(api + "/job/" + jobHash + "/run", {
                        method: "post",
                    })
                        .then((resp) => resp.json())
                        .then((respJson) => {
                            if (respJson.status) {
                                Dialog.alert({ message: "成功。" });
                            } else {
                                Dialog.alert({ message: respJson.exception });
                            }
                        });
                })

        },
        deleteJob: function (jobHash) {
            Dialog.confirm({ message: "删除任务" + jobHash + "?" })
                .then(() => {
                    fetch(api + "/job/" + jobHash, {
                        method: "delete",
                    })
                        .then((resp) => resp.json())
                        .then((respJson) => {
                            if (respJson.status) {
                                Dialog.alert({ message: "成功。" })
                                    .then(() => this.getJob());

                            } else {
                                Dialog.alert({ message: respJson.exception });
                            }
                        });
                })
        },

    },
}
</script>
<style scoped>
van-cell {
    font-size: smaller;
}

span {
    font-size: smaller;
}
</style>