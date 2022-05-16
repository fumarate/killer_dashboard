<template>
    <van-cell-group>
        <van-field v-model="config.id" readonly label="用户ID" type="number"></van-field>
        <van-field v-model="config.nickname" readonly label="用户名"></van-field>
        <van-field v-model="config.schoolId" readonly label="学校ID"></van-field>
    </van-cell-group>
</template>

<script>
import { default as api } from '../api/api'
import { Cell, CellGroup, Field, Slider } from 'vant';
export default {
    components: {
        [Cell.name]: Cell,
        [CellGroup.name]: CellGroup,
        [Field.name]: Field,
        [Slider.name]: Slider
    },

    data() {
        return {
            config: {}
        }
    },
    mounted() {
        fetch(api + "/config/1", {
            method: "get"
        }).then(resp => resp.json()).then(respJson => {
            this.config = respJson.data.config
        })
    }
}
</script>

<style>
</style>