<template>
    <van-form>
        <van-cell-group inset>
            <van-field v-model="newUserId" label="手机号码" maxlength="11" :rules="[
            {
                required: true,
                message: '请填写手机号'
            }, {
                pattern: /^((13[0-9])|(14[5-9])|(15([0-3]|[5-9]))|(16[6-7])|(17[1-8])|(18[0-9])|(19[1|3])|(19[5|6])|(19[8|9]))\d{8}$/,
                message: '手机号格式不正确'
            }]" />
            <van-field v-model="newUserCaptcha" label="验证码" maxlength="4" :rules="[
            { required: true, message: '请填写验证码' },
            { validator: (val) => String(val).length == 4, message: '验证码有误' }]">
                <template #button>
                    <van-button type="primary" @click="requestCaptcha" size="small">发送验证码</van-button>
                </template>
            </van-field>
        </van-cell-group>
        <div style="margin:16px">
            <van-button v-if="update" type="primary" round v-model="newUserCaptcha" @click="updateUser"
                :style="{ width: '100%' }">
                更新用户
            </van-button>
            <van-button v-else blocktype="primary" round v-model="newUserCaptcha" @click="addUser"
                :style="{ width: '100%' }">添加用户
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
            update: false
        };
    },
    mounted() {
        if (this.$route.query.userId) {
            this.update = true;
            this.newUserId = this.$route.query.userId;
        }
    },
    methods: {
        addUser: function () {
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
        },
        updateUser: function () {
            fetch(api + "/user/" + this.newUserId, {
                method: "put",
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
                        Dialog.alert({ message: "更新成功!" })
                            .then(() => {
                                this.$router.back();
                            });
                    } else {
                        Dialog.alert({ message: respJson.message });
                    }
                });
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