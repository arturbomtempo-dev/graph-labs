import { I18nContext } from '@/i18n/context';
import { useContext } from 'react';

export function useI18n() {
    const value = useContext(I18nContext);
    if (!value) throw new Error('useI18n must be used inside LocaleLayout.');
    return value;
}
