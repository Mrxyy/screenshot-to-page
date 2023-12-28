import { GeneratedCodeConfig } from '../types';
import { Popover, Radio, Space } from '@arco-design/web-react';
import { map } from 'lodash';
import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

function generateDisplayComponent(config: GeneratedCodeConfig) {
    switch (config) {
        case GeneratedCodeConfig.REACT_ANTD:
            return (
                <div>
                    <span className="font-semibold">react</span> +{' '}
                    <span className="font-semibold">antd</span>
                </div>
            );
        case GeneratedCodeConfig.HTML_TAILWIND:
            return (
                <div>
                    <span className="font-semibold">HTML</span> +{' '}
                    <span className="font-semibold">Tailwind</span>
                </div>
            );
        case GeneratedCodeConfig.REACT_TAILWIND:
            return (
                <div>
                    <span className="font-semibold">React</span> +{' '}
                    <span className="font-semibold">Tailwind</span>
                </div>
            );
        case GeneratedCodeConfig.BOOTSTRAP:
            return (
                <div>
                    <span className="font-semibold">Bootstrap</span>
                </div>
            );
        case GeneratedCodeConfig.VUE_TAILWIND:
            return (
                <div>
                    <span className="font-semibold">vue</span> +{' '}
                    <span className="font-semibold">Tailwind</span>
                    <span className="text-orange-600 ml-[20px]">Beta</span>
                </div>
            );
        case GeneratedCodeConfig.VUE_ELEMENT:
            return (
                <div>
                    <span className="font-semibold">vue</span> +{' '}
                    <span className="font-semibold">element plus</span>
                    <span className="text-orange-600 ml-[20px]">Beta</span>
                </div>
            );
        // VUE_TAILWIND
        // case GeneratedCodeConfig.IONIC_TAILWIND:
        //   return (
        //     <div>
        //       <span className="font-semibold">Ionic</span> +{" "}
        //       <span className="font-semibold">Tailwind</span>
        //     </div>
        //   );
        default:
            // TODO: Should never reach this out. Error out
            return config;
    }
}

interface Props {
    generatedCodeConfig: GeneratedCodeConfig;
    setGeneratedCodeConfig: (config: GeneratedCodeConfig) => void;
    shouldDisableUpdates?: boolean;
    addThemeBtn: ReactElement;
}

function OutputSettingsSection({
    generatedCodeConfig,
    setGeneratedCodeConfig,
    shouldDisableUpdates = false,
    addThemeBtn,
}: Props) {
    // const [show, setShow] = useState(false);
    const { t } = useTranslation('draw');
    return (
        <div className="flex flex-col gap-y-2 justify-between text-sm">
            <div className="flex">
                <span className="font-bold whitespace-nowrap mr-4">{t('Theme style')}</span>
                <Popover
                    position="right"
                    title={t('Theme style')}
                    content={
                        <div className="my-[10px]">
                            <Radio.Group
                                name="card-radio-group"
                                value={generatedCodeConfig}
                                onChange={(value: string) =>
                                    setGeneratedCodeConfig(value as GeneratedCodeConfig)
                                }
                                disabled={shouldDisableUpdates}
                            >
                                {map(GeneratedCodeConfig, item => {
                                    return (
                                        <Radio key={item} value={item} className="w-full">
                                            {({ checked }) => {
                                                return (
                                                    <Space
                                                        align="start"
                                                        className={`custom-radio-card ${
                                                            checked
                                                                ? 'custom-radio-card-checked'
                                                                : ''
                                                        }`}
                                                    >
                                                        <div className="custom-radio-card-mask">
                                                            <div className="custom-radio-card-mask-dot"></div>
                                                        </div>
                                                        <div>
                                                            <div className="custom-radio-card-title">
                                                                {generateDisplayComponent(item)}
                                                            </div>
                                                        </div>
                                                    </Space>
                                                );
                                            }}
                                        </Radio>
                                    );
                                })}
                            </Radio.Group>
                        </div>
                    }
                >
                    <Space
                        align="start"
                        className={`custom-radio-card  custom-radio-card-checked min-w-[150px] text-center justify-center`}
                    >
                        <div className="custom-radio-card-mask">
                            <div className="custom-radio-card-mask-dot"></div>
                        </div>
                        <div>
                            <div className="custom-radio-card-title text-white">
                                {generateDisplayComponent(generatedCodeConfig)}
                            </div>
                        </div>
                    </Space>
                </Popover>
                <span className="font-bold whitespace-nowrap mx-4"> {t('Prompt word')}</span>
                {addThemeBtn}
            </div>
        </div>
    );
}

export default OutputSettingsSection;
