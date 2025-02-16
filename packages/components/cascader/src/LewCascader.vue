<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import { LewPopover, LewFlex, LewButton, LewIcon } from 'lew-ui';
import { object2class } from 'lew-ui/utils';
import { cascaderProps, CascaderOptions } from './props';
import { LewTooltip } from 'lew-ui';

// 获取app
const app = getCurrentInstance()?.appContext.app;
if (app && !app.directive('tooltip')) {
    app.use(LewTooltip);
}

const props = defineProps(cascaderProps);
const emit = defineEmits(['update:modelValue', 'change', 'blur', 'clear']);
const cascaderValue = useVModel(props, 'modelValue', emit);

const lewCascaderRef = ref();
const lewPopverRef = ref();

const state = reactive({
    visible: false,
    loading: false,
    options: [] as CascaderOptions[][],
    format_options: [] as CascaderOptions[],
    activelabels: [] as string[], // 激活
    tobelabels: [] as string[], // 待确认
    tobeItem: {} as CascaderOptions,
    keyword: '',
});

// 转树
const addPathsToTreeList = (
    treeList: CascaderOptions[],
    parentValuePaths = [],
    parentLabelPaths = []
) => {
    treeList.forEach((tree) => {
        const { value, label, children } = tree;
        const valuePaths: any = [...parentValuePaths, value];
        const labelPaths: any = [...parentLabelPaths, label];

        tree.valuePaths = valuePaths;
        tree.labelPaths = labelPaths;
        tree.parentValuePaths = parentValuePaths;
        tree.parentLabelPaths = parentLabelPaths;

        if (children) {
            tree.parentChildren = children;
            addPathsToTreeList(children, valuePaths, labelPaths);
        }
    });
};

// 查找
const findObjectByValue = (
    treeList: CascaderOptions[],
    value: [string, number]
) => {
    for (let i = 0; i < treeList.length; i++) {
        const tree = treeList[i];
        if (tree.value === value) {
            return tree;
        }
        if (tree.children) {
            const foundObject: CascaderOptions = findObjectByValue(
                tree.children,
                value
            ) as CascaderOptions;
            if (foundObject) {
                return foundObject;
            }
        }
    }
    return null;
};

// 初始化
const init = () => {
    let _options: CascaderOptions[] =
        (props.options &&
            props.options.map((e) => {
                return {
                    ...e,
                    isHasChild: (e.children && e.children.length > 0) || false,
                };
            })) ||
        [];
    addPathsToTreeList(_options);
    state.format_options = _options;
    let new_options = [];
    new_options[0] = _options;
    state.options = new_options;
};

init();

const selectItem = (item: CascaderOptions, level: number) => {
    if (item.isHasChild || (item.children && item.children.length > 0)) {
        state.options = state.options.slice(0, level + 1);
        const _options =
            (item.children &&
                item.children.map((e) => {
                    return {
                        ...e,
                        isHasChild: e.children && e.children.length > 0,
                    };
                })) ||
            [];
        state.options.push(_options);
    }

    if (item.labelPaths === state.activelabels) {
        state.activelabels = item.parentLabelPaths as string[];
        if (level < state.options.length - 1) {
            state.options.pop();
        }
    } else {
        state.activelabels = item.labelPaths as string[];
    }
    state.tobeItem = { ...item, children: undefined };

    if (props.free) {
        checkItem(item, level);
    } else {
        if (!item.isHasChild) {
            checkItem(item, level);
            ok();
        }
    }
};

const checkItem = (item: CascaderOptions, level: number) => {
    if (props.showAllLevels) {
        if (state.tobelabels === item.labelPaths) {
            state.tobelabels = item.parentLabelPaths as string[];
        } else {
            state.tobelabels = item.labelPaths as string[];
        }
    } else {
        if (state.tobelabels === ([item.label] as string[])) {
            state.tobelabels = [] as string[];
        } else {
            state.tobelabels = [item.label] as any;
        }
    }
};

const show = () => {
    lewPopverRef.value.show();
};

const hide = () => {
    lewPopverRef.value.hide();
};

const clearHandle = () => {
    cascaderValue.value = '';
    state.tobelabels = [];
    state.activelabels = [];
    hide();
    init();
    emit('clear');
    emit('change');
};

const getValueStyle = computed(() => {
    return state.visible ? 'opacity:0.4' : '';
});

const getCascaderClassName = computed(() => {
    let { clearable, size } = props;
    clearable = clearable ? !!cascaderValue.value : false;
    return object2class('lew-cascader', { clearable, size });
});

const getBodyClassName = computed(() => {
    const { size, disabled } = props;
    return object2class('lew-cascader-body', { size, disabled });
});

