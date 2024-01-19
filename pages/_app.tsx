import '@arco-design/web-react/dist/css/arco.css';
import '../styles/globals.scss';
import '../styles/global.css';
import '../next-i18next.config';

import { ConfigProvider } from '@arco-design/web-react';
import { useState } from 'react';
import { Spin } from '@arco-design/web-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { get } from 'lodash';

let bodyEl;
if ((bodyEl = get(globalThis, 'document.body'))) {
    bodyEl.classList.add(`${process.env.NEXT_PUBLIC_THEME || 'default'}`);
}

type MyAppProps = {
    Component: React.FunctionComponent;
    pageProps: Record<string, any>;
};

function MyApp({ Component, pageProps }: MyAppProps) {
    const [local, setLocal] = useState<any>();
    const { i18n } = useTranslation();
    useEffect(() => {
        if (i18n.language === 'en') {
            import('@arco-design/web-react/es/locale/en-US').then(lang => {
                setLocal(lang.default);
            });
        } else if (i18n.language === 'zh') {
            import('@arco-design/web-react/es/locale/zh-CN').then(lang => {
                setLocal(lang.default);
            });
        } else {
            import('@arco-design/web-react/es/locale/zh-CN').then(lang => {
                setLocal(lang.default);
            });
        }
    }, [setLocal, i18n.language]);
    return (
        <>
            {local ? (
                <ConfigProvider locale={local}>
                    <Component {...pageProps} />
                </ConfigProvider>
            ) : (
                <div className="fixed inset-0 flex justify-center items-center">
                    <Spin dot />
                </div>
            )}
        </>
    );
}

export default MyApp;
