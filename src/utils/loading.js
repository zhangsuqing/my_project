import { Loading } from 'element-ui';

var loadingInstance
const loading = {
    open: (text='正在加载，请稍候...') => {
        loadingInstance = Loading.service({
            fullscreen: true,
            lock: true,
            text: text,
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
        });
    },
    close: () => {
        if(loadingInstance)
            loadingInstance.close();
    }
}

export default loading