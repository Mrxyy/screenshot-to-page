import { History, HistoryItemType } from './history_types';
import toast from 'react-hot-toast';
import classNames from 'classnames';
import { Badge, List, Popover } from '@arco-design/web-react';
import { useTranslation } from 'react-i18next';

interface Props {
    history: History;
    currentVersion: number | null;
    revertToVersion: (version: number) => void;
    shouldDisableReverts: boolean;
}

function displayHistoryItemType(itemType: HistoryItemType) {
    switch (itemType) {
        case 'ai_create':
            return 'Create';
        case 'ai_edit':
            return 'Edit';
        default: {
            const exhaustiveCheck: never = itemType;
            throw new Error(`Unhandled case: ${exhaustiveCheck}`);
        }
    }
}

export default function HistoryDisplay({
    history,
    currentVersion,
    revertToVersion,
    shouldDisableReverts,
}: Props) {
    const { t } = useTranslation('draw');
    return history.length === 0 ? null : (
        <div className="w-full h-[350px] min-w-[200px]">
            <h1 className="font-bold mb-2">{t('Historic version')}</h1>
            {
                <List height={300}>
                    {history.map((item, index) => (
                        <List.Item
                            key={index}
                            className={classNames('cursor-pointer', {
                                'hover:bg-[var(--pc)] hover:text-white': index !== currentVersion,
                                'bg-[var(--pc)] text-white': index === currentVersion,
                            })}
                            onClick={() =>
                                shouldDisableReverts
                                    ? toast.error(
                                          'Please wait for code generation to complete before viewing an older version.'
                                      )
                                    : revertToVersion(index)
                            }
                        >
                            <Popover
                                content={
                                    <div>
                                        <div>
                                            {item.type === 'ai_edit'
                                                ? item.inputs.prompt
                                                : 'Create'}
                                        </div>
                                        <Badge>{displayHistoryItemType(item.type)}</Badge>
                                    </div>
                                }
                            >
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex gap-x-1 truncate justify-start w-full ">
                                        <h2 className="text-sm truncate">
                                            {item.type === 'ai_edit'
                                                ? item.inputs.prompt
                                                : t('Version')}
                                        </h2>
                                        {/* <h2 className="text-sm">{displayHistoryItemType(item.type)}</h2> */}
                                        {item.parentIndex !== null &&
                                        item.parentIndex !== index - 1 ? (
                                            <h2 className="text-sm">
                                                (parent: v{(item.parentIndex || 0) + 1})
                                            </h2>
                                        ) : null}
                                    </div>
                                    <h2 className="text-sm">v{index + 1}</h2>
                                </div>
                            </Popover>
                        </List.Item>
                    ))}
                </List>
            }
        </div>
    );
}
