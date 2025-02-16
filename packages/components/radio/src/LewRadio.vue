<script lang="ts" setup>
import { object2class } from 'lew-ui/utils';
import { radioProps } from './props';

const props = defineProps(radioProps);

const emit = defineEmits(['update:checked']);

const setChecked = () => {
    emit('update:checked');
};

const getRadioClassName = computed(() => {
    const { block, checked, iconable, size, disabled } = props;
    const unicon = !iconable && block;
    return object2class('lew-radio', {
        block,
        checked,
        unicon,
        size,
        disabled,
    });
});
</script>

<template>
    <label class="lew-radio" :class="getRadioClassName">
        <div v-if="iconable || (!iconable && !block)" class="icon-radio-box">
            <div class="icon-radio"></div>
        </div>
        <input
            v-show="false"
            type="radio"
            :checked="checked"
            @change="setChecked"
        />
        <span v-if="label" class="lew-radio-label"> {{ label }}</span>
    </label>
</template>

<style lang="scss" scoped>
.lew-radio {
    display: inline-flex;
    align-items: center;
    user-select: none;
    cursor: pointer;
    color: var(--lew-text-color-1);
    font-size: 14px;
    border-radius: 50px;
    transition: var(--lew-form-transition);

    .icon-radio-box {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 18px;
        height: 18px;
        border: var(--lew-form-border-width) var(--lew-checkbox-border-color)
            solid;
        box-sizing: border-box;
        transition: var(--lew-form-transition);
        overflow: hidden;
        border-radius: 50%;
        background-color: var(--lew-form-bgcolor);
        outline: 0px var(--lew-color-primary-light) solid;
        .icon-radio {
            width: 50%;
            height: 50%;
            background-color: var(--lew-color-white);
            transform: translateY(100%);
            opacity: 0;
            transition: var(--lew-form-transition);
            font-size: 12px;
            border-radius: 50%;
        }
    }

    .lew-radio-label {
        margin-left: 6px;
    }
}

.lew-radio-size-small {
    font-size: 13px;

    .icon-radio-box {
        width: 14px;
        height: 14px;
    }
}

.lew-radio-size-medium {
    font-size: 14px;

    .icon-radio-box {
        width: 16px;
        height: 16px;
    }
}

.lew-radio-size-large {
    font-size: 15px;

    .icon-radio-box {
        width: 18px;
        height: 18px;
    }
}

.lew-radio-unicon.lew-radio-block {
    padding: 4px 12px;

    .lew-radio-label {
        color: var(--lew-text-color-6);
    }
}

.lew-radio:hover {
    .icon-radio-box {
        border: var(--lew-form-border-width) var(--lew-radio-border-color-hover)
            solid;
        outline: var(--lew-form-ouline);
        background: var(--lew-form-bgcolor);
    }
}

.lew-radio-block {
    background: var(--lew-radio-block-color);
    border: var(--lew-form-border-width) rgba(0, 0, 0, 0) solid;
    padding: 3px 8px 3px 4px;
    border-radius: 50px;

    .lew-radio-label {
        margin-left: 2px;
    }
}

.lew-radio-block:hover {
    background: var(--lew-form-bgcolor-hover);
}

.lew-radio-checked.lew-radio-block {
    border: var(--lew-form-border-width) var(--lew-radio-border-color-hover)
        solid;
    background: var(--lew-radio-color-light);
    color: var(--lew-form-border-color-focus);
}

.lew-radio-checked.lew-radio-block:hover {
    border: var(--lew-form-border-width) var(--lew-radio-border-color-hover)
        solid;
    background: var(--lew-color-primary-light);
}

.lew-radio-checked {
    .icon-radio-box {
        border: var(--lew-form-border-width) var(--lew-radio-color) solid;
        background: var(--lew-radio-color);
        .icon-radio {
            transform: translateY(0%);
            opacity: 1;
        }
    }
}

.lew-radio-checked:hover {
    .icon-radio-box {
        background: var(--lew-radio-color);
    }
}

.lew-radio-block.lew-radio-checked {
    .lew-radio-label {
        color: var(--lew-color-primary-dark);
    }
    .icon-radio-box {
        border: var(--lew-form-border-width) transparent solid;
        background: transparent;

        .icon-radio {
            background-color: var(--lew-color-primary-dark);
            opacity: 1;
            transform: translateY(0%) scale(1.15);
        }
    }
}

.lew-radio-block.lew-radio-checked:hover {
    .icon-radio-box {
        border: var(--lew-form-border-width) transparent solid;
    }

    .icon-radio {
        opacity: 1;
        transform: translateY(0%) scale(1.15);
    }
}
.lew-radio-disabled {
    opacity: var(--lew-disabled-opacity);
    pointer-events: none; //鼠标点击不可修改
}
</style>
