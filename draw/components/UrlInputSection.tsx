import { useState } from 'react';
import { HTTP_BACKEND_URL } from '../config';
import { toast } from 'react-hot-toast';
import { IconLink } from '@arco-design/web-react/icon';
import { Button, Input, Link } from '@arco-design/web-react';
import { backendApi } from '@/client/api';
import { useTranslation } from 'react-i18next';

interface Props {
    screenshotOneApiKey: string | null;
    doCreate: (urls: string[]) => void;
}

export function UrlInputSection({ doCreate, screenshotOneApiKey }: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [referenceUrl, setReferenceUrl] = useState('');

    async function takeScreenshot() {
        // if (!screenshotOneApiKey) {
        //     toast.error(
        //         'Please add a ScreenshotOne API key in the Settings dialog. This is optional - you can also drag/drop and upload images directly.',
        //         { duration: 8000 }
        //     );
        //     return;
        // }

        if (!referenceUrl) {
            toast.error('Please enter a URL');
            return;
        }

        if (referenceUrl) {
            try {
                setIsLoading(true);
                //? LLM support Fetch Image
                // const { data } = await backendApi(`/api/screenshot?url=${referenceUrl}`);
                // if (!response.ok) {
                //     throw new Error('Failed to capture screenshot');
                // }
                doCreate([referenceUrl]);
            } catch (error) {
                console.error(error);
                toast.error(
                    'Failed to capture screenshot. Look at the console and your backend logs for more details.'
                );
            } finally {
                setIsLoading(false);
            }
        }
    }
    const { t } = useTranslation('draw');
    return (
        <div className="max-w-[90%] min-w-[40%] gap-y-2 flex flex-col">
            <div className="text-gray-500 text-sm">
                <span className="text-blue-400">{t('Or a link to an image')}</span>
                <IconLink style={{ color: 'var(--pc)' }} />
            </div>
            <Input
                className="rounded-lg bg-white border-dotted border border-[var(--pc)] hover:bottom-2 hover:border-solid"
                autoFocus
                placeholder={t('Please enter the URL')}
                onChange={val => setReferenceUrl(val)}
                value={referenceUrl}
            />
            <Button
                loading={isLoading}
                onClick={takeScreenshot}
                disabled={isLoading}
                type="primary"
                shape="round"
                size="large"
            >
                {t('Get')}
            </Button>
        </div>
    );
}
