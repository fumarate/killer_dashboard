<template>
    <van-cell-group inset>
        <van-button type="primary" @click="addUser" :style="{ width: '100%' }">添加用户</van-button>
        <van-swipe-cell v-for="user in users" :key="user.userId">
            <van-cell>
                {{ user.userId }}
            </van-cell>
            <template #right>
                <van-button type="danger" @click="deleteUser(user.userId)">删除</van-button>
            </template>
        </van-swipe-cell>
    </van-cell-group>
</template>
<script>
import { default as api } from '../api/api'
import { Button, Cell, CellGroup, Dialog, Field, SwipeCell } from 'vant'
export default {
    components: {
        [Button.name]: Button,
        [Cell.name]: Cell,
        [CellGroup.name]: CellGroup,
        [Dialog.name]: Dialog,
        [Field.name]: Field,
        [SwipeCell.name]: SwipeCell
    },
    data() {
        return {
            users: null,
            newUserId: "",
            newUserCaptcha: "",
        };
    },
    mounted() {
        fetch(api + "/user", {
            method: "GET",
        })
            .then((resp) => resp.json())
            .then((respJson) => (this.users = respJson.data.users));
    },
    methods: {
        addUser: function () {
            this.$router.push("/user/add");
        },
        deleteUser: function (userId) {
            Dialog.confirm({
                "message": "确定删除用户" + userId + "吗？"
            })
                .then(() => {
                    fetch(api + "/user/" + userId, {
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
    }
}
</script>