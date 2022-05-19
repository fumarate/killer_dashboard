<template>
    <div class="hint"><span>Developing</span></div>
</template>

<script>
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
        }
    },
    mounted() {

    }
}
</script>

<style>
.hint {
    display: flex;
    height: 100%;
    width: 100%;
    align-items: center;
    justify-content: center;
    font-size: 50px;
}
</style>