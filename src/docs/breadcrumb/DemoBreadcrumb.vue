<script setup lang="ts">
import {
    DemoBreadcrumb1,
    DemoBreadcrumb2,
    DemoBreadcrumb3,
    DemoBreadcrumb1_code,
    DemoBreadcrumb2_code,
    DemoBreadcrumb3_code,
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
        <lew-title>Breadcrumb</lew-title>
        <lew-demo-box title="常规" :code="DemoBreadcrumb1_code">
            <demo-breadcrumb1 />
        </lew-demo-box>
        <lew-demo-box title="自定义当前选中" :code="DemoBreadcrumb2_code">
            <demo-breadcrumb2 />
        </lew-demo-box>
        <lew-demo-box title="图标类型" :code="DemoBreadcrumb3_code">
            <demo-breadcrumb3 />
        </lew-demo-box>
        <lew-docs-tables :options="options"></lew-docs-tables>
    </div>
</template>
