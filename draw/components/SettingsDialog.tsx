import React from 'react';
import { FaCog } from 'react-icons/fa';
import { Settings } from '../types';

import { IS_RUNNING_ON_CLOUD } from '../config';

import { Button, Form, Input, Modal, Switch } from '@arco-design/web-react';
const FormItem = Form.Item;
interface Props {
    settings: Settings;
    setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}

function SettingsDialog({ settings, setSettings }: Props) {
    const [visible, setVisible] = React.useState(false);
    return (
        <>
            <Button
                className={'mx-[5px]'}
                onClick={() => setVisible(true)}
                icon={<FaCog className="text-[var(--pc)]" />}
                iconOnly
            />

            <Modal
                title={'设置'}
                okText={'保存'}
                visible={visible}
                onOk={() => setVisible(false)}
                onCancel={() => setVisible(false)}
                autoFocus={false}
                focusLock={true}
            >
                <Form layout="vertical">
                    <FormItem
                        label="API key"
                        extra="仅存储在您的浏览器中。不会存储在服务器上。覆盖您的.env配置。"
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
                                extra="如果您不想使用默认的URL，请替换为代理URL。(可选)"
                            >
                                <Input
                                    id="openai-base-url"
                                    placeholder="如果您不想使用默认的URL，请替换为代理URL。"
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

                    <FormItem label="模拟 AI 响应" layout="inline">
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
