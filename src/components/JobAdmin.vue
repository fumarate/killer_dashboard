<template>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-dropdown-menu>
            <van-dropdown-item v-model="selectedSource" :options="sourceOption" />
        </van-dropdown-menu>
        <div style="height:1rem"></div>
        <van-skeleton :loading="loading" title :row="3">
            <van-cell-group inset>
                <div v-for="(job, index) in jobs" :key="index">
                    <div v-if="selectedSource == null ? true : job.source == selectedSource">
                        <van-swipe-cell>
                            <van-button :style="{ width: '100%' }" @click="viewJob(index)">{{ job.source }}:{{ job.info
                            }}
                            </van-button>
                            <template #left>
                                <van-button type="primary" @click="editJob(job.id)">编辑</van-button>
                            </template>
                            <template #right>
                                <van-button v-if="job.enable" @click="enableJob(job.id, 0)">关闭</van-button>
                                <van-button v-else @click="enableJob(job.id, 1)">开启</van-button>
                                <van-button @click="runJob(job.id)">运行</van-button>
                                <van-button type="danger" @click="deleteJob(job.id)">删除</van-button>
                            </template>
                        </van-swipe-cell>
                    </div>
                </div>
            </van-cell-group>
            <div style="margin:16px">
                <van-button type="primary" @click="addJob" :style="{ width: '100%' }" round>添加任务</van-button>
            </div>
        </van-skeleton>
    </van-pull-refresh>
</template>

<script>
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
    SwipeCell,
    Toast,
    Loading,
    Skeleton
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
        [Toast.name]: Toast,
        [Loading.name]: Loading,
        [Skeleton.name]: Skeleton
    },
    data() {
        return {
            adding: false,
            jobs: [],
            refreshing: false,
            selectedSource: null,
            sourceOption: [
            ],
            loading: true
        };
    },
    mounted() {
        this.getJob();
        setTimeout(
            () => {
                this.loading = false;
            },
            500)
    },

    methods: {
        visitShop(shopId) {
            window.location.href =
                "http://service-h0jbiq9b-1300814016.sh.apigw.tencentcs.com/shop/" +
                shopId;
        },
        onRefresh() {
            this.getJob();
            this.refreshing = true;
            setTimeout(() => {
                this.refreshing = false;
            }, 1000);
        },
        addJob() {
            this.$router.push("/job/add");
        }
        ,
        getJob() {
            fetch(api + "/job", {
                method: "GET",
            })
                .then((resp) => resp.json())
                .then((respJson) => (this.jobs = respJson.data))
                .then(() => {
                    let sources = {};
                    for (const job in this.jobs) {
                        sources[this.jobs[job].source] = 1;
                    }
                    this.sourceOption = Object.keys(sources).map((source) => {
                        return {
                            value: source,
                            text: source
                        }
                    });
                    this.sourceOption.unshift({
                        value: null,
                        text: '全部'
                    });
                })

        },
        enableJob(id, enable) {
            Dialog.confirm({ message: (enable ? "启动" : "停止") + "任务" + "?" })
                .then(() => {
                    for (let i = 0; i < this.jobs.length; i++) {
                        if (this.jobs[i].id == id) {
                            this.jobs[i].enable = enable;
                            this.putJob(this.jobs[i]);
                        }
                    }
                })
        },
        putJob(job) {
            if (job != null) {
                fetch(api + "/job/" + job.id, {
                    method: "PUT",
                    body: JSON.stringify(job), headers: {
                        "Content-Type": "application/json",
                    },
                })
                    .then((resp) => resp.json())
                    .then((respJson) => {
                        if (respJson.status) {
                            Toast("任务更新成功!")
                            this.onRefresh();
                        }
                    });
            }
        },
        viewJob(index) {
            const job = this.jobs[index];
            let info = "账号：" + job.source + "\n" + "目标：" + job.target + "\n" + "添加时间：";
            info += job.addTime;
            info += "\n黑名单：" + job.blackList + "\n" + "需求商品：";
            for (var key in job.needList) {
                info += index;
                info += + job.needList[key] + "份\n";
            }
            Dialog.alert({
                "title": "任务详情",
                "message": info
            })
        },
        editJob(id) {
            this.$router.push({
                path: "/job/add",
                query: {
                    id: id
                },
            });
        },
        runJob: function (id) {
            Dialog.confirm({ message: "运行任务" + id + "?" })
                .then(() => {
                    fetch(api + "/job/" + id + "/trig", {
                        method: "POST",
                    })
                        .then((resp) => resp.json())
                        .then((respJson) => {
                            if (respJson.status) {
                                Toast("已触发")
                            } else {
                                Dialog.alert({ message: respJson.message });
                            }
                        });
                })

        },
        deleteJob: function (id) {
            Dialog.confirm({ message: "删除任务" + id + "?" })
                .then(() => {
                    fetch(api + "/job/" + id, {
                        method: "DELETE",
                    })
                        .then((resp) => resp.json())
                        .then((respJson) => {
                            if (respJson.status) {
                                Toast("已删除")
                                this.getJob();
                            } else {
                                Dialog.alert({ message: respJson.message });
                            }
                        });
                })
        },

    },
    computed: {

    }
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