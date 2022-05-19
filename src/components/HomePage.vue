<template>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <div style="height:1rem"></div>
        <van-loading v-if="loading" type="spinner" />
        <van-skeleton :loading="loading" title :row="3">
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
                    <van-cell :title="history.info" center :style="{ width: '100%' }">
                        <template #value>
                            <van-tag class="tag" v-if="history.status == 'SUCCESS'" type="success">
                                {{
                                        history.status
                                }}
                            </van-tag>
                            <van-tag class="tag" v-else-if="history.status == 'RUNNING'" type="warning">
                                {{
                                        history.status
                                }}
                            </van-tag>
                            <van-tag class="tag" v-else type="danger">
                                {{
                                        history.status
                                }}
                            </van-tag><br>
                            <van-icon :name="history.isManual ? 'play-circle-o' : 'underway-o'"></van-icon>
                            <span>{{
                                    history.time
                            }}</span>
                        </template>
                        <template #label>
                            <span>{{ history.userId }}</span>
                        </template>
                    </van-cell>
                    <template #right>
                        <van-button type="danger" @click="deleteHistory(history.id)" :style="{ height: '100%' }">删除
                        </van-button>
                    </template>
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
    Skeleton,
    Button
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
        [Skeleton.name]: Skeleton,
        [Button.name]: Button
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
                            for (let i = 0; i < this.histories.length; i++) {
                                for (let j = 0; j < respJson.data.length; j++) {
                                    this.histories[i]["userId"] = "UNKNOWN"
                                    this.histories[i]["info"] = "[已删除]"
                                    if (this.histories[i].jobId == respJson.data[j].id) {
                                        this.histories[i]["userId"] = respJson.data[j].source
                                        this.histories[i]["info"] = respJson.data[j].info;
                                        break;
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