import { Settings } from '../types';
import copy from 'copy-to-clipboard';
import { useCallback } from 'react';
import toast from 'react-hot-toast';
import Editor from '@monaco-editor/react';
import React from 'react';
import { Button } from '@arco-design/web-react';
import { IconCodepen, IconCopy } from '@arco-design/web-react/icon';
import { useTranslation } from 'react-i18next';

interface Props {
    code: string;
    setCode: React.Dispatch<React.SetStateAction<string>>;
    settings: Settings;
}

function CodeTab({ code, setCode, settings }: Props) {
    const { t } = useTranslation('draw');
    const copyCode = useCallback(() => {
        copy(code);
        toast.success(t('Copied to clipboard'));
    }, [code]);

    const doOpenInCodepenio = useCallback(async () => {
        // TODO: Update CSS and JS external links depending on the framework being used
        const data = {
            html: code,
            editors: '100', // 1: Open HTML, 0: Close CSS, 0: Close JS
            layout: 'left',
            css_external:
                'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css' +
                (code.includes('<ion-')
                    ? ',https://cdn.jsdelivr.net/npm/@ionic/core/css/ionic.bundle.css'
                    : ''),
            js_external:
                'https://cdn.tailwindcss.com ' +
                (code.includes('<ion-')
                    ? ',https://cdn.jsdelivr.net/npm/@ionic/core/dist/ionic/ionic.esm.js,https://cdn.jsdelivr.net/npm/@ionic/core/dist/ionic/ionic.js'
                    : ''),
        };

        // Create a hidden form and submit it to open the code in CodePen
        // Can't use fetch API directly because we want to open the URL in a new tab
        const input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', 'data');
        input.setAttribute('value', JSON.stringify(data));

        const form = document.createElement('form');
        form.setAttribute('method', 'POST');
        form.setAttribute('action', 'https://codepen.io/pen/define');
        form.setAttribute('target', '_blank');
        form.appendChild(input);

        document.body.appendChild(form);
        form.submit();
    }, [code]);

    return (
        <div className="px-[30px] h-full flex">
            <div className="w-full">
                <div className="flex justify-start my-[10px] mt-2 mb-[0] box-border  bg-[rgba(var(--primary-1),0.8)] rounded-t p-[5px]">
                    <Button
                        type="default"
                        size="mini"
                        className="mx-[10px] p-[10px]"
                        icon={
                            <IconCopy
                                onClick={copyCode}
                                style={{
                                    fontSize: 20,
                                }}
                            />
                        }
                        iconOnly
                    />

                    <Button
                        type="default"
                        className="p-[10px]"
                        size="mini"
                        icon={
                            <IconCodepen
                                onClick={doOpenInCodepenio}
                                style={{
                                    fontSize: 20,
                                }}
                            />
                        }
                        iconOnly
                    />
                </div>
                <Editor
                    className={`!mt-0 border border-[rgba(var(--primary-1),0.8)]`}
                    height="70vh"
                    defaultLanguage="html"
                    defaultValue="// some comment"
                    value={code}
                    onChange={value => {
                        setCode(value as string);
                    }}
                />
                <div className="flex justify-end mt-[0] box-border h-[10px]   bg-[rgba(var(--primary-1),0.8)] rounded-b translate-y-[-2px]"></div>
            </div>
        </div>
    );
}

export default CodeTab;
