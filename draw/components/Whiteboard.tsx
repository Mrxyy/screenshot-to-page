'use client';
import React, { useEffect, useState } from 'react';
import { FaHourglass } from 'react-icons/fa';
import { IconDashboard } from '@arco-design/web-react/icon';
import { Button } from '@arco-design/web-react';
import fetchDomPageWrapper from '@/utils/FetchDomPackage';
import type {
    Excalidraw as ExcalidrawTypes,
    exportToCanvas as exportToCanvasTypes,
} from '@excalidraw/excalidraw';

let Excalidraw: typeof ExcalidrawTypes;
let exportToCanvas: typeof exportToCanvasTypes;

interface Props {
    doCreate: (urls: string[]) => void;
    closeWhiteboardDialog: () => void;
}

const initialData = {
    appState: {},
};

function Whiteboard({ doCreate, closeWhiteboardDialog }: Props) {
    const [excalidrawAPI, setExcalidrawAPI] = useState(null);
    const [theme, setTheme] = useState('light');
    useEffect(() => {
        setTheme(localStorage.getItem('theme')!);
    }, []);

    // const [canvasUrl, setCanvasUrl] = useState("");

    const exportImg = async () => {
        if (!excalidrawAPI) {
            return;
        }

        const elements = (excalidrawAPI as any).getSceneElements();
        if (!elements || !elements.length) {
            return;
        }
        const canvas = await exportToCanvas({
            elements,
            appState: {
                ...initialData.appState,
                exportWithDarkMode: false,
            },
            files: (excalidrawAPI as any).getFiles(),
            // getDimensions: () => { return {width: 750, height: 750}}
        });
        // setCanvasUrl(canvas.toDataURL());
        doCreate([canvas.toDataURL()]);
        closeWhiteboardDialog();
    };

    return (
        <div className="fixed top-0 z-[1000] w-full h-full">
            <Excalidraw
                renderTopRightUI={() => (
                    <>
                        <Button
                            icon={<FaHourglass />}
                            iconOnly
                            shape="round"
                            onClick={exportImg}
                            className="mt-[3px]"
                        />

                        <Button
                            className="mt-[3px]"
                            shape="round"
                            icon={<IconDashboard />}
                            iconOnly
                            onClick={() => {
                                closeWhiteboardDialog();
                            }}
                        />
                    </>
                )}
                // @ts-ignore
                excalidrawAPI={api => setExcalidrawAPI(api)}
                theme={theme}
            >
                {/* <MainMenu>
              <MainMenu.Item onSelect={() => {
                (excalidrawAPI as any).resetScene();
              }}>
                help
              </MainMenu.Item>
            </MainMenu> */}
            </Excalidraw>
        </div>
    );
}

export default fetchDomPageWrapper(
    Whiteboard,
    () => import('@excalidraw/excalidraw'),
    data => {
        exportToCanvas = data.exportToCanvas;
        Excalidraw = data.Excalidraw;
    }
);
