import { Settings } from '../types';
import { useContext, useMemo, useState } from 'react';
import { promptContext, PromptType } from '../contexts/PromptContext';
import { GeneratedCodeConfig } from '../types';
import { cloneDeep } from 'lodash';
import { FaTrashAlt, FaHammer } from 'react-icons/fa';
import classNames from 'classnames';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Avatar, Card, Form, Modal, Popover, Space, Input } from '@arco-design/web-react';
import { IconPlus } from '@arco-design/web-react/icon';
import { useTranslation } from 'react-i18next';

const Item = Form.Item;
interface Props {
    settings: Settings;
    setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}

function PromptPanel({ settings, setSettings }: Props) {
    const [selectedId, setSelectedId] = useState<string>('');
    const { promptList, addPrompt, getPromptById, removePrompt } = useContext(promptContext);
    const initPrompt = {
        id: '',
        name: '',
        des: '',
        imgUrl: '',
        prompt: '',
        type: GeneratedCodeConfig.REACT_ANTD,
    };
    const [prompt, setPrompt] = useState<PromptType>(cloneDeep(initPrompt));
    const [showDialog, setShowDialog] = useState<boolean>(false);

    async function addPromptHanler() {
        // generatedCodeConfig: "react_tailwind"
        prompt.type = settings.generatedCodeConfig;
        if (!prompt.prompt) {
            toast.error('enter prompt');
            return;
        }
        addPrompt(prompt);
        setShowDialog(false);
        setPrompt(cloneDeep(initPrompt));
    }

    useEffect(() => {
        if (selectedId) {
            const prompt = getPromptById(selectedId);
            setSettings(prev => ({
                ...prev,
                promptCode: prompt ? prompt.prompt : '',
            }));
        } else {
            setSettings(prev => ({
                ...prev,
                promptCode: '',
            }));
        }
    }, [selectedId]);

    useEffect(() => {
        setSettings(prev => ({
            ...prev,
            promptCode: '',
        }));

        setSelectedId('');
    }, [settings.generatedCodeConfig, setSettings]);

    const updatePromptHandler = (e: any, id: string) => {
        e.stopPropagation();
        setShowDialog(true);
        const prompt = getPromptById(id);
        prompt && setPrompt(prompt);
    };

    const { listNode, node } = useMemo(() => {
        let node;
        const listNode = promptList.map(prompt => {
            if (prompt.type === settings.generatedCodeConfig) {
                const temp = (
                    <div
                        key={prompt.id}
                        onClick={async () => {
                            if (selectedId === prompt.id) {
                                setSelectedId('');
                            } else {
                                setSelectedId(prompt.id);
                            }
                        }}
                    >
                        <Card
                            hoverable
                            className={classNames(
                                'card-with-icon-hover rounded-lg my-2',
                                selectedId === prompt.id
                                    ? 'border-2 border-solid border-emerald-500'
                                    : ''
                            )}
                            // cover={
                            //     <div style={{ height: 100, overflow: 'hidden' }}>
                            //         <img
                            //             style={{
                            //                 width: '100%',
                            //                 transform: 'translateY(-20px)',
                            //             }}
                            //             alt="dessert"
                            //             src="//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a20012a2d4d5b9db43dfc6a01fe508c0.png~tplv-uwbnlip3yd-webp.webp"
                            //         />
                            //     </div>
                            // }
                            actions={[
                                <span className="icon-hover">
                                    <FaHammer
                                        className="hover:text-emerald-500"
                                        onClick={e => {
                                            updatePromptHandler(e, prompt.id);
                                        }}
                                    />
                                </span>,
                                <span
                                    className="icon-hover"
                                    onClick={() => {
                                        removePrompt(prompt.id);
                                    }}
                                >
                                    <FaTrashAlt className="hover:text-red-500" />
                                </span>,
                            ]}
                        >
                            <Card.Meta
                                avatar={
                                    <Space>
                                        <Avatar size={24}>{prompt.name}</Avatar>
                                        {/* <Typography.Text>{prompt.name}</Typography.Text> */}
                                    </Space>
                                }
                                title={prompt.name}
                                description={prompt.des}
                            />
                        </Card>
                    </div>
                );
                if (selectedId === prompt.id) {
                    node = prompt;
                }
                return temp;
            } else {
                return null;
            }
        });
        console.log(node, promptList, selectedId);
        return { listNode, node };
    }, [selectedId, settings, promptList]);

    const { t } = useTranslation('draw');
    return (
        <div className="relative">
            <div>
                <Popover
                    className="w-[400px]"
                    position="right"
                    title={t('Prompt word')}
                    content={
                        <div>
                            {listNode}
                            <div
                                className="border-dashed border-2 border-gray-300 p-[20px] my-[20px] rounded-lg flex justify-center items-center cursor-pointer"
                                onClick={() => {
                                    setPrompt(cloneDeep(initPrompt));
                                    setShowDialog(true);
                                }}
                            >
                                <IconPlus /> {t('Add')}
                            </div>
                        </div>
                    }
                >
                    <Space
                        align="start"
                        className={`custom-radio-card  custom-radio-card-checked min-w-[150px] text-center justify-center ${
                            !node?.name ? 'bg-white' : ''
                        }`}
                    >
                        <div className="custom-radio-card-mask">
                            <div className="custom-radio-card-mask-dot"></div>
                        </div>
                        <div>
                            <div className="custom-radio-card-title text-white">
                                {node?.name || t('Please select')}
                            </div>
                        </div>
                    </Space>
                </Popover>
                <Modal
                    visible={showDialog}
                    title={'提示词'}
                    onOk={addPromptHanler}
                    okText="保存"
                    onCancel={() => setShowDialog(false)}
                >
                    <Form layout="vertical">
                        <Item label="主题名称">
                            <Input
                                id="prompt-name"
                                placeholder="主题名称"
                                value={prompt.name}
                                onChange={e => {
                                    setPrompt(s => ({
                                        ...s,
                                        name: e,
                                    }));
                                }}
                            />
                        </Item>
                        <Item label="主题描述">
                            <Input
                                id="prompt-des"
                                placeholder="主题描述"
                                value={prompt.des}
                                onChange={e => {
                                    setPrompt(s => ({
                                        ...s,
                                        des: e,
                                    }));
                                }}
                            />
                        </Item>
                        <Item label="提示词案例">
                            <Input.TextArea
                                id="prompt"
                                placeholder="提示词案例"
                                value={prompt.prompt}
                                onChange={e => {
                                    setPrompt(s => ({
                                        ...s,
                                        prompt: e,
                                    }));
                                }}
                            ></Input.TextArea>
                        </Item>
                        {/* <Item label="prompt-url">
                                <Input
                                    id="prompt-url"
                                    placeholder="prompt url"
                                    value={prompt.imgUrl}
                                    onChange={e => {
                                        setPrompt(s => ({
                                            ...s,
                                            imgUrl: e.target.value,
                                        }));
                                    }}
                                />
                            </Item> */}
                    </Form>
                </Modal>
            </div>
        </div>
    );
}

export default PromptPanel;
