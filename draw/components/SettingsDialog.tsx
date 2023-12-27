import React from 'react';
import { FaCog } from 'react-icons/fa';
import { Settings } from '../types';

import { IS_RUNNING_ON_CLOUD } from '../config';

import { Button, Form, Input, Modal, Switch } from '@arco-design/web-react';
import { useTranslation } from 'react-i18next';
const FormItem = Form.Item;
interface Props {
    settings: Settings;
    setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}

function SettingsDialog({ settings, setSettings }: Props) {
    const [visible, setVisible] = React.useState(false);
    const { t } = useTranslation('translations');
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

                    {!IS_RUNNING_ON_CLOUD && (
                        <>
                            <FormItem
                                label="Base URL"
                                extra={t(
                                    'If you dont want to use the default URL, replace it with the proxy URL. (optional)'
                                )}
                            >
                                <Input
                                    id="openai-base-url"
                                    placeholder={t(
                                        'If you dont want to use the default URL, replace it with the proxy URL.'
                                    )}
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
