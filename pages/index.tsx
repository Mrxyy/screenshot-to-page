import Draw from '@/draw/main';
import { Form, Select, Switch } from '@arco-design/web-react';
import { IconMoonFill, IconSunFill } from '@arco-design/web-react/icon';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '@/next-i18next.config';
import { map } from 'lodash';
const FormItem = Form.Item;
const Option = Select.Option;
const options = {
    zh: '中文',
    en: 'English',
};

export default function DrawComponent() {
    const { t } = useTranslation('draw');
    const [theme, setTheme] = useState(localStorage.getItem('theme'));
    useEffect(() => {
        const t = theme || window.localStorage.getItem('theme') || 'light';
        t === 'dark'
            ? document.body.setAttribute('arco-theme', 'dark')
            : document.body.removeAttribute('arco-theme');
        window.localStorage.setItem('theme', t);
        if (!theme) setTheme(t);
    }, [theme]);
    function config() {
        return (
            <>
                <FormItem label={t('Theme')} layout="inline">
                    <Switch
                        size="small"
                        className="shadow"
                        checkedIcon={<IconMoonFill />}
                        uncheckedIcon={<IconSunFill className="text-yellow-500" />}
                        checked={theme === 'dark'}
                        onChange={e => {
                            setTheme(e ? 'dark' : 'light');
                        }}
                    />
                </FormItem>
                <FormItem label={t('language')} layout="inline">
                    <Select
                        placeholder={t('Please select language')!}
                        style={{ width: 154 }}
                        onChange={value => i18n.changeLanguage(value)}
                        value={i18n.language}
                    >
                        {map(options, (label, key) => (
                            <Option key={key} value={key}>
                                {label}
                            </Option>
                        ))}
                    </Select>
                </FormItem>
            </>
        );
    }
    return <Draw Config={config} />;
}
