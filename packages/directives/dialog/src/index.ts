import _LewDialog from './LewDialog.vue';

type Options = {
    title: string;
    content: string;
    ok: Function;
    cancel: Function;
    layout: string;
    okText: string;
    cancelText: string;
    closeOnClickOverlay?: boolean;
};

const warning = (options: Options) => {
    dialog('warning', options);
};

const error = (options: Options) => {
    dialog('error', options);
};

const info = (options: Options) => {
    dialog('info', options);
};

const normal = (options: Options) => {
    dialog('normal', options);
};

const success = (options: Options) => {
    dialog('success', options);
};

const dialog = (type: string, options: Options) => {
    const {
        title,
        content,
        ok,
        cancel,
        okText,
        cancelText,
        layout,
        closeOnClickOverlay,
    } = options;
    const div: HTMLDivElement = document.createElement('div');
    document.body.appendChild(div);
    const app = createApp({
        render() {
            return h(
                _LewDialog,
                {
                    closeOnClickOverlay,
                    type,
                    layout,
                    okText,
                    cancelText,
                    ok: ok
                        ? ok
                        : () => {
                              return true;
                          },
                    onClose: () => {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        app.unmount(div);
                        div.remove();
                    },
                    cancel: cancel
                        ? cancel
                        : () => {
                              return true;
                          },
                },
                {
                    title: () => title,
                    content: () => content,
                }
            );
        },
    });
    app.mount(div);
    div.remove();
};

export default {
    name: 'LewDialog',
    warning,
    info,
    normal,
    success,
    error,
};
