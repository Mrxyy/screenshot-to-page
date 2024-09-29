import { FunctionComponent, useEffect, useRef, useState } from 'react';
import ImageUpload from './components/ImageUpload';
import Preview from './components/Preview';
import { CodeGenerationParams, generateCode } from './generateCode';
import classNames from 'classnames';
import { FaCode, FaDesktop, FaDownload, FaUndo, FaPencilRuler } from 'react-icons/fa';

import SettingsDialog from './components/SettingsDialog';
import { Settings, EditorTheme, AppState, GeneratedCodeConfig } from './types';
import { usePersistedState } from './hooks/usePersistedState';
// import { UrlInputSection } from "./components/UrlInputSection";
import html2canvas from 'html2canvas';
import CodeTab from './components/CodeTab';
import OutputSettingsSection from './components/OutputSettingsSection';
import { History } from './components/history/history_types';
import HistoryDisplay from './components/history/HistoryDisplay';
import { extractHistoryTree } from './components/history/utils';
import toast from 'react-hot-toast';
import PromptPanel from './components/PromptPanel';
import React from 'react';
import { UrlInputSection } from './components/UrlInputSection';
import { Empty, Image, Input, List, Popover, Switch } from '@arco-design/web-react';
import {
    IconBug,
    IconCode,
    IconDesktop,
    IconHistory,
    IconImage,
    IconPhone,
    IconRobotAdd,
} from '@arco-design/web-react/icon';
import { Button as AButton } from '@arco-design/web-react';
import { Tabs as ATabs, Radio, Typography } from '@arco-design/web-react';
import Whiteboard from './components/Whiteboard';
import { useTranslation } from 'react-i18next';
const TabPane = ATabs.TabPane;

