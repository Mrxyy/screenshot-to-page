import React, { FunctionComponent, useMemo, useState } from 'react';
import { FaCog } from 'react-icons/fa';
import { Settings } from '../types';

import { IS_RUNNING_ON_CLOUD } from '../config';

import { Button, Form, Image, Input, Modal, Radio, Switch } from '@arco-design/web-react';
import { useTranslation } from 'react-i18next';
import { IconMoonFill, IconSunFill } from '@arco-design/web-react/icon';
import { map } from 'lodash';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
interface Props {
    settings: Settings;
    setSettings: React.Dispatch<React.SetStateAction<Settings>>;
    Config?: FunctionComponent;
}

const llm = {
    Gemini: {
        title: 'Gemini',
    },
    OpenAi: {
        title: 'OpenAi',
    },
    'Qwen-VL': {
        title: 'Qwen-VL',
    },
};
function SettingsDialog({ settings, setSettings, Config }: Props) {
    const [visible, setVisible] = React.useState(false);
    const { t } = useTranslation('draw');
    const tipContent = useMemo(()=>{
        switch( settings.llm){
            case 'Gemini': 
                return t(
                    "If you haven't applied for Gemini, the Gemini API key is not required."
                );
            case 'Qwen-VL': 
                return <>
                {t(
                    "On the free Vercel server, access may not be available. You can try:"
                )}
                <a style={{
                    "wordWrap": "break-word"
                }} href={process.env.NEXT_PUBLIC_QWEN_VL_URL} className='text-[blue] inline' target='_blank'> {process.env.NEXT_PUBLIC_QWEN_VL_URL} </a>
                </>;
        }
        return '';
    },[ settings.llm])
    return (
        <>
            <Button
                className={'mx-[5px]'}
                onClick={() => setVisible(true)}
                icon={<FaCog className="text-[var(--pc)]" />}
                iconOnly
            />

            <Modal
                title={t('Settings')}
                okText={t('Save')}
                visible={visible}
                onOk={() => setVisible(false)}
                onCancel={() => setVisible(false)}
                autoFocus={false}
                focusLock={true}
            >
                <Form layout="vertical">
                    <FormItem
                        label={t('Select model')}
                        extra={
                                <span className="text-[var(--pc)]">
                                    {tipContent}
                                </span>
                        }
                    >
                        <RadioGroup
                            value={settings.llm}
                            onChange={e =>
                                setSettings(s => ({
                                    ...s,
                                    llm: e,
                                }))
                            }
                        >
                            {map(llm, ({ title }) => {
                                return (
                                    <Radio value={title} key={title}>
                                        {title}
                                    </Radio>
                                );
                            })}
                        </RadioGroup>
                    </FormItem>
                    <FormItem
                        hidden={settings.llm === 'Qwen-VL'}
                        label="API key"
                        extra={t(
                            'Only stored in your browser. Will not be stored on the server. Override your .env configuration.'
                        )}
                    >
                        <Input
                            id="openai-api-key"
                            placeholder="OpenAI API key"
                            value={settings.openAiApiKey || ''}
                            onChange={e =>
                                setSettings(s => ({
                                    ...s,
                                    openAiApiKey: e,
                                }))
                            }
                        />
                    </FormItem>
                    {['Gemini', 'Qwen-VL'].includes(settings.llm) ? null : settings.llm}
                    {!IS_RUNNING_ON_CLOUD && !['Gemini', 'Qwen-VL'].includes(settings.llm) && (
                        <>
                            <FormItem
                                label="Base URL"
                                extra={t(
                                    'If you dont want to use the default URL, replace it with the proxy URL. (optional)'
                                )}
                            >
                                <Input
                                    id="openai-base-url"
                                    placeholder={
                                        t(
                                            'If you dont want to use the default URL, replace it with the proxy URL.'
                                        ) as string
                                    }
                                    value={settings.openAiBaseURL || ''}
                                    onChange={e =>
                                        setSettings(s => ({
                                            ...s,
                                            openAiBaseURL: e,
                                        }))
                                    }
                                />
                            </FormItem>
                        </>
                    )}

                    <FormItem label={t('Simulate AI responses')} layout="inline">
                        <Switch
                            size="small"
                            id="image-generation"
                            checked={settings.mockAiResponse}
                            onChange={() =>
                                setSettings(s => ({
                                    ...s,
                                    mockAiResponse: !s.mockAiResponse,
                                }))
                            }
                        />
                    </FormItem>
                    {Config ? <Config /> : null}
                </Form>
            </Modal>
        </>
        // <Dialog>
        //     <DialogTrigger className="hover:bg-slate-200 rounded-sm pl-2 pr-2">
        //         <FaCog />
        //     </DialogTrigger>
        //     <DialogContent>
        //         <DialogHeader>
        //             <DialogTitle className="mb-4 ">设置</DialogTitle>
        //         </DialogHeader>

        //     </DialogContent>
        // </Dialog>
    );
}

export default SettingsDialog;
