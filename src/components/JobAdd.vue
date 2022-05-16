<template>
    <van-form @submit="submit">
        <van-cell-group inset>
            <van-cell>
                <van-field v-model="realSource" is-link readonly label="账号" placeholder="请选择商家" @click="selectSource">
                </van-field>
                <van-popup v-model:show="selectingSource" round position="bottom">
                    <van-cascader :options="sources" title="选择账号" @close="selectingSource = false"
                        @finish="onSourceSelect">
                    </van-cascader>
                </van-popup>
            </van-cell>
            <van-cell>
                <van-field v-model="realTarget" is-link readonly label="目标" placeholder="请选择商家" @click="selectTarget">
                </van-field>
                <van-popup v-model:show="selectingTarget" round position="bottom">
                    <van-cascader :options="targets" title="选择目标" @close="selectingTarget = false"
                        @finish="onTargetSelect">
                    </van-cascader>
                </van-popup>
            </van-cell>

            <van-cell>
                <van-field v-model="realShop" is-link readonly label="商家" placeholder="请选择商家" @click="selectShop">
                    <!--template #button>
                    <van-button @click="visitShop(newJobShopId)" size="small">查看</van-button>
                </template-->
                </van-field>
                <van-popup v-model:show="selectingShop" round position="bottom">
                    <van-cascader :options="shops" title="选择商家" @close="selectingShop = false" @finish="onShopSelect">
                    </van-cascader>
                </van-popup>
            </van-cell>
            <van-cell>
                <van-row class="tags" type="flex">
                    <van-tag class="tag" v-for="(word, index) in job.blackList" :key="index" closeable type="primary"
                        @close="removeBlackListNewWord(index)">{{ word }}</van-tag>
                </van-row>
                <van-field v-model="blackListNewWord" placeholder="黑名单关键词">
                    <template #button>
                        <van-button @click="addBlackListNewWord">添加</van-button>
                    </template>
                </van-field>
            </van-cell>
            <van-cell>
                <van-swipe-cell v-for="(value, key) in job.needList" :key="value">
                    <van-field :label="key" readonly>
                        <template #button>
                            <van-stepper v-model="job.needList[key]" integer min="1" theme="round"></van-stepper>
                        </template>
                    </van-field>
                    <template #right>
                        <van-button type="danger" @click="removeNeedListNewWord(key)">删除</van-button>
                    </template>
                </van-swipe-cell>
                <van-field v-model="needListNewWord" placeholder="需求关键词">
                    <template #button>
                        <van-button @click="addNeedListNewWord">添加</van-button>
                    </template>
                </van-field>
                <van-row class="tags" type="flex">
                    <van-tag class="tag" v-for="(word, index) in hotNeedListWords" :key="index" type="warning"
                        @click="needListNewWord = word">{{ word }}</van-tag>
                </van-row>
            </van-cell>

            <van-cell>
                <van-field v-model="time" is-link readonly label="时间" placeholder="请选择时间" @click="selectingTime = true">
                </van-field>
                <van-popup v-model:show="selectingTime" round position="bottom">
                    <van-datetime-picker v-model="currentTime" type="time" title="选择时间" @confirm="onTimeSelect"
                        @cancel="selectingTime = false" />
                </van-popup>
            </van-cell>
            <van-cell>
                <van-field readonly label="超时">
                    <template #input>
                        <van-slider v-model="timeoutPow" :min="0" :max="3" :step="0.001" class="timeout"
                            @change="onTimeoutChange">
                            <template #button>
                                <van-tag class="tag" type="primary" round>{{ Math.round(Math.pow(10, timeoutPow)) }}
                                </van-tag>
                            </template>
                        </van-slider>
                    </template>
                </van-field>

            </van-cell>

            <van-cell inset v-if="update">
                <van-field readonly label="运行状态" @click="job.enable = !job.enable">
                    <template #right-icon>
                        <van-switch v-model="job.enable" size="20" @click="job.enable = !job.enable"></van-switch>
                    </template>
                </van-field>
            </van-cell>
        </van-cell-group>
        <div style="margin:16px">
            <van-button type="primary" native-type="submit" round v-if="update" :style="{ width: '100%' }">更新
            </van-button>
            <van-button type="primary" native-type="submit" round v-else :style="{ width: '100%' }">添加</van-button>
        </div>
    </van-form>
