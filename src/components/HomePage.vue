<template>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <div style="height:1rem"></div>
        <van-loading v-if="loading" type="spinner" />
        <van-skeleton :loading="loading" title :row="3">
            <van-cell-group inset>
                <van-cell center icon="user-circle-o" is-link title="User" :value="user + ' in Total'"
                    @click="gotoUser">
                </van-cell>
                <van-cell center icon="orders-o" is-link title="Job" :value="job + ' in Total'" @click="gotoJob">
                </van-cell>
                <van-swipe-cell v-for="history in histories" :key="history.id">
                    <van-cell :title="history.title" center>
                        <template #icon>
                            <van-tag v-if="history.status == 'SUCCESS'" type="success">{{ history.status }}</van-tag>
                            <van-tag v-if="history.status == 'RUNNING'" type="warning">{{ history.status }}</van-tag>
                            <van-tag v-if="history.status == 'FAILED'" type="danger">{{ history.status }}</van-tag>
                        </template>
                        <div>
                            <van-icon :name="history.isManual?'play-circle-o':'underway-o'"></van-icon>
                        {{ history.time }}
                        </div>
                    </van-cell>
                    <!--template #right>
                        <van-button type="danger" @click="deleteHistory(history.id)">删除</van-button>
                    </!--template-->
                </van-swipe-cell>
            </van-cell-group>
        </van-skeleton>
    </van-pull-refresh>
</template>

<script>
import api from '../api/api'
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
    Checkbox,
    SwipeCell,
    Loading,
    Skeleton
} from 'vant';
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
        [Checkbox.name]: Checkbox,
        [SwipeCell.name]: SwipeCell,
        [Loading.name]: Loading,
        [Skeleton.name]: Skeleton
    },
    mounted() {
        this.init()
        setTimeout(
            () => {
                this.loading = false;
            },
            500)
    },
    data() {
        return {
            userNum: 0,
            jobNum: 0,
            histories: [],
            refreshing: false,
            loading: true
        }
    },
    methods: {
        onRefresh() {
            this.init()
            setTimeout(
                () => {
                    this.refreshing = false;
                },
                1000
            );
        },
        init() {
            fetch(api + "/info")
                .then(resp => resp.json())
                .then(respJson => {
                    this.user = respJson.data.userNum
                    this.job = respJson.data.jobNum
                })
            fetch(api + "/history")
                .then(resp => resp.json())
                .then(respJson => {
                    this.histories = respJson.data
                }).then(() => {
                    fetch(api + "/job")
                        .then(resp => resp.json())
                        .then((respJson) => {
                            for (let i = 0; i < respJson.data.length; i++) {
                                for (let j = 0; j < this.histories.length; j++) {
                                    if (this.histories[j].jobId == respJson.data[i].id) {
                                        this.histories[j]["title"] = respJson.data[i].info
                                    }
                                }
                            }
                        })
                })
        },
        gotoUser() {
            this.$router.push('/user');
        },
        gotoJob() {
            this.$router.push('/job');
        },
        checkHistory(id) {
            Dialog.confirm({ message: "检查历史记录" })
                .then(() => {
                    fetch(api + "/history/" + id,
                        {
                            method: "POST"
                        })
                        .then(resp => resp.json())
                        .then(respJson => {
                            if (respJson.status) {
                                Dialog.alert({ message: "检查成功" })
                            } else {
                                Dialog.alert({ message: respJson.exception })
                            }
                        })
                })
        }
    }
}
</script>

<style scoped>
</style>