const getCascaderViewClassName = computed(() => {
    const { disabled, readonly } = props;
    const focus = state.visible;
    return object2class('lew-cascader-view', { focus, disabled, readonly });
});

// 获取图标大小
const getIconSize = computed(() => {
    const size: Record<string, number> = {
        small: 13,
        medium: 14,
        large: 16,
    };
    return size[props.size];
});

// 展示
const showHandle = () => {
    state.visible = true;
};

// 隐藏
const hideHandle = () => {
    state.visible = false;
    emit('blur');
};

// 获取宽度
const getCascaderWidth = computed(() => {
    let _hasChildOptions = state.options.filter(
        (e) => e && e.length > 0
    ).length;
    if (_hasChildOptions > 1) {
        return _hasChildOptions * 180;
    }
    return _hasChildOptions * 180;
});

const getLabel = computed(() => {
    const item = findObjectByValue(state.format_options, cascaderValue.value);
    return item?.labelPaths || [];
});

const ok = () => {
    cascaderValue.value = state.tobeItem.value;
    emit('change', state.tobeItem);
    hide();
};

const cancel = () => {
    cascaderValue.value = '';
    state.tobelabels = [];
    hide();
};

defineExpose({ show, hide });
</script>

<template>
    <lew-popover
        ref="lewPopverRef"
        class="lew-cascader-view"
        :class="getCascaderViewClassName"
        popoverBodyClassName="lew-cascader-popover-body"
        :trigger="trigger"
        :disabled="disabled"
        placement="bottom-start"
        style="width: 100%"
        :loading="state.loading"
        @show="showHandle"
        @hide="hideHandle"
    >
        <template #trigger>
            <div
                ref="lewCascaderRef"
                class="lew-cascader"
                :class="getCascaderClassName"
            >
                <transition name="lew-form-icon-ani">
                    <lew-icon
                        v-if="!(clearable && getLabel && getLabel.length > 0)"
                        :size="getIconSize"
                        type="chevron-down"
                        class="icon-cascader"
                    />
                </transition>

                <transition name="lew-form-icon-ani">
                    <lew-icon
                        v-if="
                            clearable &&
                            getLabel &&
                            getLabel.length > 0 &&
                            !readonly
                        "
                        :size="getIconSize"
                        type="x"
                        class="lew-form-icon-clear"
                        :class="{
                            'lew-form-icon-clear-focus': state.visible,
                        }"
                        v-tooltip="{
                            content: '清空',
                            placement: 'top',
                        }"
                        @click.stop="clearHandle"
                    />
                </transition>

                <div
                    v-show="getLabel && getLabel.length > 0"
                    :style="getValueStyle"
                    class="value"
                >
                    <template v-if="showAllLevels">
                        <span v-for="(item, index) in getLabel" :key="index">
                            {{ item }}
                            <svg
                                v-if="getLabel && index !== getLabel.length - 1"
                                :style="{
                                    width: getIconSize,
                                    height: getIconSize,
                                }"
                                viewBox="0 0 48 48"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                stroke="currentColor"
                                stroke-width="4"
                                stroke-linecap="butt"
                                stroke-linejoin="miter"
                            >
                                <path
                                    d="M29.506 6.502 18.493 41.498"
                                    data-v-5303b0ef=""
                                ></path>
                            </svg>
                        </span>
                    </template>
                    <template v-else-if="getLabel">
                        <span>{{ getLabel[getLabel.length - 1] }}</span>
                    </template>
                </div>
                <div
                    v-show="!getLabel || (getLabel && getLabel.length === 0)"
                    class="placeholder"
                >
                    {{ placeholder }}
                </div>
            </div>
        </template>
        <template #popover-body>
            <div
                class="lew-cascader-body"
                :style="{
                    width: `${getCascaderWidth}px`,
                }"
                :class="getBodyClassName"
            >
                <slot name="header"></slot>
                <div
                    class="lew-cascader-options-box"
                    :style="{ height: free ? 'calc(100% - 40px)' : '100%' }"
                >
                    <template
                        v-for="(oItem, oIndex) in state.options"
                        :key="oIndex"
                    >
                        <div
                            class="lew-cascader-item-warpper lew-scrollbar-hover"
                            :style="{
                                zIndex: 999 - oIndex,
                                transform:
                                    oItem.length > 0
                                        ? `translateX(${180 * oIndex}px)`
                                        : '',
                            }"
                        >
                            <!--  -->

                            <div
                                class="lew-cascader-item"
                                :class="{
                                    'lew-cascader-item-disabled': item.disabled,
                                    'lew-cascader-item-active':
                                        state.activelabels.includes(item.label),
                                    'lew-cascader-item-tobe':
                                        state.tobelabels.includes(item.label),
                                    'lew-cascader-item-select':
                                        getLabel &&
                                        getLabel.includes(item.label),
                                }"
                                v-for="(item, index) in oItem"
                                :key="index"
                                @click="selectItem(item, oIndex)"
                            >
                                <lew-checkbox
                                    class="lew-cascader-checkbox"
                                    v-if="free"
                                    :checked="
                                        state.tobelabels.includes(item.label)
                                    "
                                />
                                <div
                                    class="lew-cascader-label"
                                    :class="{
                                        'lew-cascader-label-free': free,
                                    }"
                                >
                                    {{ item.label }}
                                </div>
                                <lew-icon
                                    v-if="item.isHasChild"
                                    size="14px"
                                    class="lew-cascader-icon"
                                    type="chevron-right"
                                />
                            </div>
                        </div>
                    </template>
                </div>
                <lew-flex v-if="free" x="end" class="lew-cascader-control">
                    <lew-button
                        @click="cancel"
                        round
                        color="normal"
                        type="text"
                        size="small"
                        >取消</lew-button
                    >
                    <lew-button @click="ok" round type="light" size="small">
                        确认
                    </lew-button>
                </lew-flex>
            </div>
        </template>
    </lew-popover>