function App({ Config }: { Config?: FunctionComponent }) {
    const [appState, setAppState] = useState<AppState>(AppState.INITIAL);
    const [generatedCode, setGeneratedCode] = useState<string>('');

    const [referenceImages, setReferenceImages] = useState<string[]>([]);
    const [executionConsole, setExecutionConsole] = useState<string[]>([]);
    const [updateInstruction, setUpdateInstruction] = useState('');

    const [showWhiteboardDialog, setShowWhiteboardDialog] = useState<boolean>(false);

    // Settings
    const [settings, setSettings] = usePersistedState<Settings>(
        {
            openAiApiKey: null,
            openAiBaseURL: null,
            screenshotOneApiKey: null,
            isImageGenerationEnabled: true,
            editorTheme: EditorTheme.COBALT,
            generatedCodeConfig: GeneratedCodeConfig.HTML_TAILWIND,
            // Only relevant for hosted version
            isTermOfServiceAccepted: false,
            accessCode: null,
            mockAiResponse: false,
            promptCode: '',
            llm: 'Gemini',
        },
        'setting'
    );

    // App history
    const [appHistory, setAppHistory] = useState<History>([]);
    // Tracks the currently shown version from app history
    const [currentVersion, setCurrentVersion] = useState<number | null>(null);

    const [shouldIncludeResultImage, setShouldIncludeResultImage] = useState<boolean>(false);

    const wsRef = useRef<AbortController>(null);

    // When the user already has the settings in local storage, newly added keys
    // do not get added to the settings so if it's falsy, we populate it with the default
    // value
    useEffect(() => {
        if (!settings.generatedCodeConfig) {
            setSettings(prev => ({
                ...prev,
                generatedCodeConfig: GeneratedCodeConfig.HTML_TAILWIND,
            }));
        }
    }, [settings.generatedCodeConfig, setSettings]);

    const takeScreenshot = async (): Promise<string> => {
        const iframeElement = document.querySelector('#preview-desktop') as HTMLIFrameElement;
        if (!iframeElement?.contentWindow?.document.body) {
            return '';
        }

        const canvas = await html2canvas(iframeElement.contentWindow.document.body);
        const png = canvas.toDataURL('image/png');
        return png;
    };

    const downloadCode = () => {
        // Create a blob from the generated code
        const blob = new Blob([generatedCode], { type: 'text/html' });
        const url = URL.createObjectURL(blob);

        // Create an anchor element and set properties for download
        const a = document.createElement('a');
        a.href = url;
        a.download = 'index.html'; // Set the file name for download
        document.body.appendChild(a); // Append to the document
        a.click(); // Programmatically click the anchor to trigger download

        // Clean up by removing the anchor and revoking the Blob URL
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const reset = () => {
        setAppState(AppState.INITIAL);
        setGeneratedCode('');
        setReferenceImages([]);
        setExecutionConsole([]);
        setAppHistory([]);
    };

    const closeWhiteboardDialog = () => {
        setShowWhiteboardDialog(false);
    };

    const stop = () => {
        if (wsRef.current && !wsRef.current.signal.aborted) {
            wsRef.current.abort();
        }
        // make sure stop can correct the state even if the websocket is already closed
        setAppState(AppState.CODE_READY);
    };

    function doGenerateCode(params: CodeGenerationParams, parentVersion: number | null) {
        setExecutionConsole([]);
        setAppState(AppState.CODING);

        // Merge settings with params
        const updatedParams = { ...params, ...settings };
        generateCode(
            wsRef,
            updatedParams,
            token => setGeneratedCode(prev => prev + token),
            code => {
                setGeneratedCode(code);
                if (params.generationType === 'create') {
                    setAppHistory([
                        {
                            type: 'ai_create',
                            parentIndex: null,
                            code,
                            inputs: { image_url: referenceImages[0] },
                        },
                    ]);
                    setCurrentVersion(0);
                } else {
                    setAppHistory(prev => {
                        // Validate parent version
                        if (parentVersion === null) {
                            toast.error(
                                'No parent version set. Contact support or open a Github issue.'
                            );
                            return prev;
                        }

                        const newHistory: History = [
                            ...prev,
                            {
                                type: 'ai_edit',
                                parentIndex: parentVersion,
                                code,
                                inputs: {
                                    prompt: updateInstruction,
                                },
                            },
                        ];
                        setCurrentVersion(newHistory.length - 1);
                        return newHistory;
                    });
                }
            },
            line => setExecutionConsole(prev => [...prev, line]),
            () => {
                setAppState(AppState.CODE_READY);
            }
        );
    }

    // Initial version creation
    function doCreate(referenceImages: string[]) {
        // Reset any existing state
        reset();

        setReferenceImages(referenceImages);
        if (referenceImages.length > 0) {
            doGenerateCode(
                {
                    generationType: 'create',
                    image: referenceImages[0],
                },
                currentVersion
            );
        }
    }

    // Subsequent updates
    async function doUpdate() {
        if (currentVersion === null) {
            toast.error('No current version set. Contact support or open a Github issue.');
            return;
        }

        const updatedHistory = [
            ...extractHistoryTree(appHistory, currentVersion),
            updateInstruction,
        ];

        if (shouldIncludeResultImage) {
            const resultImage = await takeScreenshot();
            doGenerateCode(
                {
                    generationType: 'update',
                    image: referenceImages[0],
                    resultImage: resultImage,
                    history: updatedHistory,
                },
                currentVersion
            );
        } else {
            doGenerateCode(
                {
                    generationType: 'update',
                    image: referenceImages[0],
                    history: updatedHistory,
                },
                currentVersion
            );
        }

        setGeneratedCode('');
        setUpdateInstruction('');
    }
    const [visible, setVisible] = React.useState(false);
    const { t } = useTranslation('draw');
    const operationSession = (
        <div>
            <div className="grid col-span-1 gap-1 ml-[20px]">
                <AButton icon={<IconImage />} onClick={() => setVisible(true)} />
                <Image.Preview
                    className=" border border-gray-200 rounded-md "
                    src={referenceImages[0]}
                    visible={visible}
                    onVisibleChange={setVisible}
                />

                <Popover
                    className="w-[500px]"
                    content={
                        <List header={t('Log')}>
                            {executionConsole.length ? (
                                executionConsole.map((line, index) => (
                                    <List.Item
                                        key={index}
                                        className="border-b border-gray-400 mb-2 text-[var(--pc)] font-mono"
                                    >
                                        {line}
                                    </List.Item>
                                ))
                            ) : (
                                <Empty />
                            )}
                        </List>
                    }
                    position="rb"
                >
                    <AButton icon={<IconBug />} />
                </Popover>
                <Popover
                    className="w-[500px]"
                    content={
                        <HistoryDisplay
                            history={appHistory}
                            currentVersion={currentVersion}
                            revertToVersion={index => {
                                if (index < 0 || index >= appHistory.length || !appHistory[index])
                                    return;
                                setCurrentVersion(index);
                                setGeneratedCode(appHistory[index].code);
                            }}
                            shouldDisableReverts={appState === AppState.CODING}
                        />
                    }
                    position="rb"
                >
                    <AButton icon={<IconHistory />} />
                </Popover>
                <Popover
                    className="w-[500px]"
                    content={
                        /* {appState === AppState.CODE_READY && (
                                                        )} */
                        <div>
                            <div className="grid w-full gap-2">
                                <Input.TextArea
                                    placeholder={t('Tell Ai what do you want to modify...') || ''}
                                    onChange={value => setUpdateInstruction(value)}
                                    value={updateInstruction}
                                />
                                <div className="flex justify-between items-center gap-x-2">
                                    <div className="font-500 text-xs text-slate-700 dark:text-white">
                                        {t('Include screenshots of the current version?')}
                                    </div>
                                    <Switch
                                        checked={shouldIncludeResultImage}
                                        onChange={setShouldIncludeResultImage}
                                    />
                                </div>
                                <AButton
                                    onClick={doUpdate}
                                    className="dark:text-white dark:bg-gray-700"
                                >
                                    {t('Renew')}
                                </AButton>
                            </div>
                        </div>
                    }
                    position="rb"
                >
                    <AButton icon={<IconRobotAdd />} />
                </Popover>
            </div>
        </div>
    );

    return (
        <div className="mt-2 dark:bg-black dark:text-white">
            <main className="py-2">
                {/* (appState === AppState.CODING || appState === AppState.CODE_READY) && */}
                {
                    <div className="ml-4">
                        <div className="mx-8 mb-2 flex justify-between items-center">
                            <OutputSettingsSection
                                generatedCodeConfig={settings.generatedCodeConfig}
                                setGeneratedCodeConfig={(config: GeneratedCodeConfig) =>
                                    setSettings(prev => ({
                                        ...prev,
                                        generatedCodeConfig: config,
                                    }))
                                }
                                shouldDisableUpdates={
                                    appState === AppState.CODING || appState === AppState.CODE_READY
                                }
                                addThemeBtn={
                                    <PromptPanel settings={settings} setSettings={setSettings} />
                                }
                            />
                            <div className="flex  justify-end ">
                                {appState === AppState.CODE_READY && (
                                    <>
                                        <AButton
                                            className={'mx-[5px]'}
                                            icon={<FaUndo className="text-[var(--pc)]" />}
                                            iconOnly
                                            onClick={reset}
                                        />
                                        <AButton
                                            className={'mx-[5px]'}
                                            icon={<FaDownload className="text-[var(--pc)]" />}
                                            iconOnly
                                            onClick={downloadCode}
                                        />
                                    </>
                                )}
                                <AButton
                                    className={'mx-[5px]'}
                                    icon={<FaPencilRuler className="text-[var(--pc)]" />}
                                    iconOnly
                                    onClick={() => setShowWhiteboardDialog(true)}
                                />

                                <SettingsDialog
                                    settings={settings}
                                    setSettings={setSettings}
                                    Config={Config}
                                />
                            </div>
                        </div>
                        <ATabs
                            type="card-gutter"
                            className={'mx-8 mb-2 mt-[5px] Draw'}
                            // tabPosition="right"
                            // direction="vertical"
                        >
                            <TabPane
                                className="mt-[20px] h-[80vh] flex flex-col justify-center"
                                key="desktop"
                                title={
                                    <div className="text-[var(--pc)]">
                                        <IconDesktop /> {t('Desk')}
                                    </div>
                                }
                            >
                                {appState === AppState.INITIAL ? (
                                    <div className="flex flex-col justify-center items-center gap-y-10 w-full">
                                        <ImageUpload setReferenceImages={doCreate} />
                                        <UrlInputSection
                                            doCreate={doCreate}
                                            screenshotOneApiKey={settings.screenshotOneApiKey}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex  w-full">
                                        {operationSession}
                                        <Preview
                                            code={generatedCode}
                                            device="desktop"
                                            appState={appState}
                                            stop={stop}
                                        />
                                    </div>
                                )}
                            </TabPane>
                            <TabPane
                                className="mt-[20px]  h-[80vh] flex flex-col justify-center"
                                key="mobile"
                                title={
                                    <div className="text-[var(--pc)]">
                                        <IconPhone /> {t('Mobile Phone')}
                                    </div>
                                }
                            >
                                {appState === AppState.INITIAL ? (
                                    <div className="flex flex-col justify-center items-center gap-y-10 w-full">
                                        <ImageUpload setReferenceImages={doCreate} />
                                        <UrlInputSection
                                            doCreate={doCreate}
                                            screenshotOneApiKey={settings.screenshotOneApiKey}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex w-full">
                                        {operationSession}
                                        <Preview
                                            code={generatedCode}
                                            device="mobile"
                                            appState={appState}
                                            stop={stop}
                                        />
                                    </div>
                                )}
                            </TabPane>
                            <TabPane
                                className="mt-[20px] h-[80vh]"
                                key="code"
                                title={
                                    <div className="text-[var(--pc)]">
                                        <IconCode /> {t('Code')}
                                    </div>
                                }
                            >
                                <CodeTab
                                    code={generatedCode}
                                    setCode={setGeneratedCode}
                                    settings={settings}
                                />
                            </TabPane>
                        </ATabs>
                    </div>
                }
            </main>

            <div
                className={classNames('fixed top-0 z-[1000] w-full h-full', {
                    hidden: !showWhiteboardDialog,
                })}
            >
                <Whiteboard closeWhiteboardDialog={closeWhiteboardDialog} doCreate={doCreate} />
            </div>
        </div>
    );
}

export default App;
