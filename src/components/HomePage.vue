<template>
    <van-cell-group inset>
        <van-cell>
            <van-grid :column-num="2" :row-num="2">
                <van-grid-item @click="gotoUser">
                    <van-icon name="user-circle-o" color="darkred" size="150" />
                </van-grid-item>
                <van-grid-item>
                    <span>{{ user }} Users</span><br>
                    <span>in Total</span>
                </van-grid-item>
                <van-grid-item>
                    <span>{{ job }} Jobs</span><br>
                    <span>in Total</span>
                </van-grid-item>
                <van-grid-item @click="gotoJob">
                    <van-icon name="orders-o" size="150" color="orange" />
                </van-grid-item>
            </van-grid>
        </van-cell>
    </van-cell-group>
</template>

<script>
import { Icon, Cell, CellGroup, Grid, GridItem } from 'vant';
export default {
    components: {
        [Icon.name]: Icon,
        [Cell.name]: Cell,
        [CellGroup.name]: CellGroup,
        [Grid.name]: Grid,
        [GridItem.name]: GridItem
    },
    data() {
        return {
            user: 1,
            job: 12
        }
    },
    methods: {
        gotoUser() {
            this.$router.push('/user');
        },
        gotoJob() {
            this.$router.push('/job');
        }
    }
}
</script>

<style scoped>
span {
    font-size: 20px
}
</style>