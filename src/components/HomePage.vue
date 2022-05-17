<template>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">


        <van-cell-group inset>
            <van-cell center icon="user-circle-o" is-link title="User" :value="user + ' in Total'" @click="gotoUser">
            </van-cell>
            <van-cell center icon="orders-o" is-link title="Job" :value="job + ' in Total'" @click="gotoJob">
            </van-cell>
            <van-cell  v-for="history in histories" :title="history.title" :key="history.id" @click="checkHistory(history.id)">
            <template #icon>
                <van-tag v-if="!history.checked" type="danger" round>NEW</van-tag>
            </template>

            {{history.datetime}}
            </van-cell>
        </van-cell-group>
    </van-pull-refresh>
</template>

<script>
import api from '../api/api'
import { Icon, Cell, CellGroup, Row, Col, Dialog, Field, PullRefresh,Tag } from 'vant';
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
        [Tag.name]:Tag
    },
    mounted() {
        this.init()
    },
    data() {
        return {
            userNum: 0,
            jobNum: 0,
            histories: [],
            refreshing: false
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