<script setup lang="ts">
import { PropType } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const route = useRoute();
const router = useRouter();

type Item = {
    name: string;
    cname: string;
    path: string;
    label: string;
    color?: string;
};

type Group = {
    title: string;
    items: Item[];
};

defineProps({
    group: {
        type: Array as PropType<Group[]>,
        default() {
            return [];
        },
    },
});

const toPath = (item: Item) => {
    if (item.label === 'Coming soon') {
        LewMessage.info('敬请期待！');
        return;
    }
    router.push(item.path);
};
</script>

<template>
    <div class="siderbar lew-scrollbar">
        <div v-for="(list, i) in group" :key="`group${i}`" class="group">
            <div v-if="list.title" class="title">
                <span> {{ list.title }}</span>
            </div>
            <div
                v-for="(item, j) in list.items"
                :key="`siderbar${j}`"
                class="item"
                :class="{ active: route.path === item.path }"
                @click="toPath(item)"
            >
                <span class="ename"> {{ item.name || item.cname }} </span>
                <!-- <span class="cname"> {{ item.cname }}</span> -->
                <lew-tag
                    v-if="item.label"
                    type="light"
                    :color="item.color"
                    size="small"
                    style="margin-left: 10px"
                >
                    {{ item.label }}
                </lew-tag>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.siderbar {
    width: var(--lew-siderbar-width);
    height: calc(100vh - 60px);
    min-height: calc(100vh - 60px);
    overflow-y: auto;
    border-right: var(--lew-border-1);
    user-select: none;

    .group {
        white-space: nowrap;
        margin-top: 20px;
        padding: 5px 0px 5px 20px;

        .title {
            margin: 20px 0px 15px 0px;
            padding: 0px 20px;
            font-size: 14px;
            font-weight: 400;
            height: 20px;
            color: var(--lew-text-color-5);
            overflow: hidden;

            span {
                display: inline-block;
            }
        }

        .item {
            display: flex;
            align-items: center;
            position: relative;
            height: 36px;
            line-height: 36px;
            padding-left: 20px;
            box-sizing: border-box;
            list-style: none;
            width: calc(100% - 20px);
            border-radius: var(--lew-border-radius);
            cursor: pointer;
            font-size: 14px;
            color: var(--lew-text-color-2);
            font-weight: 400;

            .ename {
                margin-right: 5px;
                letter-spacing: 0.8px;
            }
        }

        .item:hover {
            color: var(--lew-text-color-0);
            background: var(--lew-bgcolor-2);
        }

        .active {
            color: var(--lew-color-primary);
            background: var(--lew-color-primary-light);
        }

        .active:hover {
            color: var(--lew-color-primary);
            background: var(--lew-color-primary-light);
        }
    }

    .group:last-child {
        padding-bottom: 150px;
    }
}
</style>
