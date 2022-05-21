<template>
    <van-pull-refresh style="min-height: 100vh;" v-model="refreshing" @refresh="onRefresh">
        <van-skeleton :loading="entering" :row="3">
            <van-list v-model:loading="loading" :finished="!hasNextPage" finished-text="没有更多了" @load="onLoad"
                immediate-check="false">
                <van-cell-group inset>
                    <van-cell center is-link :value="user + ' user(s) in Total'" @click="gotoUser">
                        <template #title>
                            <van-icon name="user-circle-o" size="30" />
                        </template>
                    </van-cell>
                    <van-cell center is-link :value="job + ' job(s) in Total'" @click="gotoJob">
                        <template #title>
                            <van-icon name="orders-o" size="30" />
                        </template>
                    </van-cell>
                    <van-swipe-cell v-for="history in histories" :key="history.id">
                        <van-cell :title="history.info == '' ? '[无备注]' : history.info" center
                            :style="{ width: '100%' }">
                            <template #value>
                                <van-tag class="tag" v-if="history.status == 'SUCCESS'" type="success">
                                    {{ history.status }}
                                </van-tag>
                                <van-tag class="tag" v-else-if="history.status == 'RUNNING'" type="warning">
                                    {{ history.status }}
                                </van-tag>
                                <van-tag class="tag" v-else-if="history.status == 'PARTIALLY'" type="primary">
                                    {{ history.status }}
                                </van-tag>
                                <van-tag class="tag" v-else type="danger">
                                    {{ history.status }} </van-tag><br />
                                <van-icon :name="history.isManual ? 'play-circle-o' : 'underway-o'"></van-icon>
                                <span>{{ history.time }}</span>
                            </template>
                            <template #label>
                                <span>{{ String(history.userId).replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') }}</span>
                            </template>
                        </van-cell>
                        <template #right>
                            <van-button type="danger" @click="deleteHistory(history.id)" :style="{ height: '100%' }">删除
                            </van-button>
                        </template>
                    </van-swipe-cell>
                </van-cell-group>
            </van-list>
        </van-skeleton>
    </van-pull-refresh>
</template>

<script>
import api from "../api/api";
import {
    Icon,
    Cell,
    CellGroup,
    Row,
    Col,
    Dialog,
    Field,
    PullRefresh,
    Tag,
    SwipeCell,
    Loading,
    Skeleton,
    Button,
    List,
} from "vant";
export default {
    components: {
        [Icon.name]: Icon,
        [Cell.name]: Cell,
        [CellGroup.name]: CellGroup,
        [Row.name]: Row,
        [Col.name]: Col,
        [Dialog.name]: Dialog,
        [Field.name]: Field,
        [PullRefresh.name]: PullRefresh,
        [Tag.name]: Tag,
        [SwipeCell.name]: SwipeCell,
        [Loading.name]: Loading,
        [Skeleton.name]: Skeleton,
        [Button.name]: Button,
        [List.name]: List,
    },
    mounted() {
        this.init();
        setTimeout(() => {
            this.entering = false;
        }, 1000);

    },
    data() {
        return {
            userNum: 0,
            jobNum: 0,
            histories: [],
            refreshing: false,
            loading: true,
            nextPage: 1,
            pageSize: 10,
            hasNextPage: true,
            entering: true
        };
    },
    methods: {
        init() {
            fetch(api + "/info")
                .then((resp) => resp.json())
                .then((respJson) => {
                    this.user = respJson.data.userNum;
                    this.job = respJson.data.jobNum;
                })
                .then(() => {
                    this.getJobs();
                })
                .then(() => {
                    this.loading = false;
                })
                .then(() => {
                    this.getHistories();
                })
                .then(() => {
                    setTimeout(() => {
                        this.refreshing = false;
                    }, 500);
                });
        },
        onRefresh() {
            this.init();
        },
        onLoad() {
            this.getHistories();
            //由于无法保证load时job先于onLoad，所以关闭自动加载
        },
        getJobs() {
            fetch(api + "/job", { method: "GET" })
                .then((resp) => resp.json())
                .then((respJson) => {
                    this.jobs = respJson.data;
                });
        },
        getHistories(refresh = false) {
            if (refresh) {
                this.hasNextPage = true;
                this.nextPage = 1;
            }
            if (!this.hasNextPage) return;
            const page = this.nextPage;
            const pageSize = this.pageSize;
            fetch(api + "/history?page=" + page + "&pageSize=" + pageSize, {
                method: "GET",
            })
                .then((resp) => resp.json())
                .then((respJson) => {
                    for (let i = 0; i < respJson.data.length; i++) {
                        respJson.data[i]["userId"] = "UNKNOWN";
                        respJson.data[i]["info"] = "[已删除]";
                        for (let j = 0; j < this.jobs.length; j++) {
                            if (respJson.data[i].jobId == this.jobs[j].id) {
                                respJson.data[i]["userId"] = this.jobs[j].source;
                                respJson.data[i]["info"] = this.jobs[j].info;
                                break;
                            }
                        }
                    }
                    return respJson.data;
                })
                .then((data) => {
                    if (data.length < pageSize) {
                        this.hasNextPage = false;
                    }
                    if (refresh) {
                        this.histories = data;
                    } else {
                        this.histories = this.histories.concat(data);
                    }
                    this.nextPage++;
                })
                .then(() => {
                    setTimeout(() => {
                        this.loading = false;
                    }, 500);
                });
        },
        gotoUser() {
            this.$router.push("/user");
        },
        gotoJob() {
            this.$router.push("/job");
        },
        deleteHistory(id) {
            Dialog.confirm({ message: "删除历史记录？" }).then(() => {
                fetch(api + "/history/" + id, {
                    method: "DELETE",
                })
                    .then((resp) => resp.json())
                    .then((respJson) => {
                        if (respJson.status) {
                            Dialog.alert({ message: "删除成功！" }).then(() =>
                                this.getHistories(true)
                            );
                        } else {
                            Dialog.alert({ message: respJson.message });
                        }
                    });
            });
        },
        debug() {
            console.log(
                Object.keys(this.$data)
                    .map((key) => key + "=" + this[key])
                    .join(",")
            );
        },
    },
};
</script>

<style scoped>
</style>