</template>

<style lang="scss" scoped>
.lew-cascader-view {
    width: 100%;
    border-radius: var(--lew-border-radius);
    background-color: var(--lew-form-bgcolor);
    transition: all 0.15s ease;
    box-sizing: border-box;
    outline: 0px var(--lew-color-primary-light) solid;
    border: var(--lew-form-border-width) transparent solid;
    box-shadow: var(--lew-form-box-shadow);

    > div {
        width: 100%;
    }

    .lew-cascader {
        position: relative;
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        cursor: pointer;
        user-select: none;
        box-sizing: border-box;

        .icon-cascader {
            position: absolute;
            top: 50%;
            right: 7px;
            transform: translateY(-50%) rotate(0deg);
            transition: var(--lew-form-transition);
        }

        .icon-cascader {
            opacity: var(--lew-form-icon-opacity);
        }

        .icon-cascader-hide {
            opacity: 0;
            transform: translate(100%, -50%);
        }

        .placeholder {
            color: rgb(165, 165, 165);
        }

        .placeholder,
        .value {
            display: inline-flex;
            align-items: center;
            width: calc(100% - 24px);
            box-sizing: border-box;
            transition: all 0.2s;
            gap: 2px;

            span {
                display: inline-flex;
                gap: 2px;
                align-items: center;

                svg {
                    opacity: 0.4;
                }
            }
        }
    }

    .lew-cascader-align-left {
        text-align: left;
    }

    .lew-cascader-align-center {
        text-align: center;
    }

    .lew-cascader-align-right {
        text-align: right;
    }

    .lew-cascader-placeholder {
        color: rgb(165, 165, 165);
    }

    .lew-cascader-size-small {
        .value,
        .placeholder {
            padding: var(--lew-form-input-padding-small);
            height: var(--lew-form-item-height-small);
            line-height: var(--lew-form-input-line-height-small);
            font-size: var(--lew-form-font-size-small);
        }
    }

    .lew-cascader-size-medium {
        .value,
        .placeholder {
            padding: var(--lew-form-input-padding-medium);
            line-height: var(--lew-form-input-line-height-medium);
            height: var(--lew-form-item-height-medium);
            font-size: var(--lew-form-font-size-medium);
        }
    }

    .lew-cascader-size-large {
        .value,
        .placeholder {
            padding: var(--lew-form-input-padding-large);
            height: var(--lew-form-item-height-large);
            line-height: var(--lew-form-input-line-height-large);
            font-size: var(--lew-form-font-size-large);
        }
    }
}

.lew-cascader-view:hover {
    background-color: var(--lew-form-bgcolor-hover);
}

.lew-cascader-view:active {
    background-color: var(--lew-form-bgcolor-active);
}

.lew-cascader-view.lew-cascader-view-focus {
    background-color: var(--lew-form-bgcolor-focus);
    border: var(--lew-form-border-width) var(--lew-form-border-color-focus)
        solid;
    outline: var(--lew-form-ouline);

    .icon-cascader {
        transform: translateY(-50%) rotate(180deg);
        color: var(--lew-text-color-2);
    }

    .icon-cascader-hide {
        opacity: 0;
        transform: translate(100%, -50%) rotate(180deg);
    }
}

.lew-cascader-view-disabled {
    opacity: var(--lew-disabled-opacity);
    pointer-events: none; //鼠标点击不可修改
}

.lew-cascader-view-readonly {
    pointer-events: none; //鼠标点击不可修改

    .lew-cascader {
        user-select: text;
    }
}

