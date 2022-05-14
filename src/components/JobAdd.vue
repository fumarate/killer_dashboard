<template>
    <van-cell-group>
        <van-cell>
            <van-field v-model="job.source" is-link readonly label="账号" placeholder="请选择商家"
                @click="selectingSource = true">
            </van-field>
            <van-popup v-model:show="selectingSource" round position="bottom">
                <van-cascader :options="sources" title="选择账号" @close="selectingSource = false" @finish="onSourceSelect">
                </van-cascader>
            </van-popup>
        </van-cell>
        <van-cell>
            <van-field v-model="job.target" is-link readonly label="目标" placeholder="请选择商家"
                @click="selectingTarget = true">
            </van-field>
            <van-popup v-model:show="selectingTarget" round position="bottom">
                <van-cascader :options="targets" title="选择目标" @close="selectingTarget = false" @finish="onTargetSelect">
                </van-cascader>
            </van-popup>
        </van-cell>
        <van-cell>
            <van-field v-model="job.shopId" is-link readonly label="商家" placeholder="请选择商家"
                @click="selectingShop = true">
                <template #button>
                    <van-button @click="visitShop(newJobShopId)" size="small">查看</van-button>
                </template>
            </van-field>
            <van-popup v-model:show="selectingShop" round position="bottom">
                <van-cascader :options="shops" title="选择商家" @close="selectingShop = false" @finish="onShopSelect">
                </van-cascader>
            </van-popup>
        </van-cell>

        <van-cell>
            <div v-for="(word, index) in job.blackList" :key="index">
                <van-button @click="removeBlackListNewWord(index)">{{ word }}</van-button>
            </div>
            <van-field v-model="blackListNewWord" placeholder="黑名单关键词">
                <template #button>
                    <van-button @click="addBlackListNewWord" size="small">添加</van-button>
                </template>
            </van-field>
        </van-cell>
        <van-cell>
            <van-cell-group>
                <van-cell v-for="(value, key) in job.needList" :key="value">
                    <van-button @click="removeNeedListNewWord(key)">{{ key }}</van-button>
                    <van-stepper v-model="job.needList[key]" integer min="1" theme="round"></van-stepper>
                </van-cell>
            </van-cell-group>
            <van-field v-model="needListNewWord" placeholder="需求关键词">
                <template #button>
                    <van-button @click="addNeedListNewWord" size="small">添加</van-button>
                </template>
            </van-field>
        </van-cell>
        <van-cell>
            <van-field v-model="time" is-link readonly label="账号" placeholder="请选择商家" @click="selectingTime = true">
            </van-field>
            <van-popup v-model:show="selectingTime" round position="bottom">
                <van-datetime-picker v-model="currentTime" type="time" title="选择时间" @confirm="onTimeSelect"
                    @cancel="selectingTime = false" />
            </van-popup>
        </van-cell>
        <van-cell>
            <van-button @click="addJob">添加</van-button>
        </van-cell>
    </van-cell-group>
</template>

