<template>
    <van-form>
        <van-cell-group inset>
            <van-field v-model="newUserId" label="手机号码" :rules="[{ required: true, message: '请填写手机号' }]" />
            <van-field v-model="newUserCaptcha" label="验证码" :rules="[{ required: true, message: '请填写验证码' }]">
                <template #button>
                    <van-button type="primary" @click="requestCaptcha" size="small">发送验证码</van-button>
                </template>
            </van-field>

        </van-cell-group>
        <div style="margin:16px">
            <van-button type="primary" round v-model="newUserCaptcha" @click="addUser" :style="{ width: '100%' }">添加用户
            </van-button>
        </div>
    </van-form>
</template>

<script>
import { default as api } from '../api/api'
import { Button, Cell, CellGroup, Dialog, Field, Form, SwipeCell } from 'vant'
export default {
    components: {
        [Button.name]: Button,
        [Cell.name]: Cell,
        [CellGroup.name]: CellGroup,
        [Dialog.name]: Dialog,
        [Field.name]: Field,
        [SwipeCell.name]: SwipeCell,
        [Form.name]: Form
    },
    data() {
        return {
            newUserId: "",
            newUserCaptcha: "",
        };
    },
    mounted() {
    },
    methods: {
        addUser: function () {
            if (
                this.newUserId.length === 11 &&
                this.newUserCaptcha.length === 4
            ) {
                fetch(api + "/user/" + this.newUserId, {
                    method: "post",
                    body: JSON.stringify({
                        captcha: this.newUserCaptcha,
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                    .then((resp) => resp.json())
                    .then((respJson) => {
                        if (respJson.status) {
                            Dialog.alert({ message: "添加成功!" })
                                .then(() => {
                                    this.$router.back();
                                });
                        } else {
                            Dialog.alert({ message: respJson.message });
                        }
                    });
            }
        },
        requestCaptcha: function () {
            if (this.newUserId.length === 11) {
                fetch(api + "/captcha/" + this.newUserId, {
                    method: "get",
                })
                    .then((resp) => resp.json())
                    .then((respJson) => {
                        if (respJson.status) {
                            Dialog.alert({ message: "请求成功!" });
                        } else {
                            Dialog.alert({ message: respJson.message });
                        }
                    });
            }
        },
    }
}
</script>

<style>
</style>