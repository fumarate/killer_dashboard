<template>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">


        <van-cell-group inset>
            <van-cell center icon="user-circle-o" is-link title="User" :value="user + ' in Total'" @click="gotoUser">
            </van-cell>
            <van-cell center icon="orders-o" is-link title="Job" :value="job + ' in Total'" @click="gotoJob">
            </van-cell>
            <van-cell v-for="history in histories" :key="history.id" @click="checkHistory(history.id)">
                {{ history.jobHash }}
            </van-cell>
        </van-cell-group>
    </van-pull-refresh>
</template>

<script>
import api from '../api/api'
import { Icon, Cell, CellGroup, Row, Col, Dialog, Field, PullRefresh } from 'vant';
export default {
    components: {
        [Icon.name]: Icon,
        [Cell.name]: Cell,
        [CellGroup.name]: CellGroup,
        [Row.name]: Row,
        [Col.name]: Col,
        [Dialog.name]: Dialog,
        [Field.name]: Field,
        [PullRefresh.name]: PullRefresh
    },
    mounted() {
        this.init()
    },
    data() {
        return {
            user: 0,
            job: 0,
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
                    this.user = respJson.data.info.user_num
                    this.job = respJson.data.info.job_num
                })
            fetch(api + "/history")
                .then(resp => resp.json())
                .then(respJson => {
                    this.histories = respJson.data.history
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
van-cell {}
</style>