<script>
import * as moment from 'moment';
import { Button, Cascader, Cell, CellGroup, DatetimePicker, Dialog, Field, Popover, Popup, Stepper, Col, Row } from 'vant'
const api = "http://127.0.0.1:8080";
export default {
    props(job) {
        this.job = job
    },
    components: {
        [Button.name]: Button,
        [Cascader.name]: Cascader,
        [Cell.name]: Cell,
        [CellGroup.name]: CellGroup,
        [DatetimePicker.name]: DatetimePicker,
        [Dialog.Component.name]: Dialog.Component,
        [Field.name]: Field,
        [Popover.name]: Popover,
        [Popup.name]: Popup,
        [Col.name]: Col,
        [Row.name]: Row,
        [Stepper.name]: Stepper
    },
    data() {
        return {
            users: [],
            selectingSource: false,
            selectingTarget: false,
            selectingShop: false,
            selectingTime: false,
            blackListNewWord: "",
            needListNewWord: "",
            job: {
                source: "未选择",
                target: "默认",
                shopId: "默认",
                hour: 0,
                minute: 0,
                blackList: [],
                needList: {}
            },

        }
    },
    mounted() {
        fetch(api + "/user", {
            method: "GET",
        })
            .then((resp) => resp.json())
            .then((respJson) => {
                this.users = respJson.data.users;
            });

        fetch(api + "/school/229", { method: "GET" })
            .then((resp) => resp.json())
            .then((respJson) => {
                this.shops = respJson.data.shops.map((shop) => {
                    return {
                        value: shop.shop_id,
                        text: shop.shop_name,
                    }
                });
            });
    },
    methods: {
        selectSource() {
            this.selectingSource = true;
        },
        selectTarget() {
            this.selectingTarget = true;
        },
        selectShop() {
            this.selectingShop = true;
        },

        onSourceSelect(action) {
            this.job.source = action.value;
            this.selectingSource = false;
        },
        onTargetSelect(action) {
            this.job.target = action.value;
            this.selectingTarget = false;
        },
        onShopSelect(action) {
            this.job.shopId = action.value;
            this.selectingShop = false;
        },
        onTimeSelect(action) {
            this.job.hour = Number(action.split(":")[0]);
            this.job.minute = Number(action.split(":")[1]);
            this.selectingTime = false;
        },
        addBlackListNewWord() {
            if (!this.blackListNewWord) return;
            const newKey = this.blackListNewWord
                .replaceAll('"', "")
                .replaceAll("'", "");
            let flag = true;
            this.job.blackList.forEach((word) => {
                if (newKey === word) {
                    flag = false;
                    //上边出来一个提示
                }
            });
            if (flag) {
                this.job.blackList.push(newKey);
                this.blackListNewWord = "";
            }
        },
        removeBlackListNewWord(index) {
            Dialog.confirm({ message: "删除黑名单关键词\"" + this.job.blackList[index] + "\"?" })
                .then(() => {
                    if (index < this.job.blackList.length) {
                        this.job.blackList.splice(index, 1);
                    }
                })

        },
        addNeedListNewWord() {
            if (!this.needListNewWord) return;
            const newKey = this.needListNewWord
                .replaceAll('"', "")
                .replaceAll("'", "");
            if (!(newKey in this.job.needList)) {
                this.job.needList[newKey] = 1;
                this.needListNewWord = "";
                //alert
            }
        },
        removeNeedListNewWord(word) {
            Dialog.confirm({ message: "删除需求\"" + word + "\"?" })
                .then(() => {
                    if (word in this.job.needList) {
                        delete this.job.needList[word];
                    }
                })
        },
        addJob: function () {
            if (Dialog.confirm("添加任务?")) {
                fetch(api + "/job", {
                    method: "post",
                    body: JSON.stringify(this.job),
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                    .then((resp) => resp.json())
                    .then((respJson) => {
                        if (respJson.status) {
                            alert("添加成功。");
                            location.reload();
                        } else {
                            alert(respJson.exception);
                        }
                    });
            }
        },
    },
    computed: {
        sources: function () {
            let options = new Array();
            options.push({
                value: "0",
                text: "未选择"
            });
            this.users.map((user) => {
                options.push(
                    {
                        text: user.userId,
                        value: user.userId
                    }
                );
            });
            return options;
        },
        targets: function () {
            let options = new Array();
            options.push({
                value: "default",
                text: "默认"
            });
            let user = null;
            for (let i = 0; i < this.users.length; i++) {
                if (this.users[i].userId == this.job.source) {
                    user = this.users[i];
                    break;
                }
            }
            if (!user) {
                return options;
            }
            user.addresses.map((address) => {
                options.push(
                    {
                        text: address,
                        value: address
                    }
                );
            });
            return options;
        },
        time() {
            let timeObject = moment(new Date()).hour(this.job.hour).minute(this.job.minute);
            return timeObject.format("HH:mm");
        },
    }
}
</script>

<style scoped>
</style>