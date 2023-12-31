import { useEffect, useMemo, useRef } from 'react';
import classNames from 'classnames';
import useThrottle from '../hooks/useThrottle';
import { Button, Spin } from '@arco-design/web-react';
import CodePreview from './CodePreview';
import { AppState } from '../types';
import { IconLoading } from '@arco-design/web-react/icon';
import { useTranslation } from 'react-i18next';

interface Props {
    code: string;
    device: 'mobile' | 'desktop';
    appState: AppState;
    stop: () => any;
}

function Preview({ code, device, appState, stop }: Props) {
    const throttledCode = useThrottle(code, 200);
    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const { t } = useTranslation('draw');

    const iframe: any = useMemo(() => {
        return (
            <iframe
                id={`preview-${device}`}
                ref={iframeRef}
                title="Preview"
                className={classNames(
                    'border-[4px] border-black rounded-[20px] shadow-lg',
                    'transform scale-[0.9] origin-content',
                    {
                        'w-full h-[700px]': device === 'desktop',
                        'w-[400px] h-[700px]': device === 'mobile',
                        'opacity-0 absolute -z-10': appState === AppState.CODING,
                    }
                )}
            ></iframe>
        );
    }, [device, appState, AppState.CODING]);

    useEffect(() => {
        const iframe = iframeRef.current;
        if (iframe && iframe.contentDocument) {
            iframe.contentDocument.open();
            iframe.contentDocument.write(throttledCode);
            iframe.contentDocument.close();
        }
    }, [throttledCode, iframe]);

    return (
        <div className="flex justify-center mx-2 w-full flex-wrap">
            {appState === AppState.CODING ? (
                <div
                    className={classNames(
                        'border-[4px] border-black rounded-[20px] shadow-lg w-full',
                        'transform scale-[0.9] origin-content',
                        {
                            'w-full h-[700px]': device === 'desktop',
                            'w-[400px] h-[700px]': device === 'mobile',
                        }
                    )}
                >
                    {/* <div className="flex items-center justify-center h-[100px]"> */}
                    {/* <Spin dot block /> */}
                    {/* {executionConsole.slice(-1)[0]} */}
                    {/* </div> */}
                    <CodePreview code={code} />
                    <div className="flex mt-4 w-full justify-center">
                        <Button
                            type="secondary"
                            onClick={stop}
                            shape="round"
                            // loading
                            className="w-[200px] dark:text-white dark:bg-gray-700 h-[50px] hover:shadow-lg mt-[30px]"
                        >
                            <IconLoading />
                            {t('Cancel')}
                        </Button>
                    </div>
                </div>
            ) : (
                iframe
            )}
        </div>
    );
}

export default Preview;
