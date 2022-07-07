<template>
    <van-pull-refresh style="min-height: 100vh;" v-model="refreshing" @refresh="onRefresh">
        <van-skeleton title row="3" :loading="loading">
            <van-cell-group inset>
                <van-swipe-cell v-for="(user, index) in users" :key="index">
                    <van-cell>
                        <template #title>
                            <span>{{ String(user.userId).replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') }}
                            </span>
                        </template>
                        <template #value>
                            <van-tag :type="user.tokenValid ? 'primary' : 'danger'">{{ user.tokenValid ? 'OK' :
                                    'INVALID'
                            }}
                            </van-tag>
                        </template>
                    </van-cell>
                    <template #right>
                        <van-button @click="updateUser(index)">更新</van-button>
                        <van-button type="danger" @click="deleteUser(index)">删除</van-button>
                    </template>
                </van-swipe-cell>
            </van-cell-group>
            <div style="margin:16px">
                <van-button type="primary" round @click="addUser" :style="{ width: '100%' }">添加用户</van-button>
            </div>
        </van-skeleton>
    </van-pull-refresh>
</template>
<script>
import { default as api } from '../api/api'
export default {
    data() {
        return {
            users: null,
            newUserId: "",
            newUserCaptcha: "",
            refreshing: false,
            loading: true
        };
    },
    mounted() {
        this.getUser()
        setTimeout(
            () => {
                this.loading = false;
            },
            500)
    },
    methods: {
        onRefresh() {
            this.getUser();
            setTimeout(() => {
                this.refreshing = false;
            }, 1000);
        },
        getUser() {
            fetch(api + "/user", {
                method: "GET",
            })
                .then((resp) => resp.json())
                .then((respJson) => (this.users = respJson.data))
        },
        addUser: function () {
            this.$router.push("/user/add");
        },
        deleteUser: function (index) {
            const user = this.users[index];
            Dialog.confirm({
                "message": "确定删除用户" + user.userId + "吗？"
            })
                .then(() => {
                    fetch(api + "/user/" + user.userId, {
                        method: "delete",
                    })
                        .then((resp) => resp.json())
                        .then((respJson) => {
                            if (respJson.status) {
                                Dialog.alert({ message: "删除成功!" });
                                location.reload();
                            } else {
                                Dialog.alert({ message: respJson.exception });
                            }
                        });
                })
        },
        updateUser: function (index) {
            const user = this.users[index];
            this.$router.push({
                path: "/user/add",
                query: {
                    userId: user.userId
                },
            });
        }
    }
}
</script>
<style scoped>
</style>