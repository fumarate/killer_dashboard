<template>
    <van-pull-refresh v-model="jobLoading" @refresh="onRefresh">
        <van-button type="primary" @click="addJob" :style="{ width: '100%' }">添加任务</van-button>
        <van-cell-group>
            <van-swipe-cell v-for="(job, index) in jobs" :key="index">
                <van-button @click="viewJob(index)" :style="{ width: '100%' }">{{ job.source }}{{ job.needList }}
                </van-button>
                <template #right>
                    <van-button @click="runJob(job.job_hash)">运行</van-button>
                    <van-button type="danger" @click="deleteJob(job.job_hash)">删除</van-button>
                </template>
            </van-swipe-cell>
        </van-cell-group>
    </van-pull-refresh>
</template>

<script>
import * as moment from 'moment';
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
const api = "http://127.0.0.1:8080";
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
            newJob: {},
            jobAddRef: document.getElementById('jobAdd'),
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
        viewJob(jobIndex) {
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
            })
        },
        runJob: function (jobHash) {
            if (Dialog.confirm({ message: "运行任务" + jobHash + "?" })) {
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
            }
        },
        deleteJob: function (jobHash) {
            if (Dialog.confirm({ message: "删除任务" + jobHash + "?" })) {
                fetch(api + "/job/" + jobHash, {
                    method: "delete",
                })
                    .then((resp) => resp.json())
                    .then((respJson) => {
                        if (respJson.status) {
                            Dialog.alert({ message: "成功。" });
                        } else {
                            Dialog.alert({ message: respJson.exception });
                        }
                    });
            }
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