import {m} from 'malevic';
import {isFirefox} from '../../../utils/platform';
import {ViewProps} from '../types';
import SiteList from './site-list';
import CheckButton from '../check-button';

export default function SiteListPage(props: ViewProps) {
    function onSiteListChange(sites: string[]) {
        props.actions.changeSettings({siteListDisabled: sites});
    }
    function onInvertPDFChange(checked: boolean) {
        props.actions.changeSettings({enableForPDF: checked});
    }
    function onEnableForProtectedPages(value: boolean) {
        props.actions.changeSettings({enableForProtectedPages: value});
    }
    // TODO: Make UI compatible with siteListDisabled/siteListEnabled.
    return (
        <div class="site-list-page">
            <SiteList
                siteList={props.data.settings.siteListDisabled}
                onChange={onSiteListChange}
            />
            <label class="site-list-page__description">Enter website name and press Enter</label>
            {isFirefox() ? null : <CheckButton
                checked={props.data.settings.enableForPDF}
                label="Enable for PDF files"
                description={props.data.settings.enableForPDF ?
                    'Enabled for PDF documents' :
                    'Disabled for PDF documents'}
                onChange={onInvertPDFChange}
            />}
            <CheckButton
                checked={props.data.settings.enableForProtectedPages}
                onChange={onEnableForProtectedPages}
                label={'Enable on restricted pages'}
                description={props.data.settings.enableForProtectedPages ?
                    'You should enable it in browser flags too' :
                    'Disabled for web store and other pages'}
            />
        </div>
    );
}