.lew-cascader-view-disabled:hover {
    background-color: var(--lew-form-bgcolor);
    outline: 0px var(--lew-color-primary-light) solid;
    border: var(--lew-form-border-width) transparent solid;
}
</style>
<style lang="scss">
.lew-cascader-body {
    width: 100%;
    box-sizing: border-box;
    min-width: 180px;
    height: 280px;
    overflow: hidden;
    transition: all 0.25s;
    user-select: none;

    .search-input {
        margin-bottom: 5px;

        input {
            outline: none;
            border: none;
            background-color: var(--lew-bgcolor-1);
            width: 100%;
            height: 30px;
            border-radius: var(--lew-border-radius);
            padding: 0px 10px;
            box-sizing: border-box;
            color: var(--lew-form-color);
            transition: var(--lew-form-transition);
        }

        input:focus {
            background-color: var(--lew-form-bgcolor);
        }
    }

    .not-found {
        padding: 50px 0px;
        opacity: 0.4;
    }

    .reslut-count {
        padding-left: 8px;
        margin: 5px 0px;
        opacity: 0.4;
        font-size: 13px;
    }

    .lew-cascader-options-box {
        position: relative;
        display: flex;
        box-sizing: border-box;

        .lew-cascader-item-warpper {
            position: absolute;
            left: 0px;
            top: 0px;
            overflow-y: scroll;
            height: 100%;
            width: 180px;
            padding-left: 5px;
            border-right: var(--lew-popover-border);
            padding: 5px;
            box-sizing: border-box;
        }

        .lew-cascader-item-warpper:last-child {
            border-right: 0px transparent solid;
        }

        .lew-cascader-item {
            position: relative;
            display: inline-flex;
            align-items: center;
            gap: 10px;
            width: 100%;
            font-size: 14px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            cursor: pointer;
            color: var(--lew-text-color-2);
            box-sizing: border-box;
            border-radius: 6px;
            height: 30px;
            padding: 0px 10px;

            .lew-cascader-icon {
                position: absolute;
                right: 2px;
                top: 50%;
                transform: translateY(-50%);
                opacity: 0.4;
            }

            .lew-cascader-checkbox {
                position: absolute;
                left: 10px;
                top: 50%;
                transform: translateY(-50%);
                z-index: -9;
            }

            .lew-cascader-label {
                position: relative;
                z-index: 5;
                width: 100%;
                user-select: none;
                font-size: 14px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                box-sizing: border-box;
            }

            .lew-cascader-label-free {
                padding: 0px 8px 0px 25px;
            }
        }

        .lew-cascader-item:hover {
            .icon {
                opacity: 1;
            }
        }

        .lew-cascader-item-disabled {
            opacity: 0.3;
            pointer-events: none;
        }

        .lew-cascader-item-align-left {
            text-align: left;
        }

        .lew-cascader-item-align-center {
            text-align: center;
        }

        .lew-cascader-item-align-right {
            text-align: right;
        }

        .lew-cascader-item:hover {
            color: var(--lew-text-color-0);
            background-color: var(--lew-backdrop-bg-active);
        }

        .lew-cascader-slot-item {
            border-radius: 6px;
        }

        .lew-cascader-slot-item:hover {
            color: var(--lew-text-color-0);
            background-color: var(--lew-backdrop-bg-active);
        }

        .lew-cascader-item-active {
            background-color: var(--lew-backdrop-bg-active);

            color: var(--lew-color-primary-dark);
            font-weight: bold;

            .icon-check {
                margin-right: 10px;
            }
        }

        .lew-cascader-item-active:hover {
            color: var(--lew-color-primary-dark);
            font-weight: bold;
            background-color: var(--lew-backdrop-bg-active);
        }
    }

    .lew-cascader-control {
        border-top: 1px solid var(--lew-bgcolor-4);
        height: 40px;
        padding-right: 10px;
    }
}

.lew-popover-body .lew-cascader-popover-body {
    padding: 0px;
}

.lew-cascader-item:hover {
    .lew-checkbox {
        .icon-checkbox-box {
            border: var(--lew-form-border-width)
                var(--lew-checkbox-border-color-hover) solid;
            outline: var(--lew-form-ouline);
            background: var(--lew-form-bgcolor);
        }
    }
}

.lew-cascader-item-tobe:hover {
    .lew-checkbox {
        .icon-checkbox-box {
            border: var(--lew-form-border-width) var(--lew-checkbox-color) solid;
            background: var(--lew-checkbox-color);

            .icon-checkbox {
                transform: translateY(0px);
                opacity: 1;
            }
        }
    }
}

.lew-cascader-item-select:hover {
    .lew-checkbox {
        .icon-checkbox-box {
            border: var(--lew-form-border-width) var(--lew-checkbox-color) solid;
            background: var(--lew-checkbox-color);

            .icon-checkbox {
                transform: translateY(0px);
                opacity: 1;
            }
        }
    }
}
</style>