</template>

<script>
import * as moment from 'moment';
import { Button, Cascader, Cell, CellGroup, DatetimePicker, Dialog, Field, Form, Popover, Popup, Stepper, Switch, SwipeCell, Tag, Col, Row, Slider } from 'vant'
import { default as api } from '../api/api'

export default {
    components: {
        [Button.name]: Button,
        [Cascader.name]: Cascader,
        [Cell.name]: Cell,
        [CellGroup.name]: CellGroup,
        [DatetimePicker.name]: DatetimePicker,
        [Dialog.Component.name]: Dialog.Component,
        [Field.name]: Field,
        [Form.name]: Form,
        [Popover.name]: Popover,
        [Popup.name]: Popup,
        [Col.name]: Col,
        [Row.name]: Row,
        [Tag.name]: Tag,
        [Stepper.name]: Stepper,
        [Switch.name]: Switch,
        [SwipeCell.name]: SwipeCell,
        [Slider.name]: Slider
    },
    data() {
        return {
            users: [],
            shops: [],
            selectingSource: false,
            selectingTarget: false,
            selectingShop: false,
            selectingTime: false,
            blackListNewWord: "",
            needListNewWord: "",
            job: {
                source: null,
                target: -1,
                shopId: -1,
                hour: 0,
                minute: 0,
                blackList: [],
                needList: {},
                enable: true,
                timeout: 300
            },
            update: false,
            hotNeedListWords: [
                "面包", "牛奶", "薯片", "可乐"
            ],
            loading: true,
            timeoutPow: Math.log10(300)
        }
    },
    mounted() {
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
        fetch(api + "/user", {
            method: "GET",
        })
            .then((resp) => resp.json())
            .then((respJson) => {
                this.users = respJson.data.users;
            });
        if (this.$route.query.hash) {
            this.update = true;
            fetch(api + "/job/" + this.$route.query.hash, {
                method: "GET",
            })
                .then((resp) => resp.json())
                .then((respJson) => {
                    this.job = respJson.data.job;
                    this.timeoutPow = Math.log10(this.job.timeout);
                })
            console.log(this.job)
        }
        this.loading = false;
    },
    methods: {
        submit() {
            if (this.update) {
                this.updateJob();
            } else {
                this.addJob();
            }
        },
        onTimeoutChange() {
            this.job.timeout = Math.round(Math.pow(10, this.timeoutPow))
        }
        ,
        selectSource() {
            this.selectingSource = true;
        },
        selectTarget() {
            if (this.job.source) {
                this.selectingTarget = true;
            } else {
                Dialog.alert({ message: "请先选择账号!" })
            }
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
            if (this.job.source != null && this.job.needList != {}) {
                Dialog.confirm({ message: "添加任务?" })
                    .then(() => {
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
                                    Dialog.alert({ message: "添加成功。" })
                                        .then(() => {
                                            this.$router.back()

                                        });
                                } else {
                                    Dialog.alert({ message: respJson.exception });
                                }
                            });
                    })
            }
        },
        updateJob() {
            Dialog.confirm({ message: "更新任务?" })
                .then(() => {
                    fetch(api + "/job/" + this.job.hash, {
                        method: "PUT",
                        body: JSON.stringify(this.job),
                        headers: {
                            "Content-Type": "application/json",
                        },
                    })
                        .then((resp) => resp.json())
                        .then((respJson) => {
                            if (respJson.status) {
                                Dialog.alert({ message: "添加成功。" })
                                    .then(() => {
                                        this.$router.back()

                                    });
                            } else {
                                Dialog.alert({ message: respJson.exception });
                            }
                        });
                })

        },
    },
    computed: {
        realSource() {
            return this.job.source == null ? "未选择" : this.job.source
        },
        realTarget() {
            return this.job.target == -1 ? "默认" : this.job.target
        },
        realShop() {
            for (let i = 0; i < this.shops.length; i++) {
                if (this.shops[i].value == this.job.shopId) {
                    return this.shops[i].text;
                }
            }
            return null;
        },
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
        }
    }
}
</script>

<style scoped>
.tags {
    margin-left: 15px;
    margin-right: 15px;
}

.tag {
    padding: 5px;
    margin: 2px
}
</style>