<script setup lang="ts">
import {
    DemoMagicNumber1,
    DemoMagicNumber1_code,
    DemoMagicNumber2,
    DemoMagicNumber2_code,
    DemoMagicNumber3,
    DemoMagicNumber3_code,
} from './demo';
import LewDemoBox from '../../layout/LewDemoBox.vue';
import LewDocsTables from '../../layout/LewDocsTables.vue';
import * as API from './api';

const options = ref(
    Object.keys(API).map((key: any) => {
        // @ts-ignore
        return API[key];
    })
);
</script>

<template>
    <div class="demo-wrapper">
        <lew-title>MagicNumber</lew-title>
        <p class="sub-title">这是一个很酷数值变化效果。</p>
        <lew-demo-box title="任意值" :code="DemoMagicNumber1_code">
            <demo-magic-number1 />
        </lew-demo-box>
        <lew-demo-box title="自增" :code="DemoMagicNumber2_code">
            <demo-magic-number2 />
        </lew-demo-box>
        <lew-demo-box title="天然支持千分位" :code="DemoMagicNumber3_code">
            <demo-magic-number3 />
        </lew-demo-box>
        <lew-docs-tables :options="options"></lew-docs-tables>
    </div>
</template>

<style lang="scss" scoped>
.lew-avatar {
    margin: 10px;
}
</style>
