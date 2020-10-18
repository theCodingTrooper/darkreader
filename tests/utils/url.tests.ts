import {isURLEnabled, isURLMatched, isPDF, getURLHostOrProtocol, getAbsoluteURL} from '../../src/utils/url';
import {UserSettings} from '../../src/definitions';

test('URL is enabled', () => {
    // Not invert listed
    expect(isURLEnabled(
        'https://mail.google.com/mail/u/0/',
        {siteListDisabled: ['google.com'], siteListEnabled: []} as UserSettings,
        [],
        {isProtected: false},
    )).toBe(true);
    expect(isURLEnabled(
        'https://mail.google.com/mail/u/0/',
        {siteListDisabled: ['mail.google.com'], siteListEnabled: []} as UserSettings,
        [],
        {isProtected: false},
    )).toBe(false);
    expect(isURLEnabled(
        'https://mail.google.com/mail/u/0/',
        {siteListDisabled: ['mail.google.*'], siteListEnabled: []} as UserSettings,
        [],
        {isProtected: false},
    )).toBe(false);
    expect(isURLEnabled(
        'https://mail.google.com/mail/u/0/',
        {siteListDisabled: ['mail.google.*/mail'], siteListEnabled: []} as UserSettings,
        [],
        {isProtected: false},
    )).toBe(false);
    expect(isURLEnabled(
        'https://mail.google.com/mail/u/0/',
        {siteListDisabled: [], siteListEnabled: []} as UserSettings,
        [],
        {isProtected: false},
    )).toBe(true);
    expect(isURLEnabled(
        'https://mail.google.com/mail/u/0/',
        {siteListDisabled: ['google.com/maps'], siteListEnabled: []} as UserSettings,
        [],
        {isProtected: false},
    )).toBe(true);

    // Invert listed only
    expect(isURLEnabled(
        'https://mail.google.com/mail/u/0/',
        {siteListDisabled: ['*'], siteListEnabled: ['google.com']} as UserSettings,
        [],
        {isProtected: false},
    )).toBe(true);
    expect(isURLEnabled(
        'https://mail.google.com/mail/u/0/',
        {siteListDisabled: ['*'], siteListEnabled: ['google.*/mail']} as UserSettings,
        [],
        {isProtected: false},
    )).toBe(true);
    expect(isURLEnabled(
        'https://mail.google.com/mail/u/0/',
        {siteListDisabled: ['*'], siteListEnabled: []} as UserSettings,
        [],
        {isProtected: false},
    )).toBe(false);
    expect(isURLEnabled(
        'https://mail.google.com/mail/u/0/',
        {siteListDisabled: ['*'], siteListEnabled: ['google.com/maps']} as UserSettings,
        [],
        {isProtected: false},
    )).toBe(false);

    // Special URLs
    expect(isURLEnabled(
        'https://chrome.google.com/webstore',
        {siteListDisabled: ['chrome.google.com'], siteListEnabled: [], enableForProtectedPages: true} as UserSettings,
        [],
        {isProtected: true},
    )).toBe(false);
    expect(isURLEnabled(
        'https://chrome.google.com/webstore',
        {siteListDisabled: ['*'], siteListEnabled: ['chrome.google.com'], enableForProtectedPages: true} as UserSettings,
        [],
        {isProtected: true},
    )).toBe(true);
    expect(isURLEnabled(
        'https://chrome.google.com/webstore',
        {siteListDisabled: [], siteListEnabled: [], enableForProtectedPages: false} as UserSettings,
        [],
        {isProtected: true},
    )).toBe(false);
    expect(isURLEnabled(
        'https://chrome.google.com/webstore',
        {siteListDisabled: ['chrome.google.com'], siteListEnabled: [], enableForProtectedPages: true} as UserSettings,
        [],
        {isProtected: true},
    )).toBe(false);
    expect(isURLEnabled(
        'https://microsoftedge.microsoft.com/addons',
        {siteListDisabled: ['microsoftedge.microsoft.com'], siteListEnabled: [], enableForProtectedPages: true} as UserSettings,
        [],
        {isProtected: true},
    )).toBe(false);
    expect(isURLEnabled(
        'https://microsoftedge.microsoft.com/addons',
        {siteListDisabled: ['*'], siteListEnabled: ['microsoftedge.microsoft.com'], enableForProtectedPages: true} as UserSettings,
        [],
        {isProtected: true},
    )).toBe(true);
    expect(isURLEnabled(
        'https://duckduckgo.com',
        {siteListDisabled: [], siteListEnabled: [], enableForProtectedPages: true} as UserSettings,
        [],
        {isProtected: false},
    )).toBe(true);
    expect(isURLEnabled(
        'https://darkreader.org/',
        {siteListDisabled: [], siteListEnabled: []} as UserSettings,
        ['darkreader.org'],
        {isProtected: false},
    )).toBe(false);
    expect(isURLEnabled(
        'https://darkreader.org/',
        {siteListDisabled: ['*'], siteListEnabled: ['darkreader.org']} as UserSettings,
        ['darkreader.org'],
        {isProtected: false},
    )).toBe(true);
    expect(isURLEnabled(
        'https://www.google.com/file.pdf',
        {siteListDisabled: ['darkreader.org'], siteListEnabled: [], enableForPDF: true} as UserSettings,
        [],
        {isProtected: false},
    )).toBe(true);
    expect(isURLEnabled(
        'https://www.google.com/file.pdf',
        {siteListDisabled: ['*'], siteListEnabled: ['darkreader.org'], enableForPDF: true} as UserSettings,
        [],
        {isProtected: false},
    )).toBe(true);
    expect(isURLEnabled(
        'https://www.google.com/file.pdf',
        {siteListDisabled: ['darkreader.org'], siteListEnabled: [], enableForPDF: false} as UserSettings,
        [],
        {isProtected: false},
    )).toBe(false);
    expect(isURLEnabled(
        'https://www.google.com/file.pdf/resource',
        {siteListDisabled: ['*'], siteListEnabled: ['darkreader.org'], enableForPDF: true} as UserSettings,
        [],
        {isProtected: false},
    )).toBe(false);
    expect(isURLEnabled(
        'https://www.google.com/file.pdf/resource',
        {siteListDisabled: ['darkreader.org'], siteListEnabled: [], enableForPDF: true} as UserSettings,
        [],
        {isProtected: false},
    )).toBe(true);
    expect(isURLEnabled(
        'https://www.google.com/very/good/hidden/folder/pdf#file.pdf',
        {siteListDisabled: ['https://www.google.com/very/good/hidden/folder/pdf#file.pdf'], siteListEnabled: [], enableForPDF: true} as UserSettings,
        [],
        {isProtected: false},
    )).toBe(false);

    // Test for PDF enabling
    expect(isPDF(
        'https://www.google.com/file.pdf'
    )).toBe(true);
    expect(isPDF(
        'https://www.google.com/file.pdf?id=2'
    )).toBe(true);
    expect(isPDF(
        'https://www.google.com/file.pdf/resource'
    )).toBe(false);
    expect(isPDF(
        'https://www.google.com/resource?file=file.pdf'
    )).toBe(false);
    expect(isPDF(
        'https://www.google.com/very/good/hidden/folder/pdf#file.pdf'
    )).toBe(false);
    expect(isPDF(
        'https://fi.wikipedia.org/wiki/Tiedosto:ExtIPA_chart_(2015).pdf?uselang=en'
    )).toBe(false);
    expect(isPDF(
        'https://commons.wikimedia.org/wiki/File:ExtIPA_chart_(2015).pdf'
    )).toBe(false);
    expect(isPDF(
        'https://upload.wikimedia.org/wikipedia/commons/5/56/ExtIPA_chart_(2015).pdf'
    )).toBe(true);

    // IPV6 Testing
    expect(isURLEnabled(
        '[::1]:1337',
        {siteListDisabled: ['google.com'], siteListEnabled: []} as UserSettings,
        [],
        {isProtected: false},
    )).toBe(true);
    expect(isURLEnabled(
        '[::1]:8080',
        {siteListDisabled: ['[::1]:8080'], siteListEnabled: []} as UserSettings,
        [],
        {isProtected: false},
    )).toEqual(false);
    expect(isURLEnabled(
        '[::1]:8080',
        {siteListDisabled: ['*'], siteListEnabled: ['[::1]:8081']} as UserSettings,
        [],
        {isProtected: false},
    )).toEqual(false);
    expect(isURLEnabled(
        '[::1]:8080',
        {siteListDisabled: ['[::1]:8081'], siteListEnabled: []} as UserSettings,
        [],
        {isProtected: false},
    )).toEqual(true);
    expect(isURLEnabled(
        '[::1]:17',
        {siteListDisabled: ['*'], siteListEnabled: ['[::1]']} as UserSettings,
        [],
        {isProtected: false},
    )).toEqual(false);
    expect(isURLEnabled(
        '[2001:4860:4860::8888]',
        {siteListDisabled: ['*'], siteListEnabled: ['[2001:4860:4860::8888]']} as UserSettings,
        [],
        {isProtected: false},
    )).toEqual(true);
    expect(isURLEnabled(
        '[2001:4860:4860::8844]',
        {siteListDisabled: ['*'], siteListEnabled: ['[2001:4860:4860::8844]']} as UserSettings,
        ['[2001:4860:4860::8844]'],
        {isProtected: false},
    )).toEqual(true);
    expect(isURLEnabled(
        '[2001:4860:4860::8844]',
        {siteListDisabled: ['*'], siteListEnabled: []} as UserSettings,
        ['[2001:4860:4860::8844]'],
        {isProtected: false},
    )).toEqual(false);

    // Some URLs can have unescaped [] in query
    expect(isURLMatched(
        'google.co.uk/order.php?bar=[foo]',
        'google.co.uk',
    )).toEqual(true);
    expect(isURLMatched(
        '[2001:4860:4860::8844]/order.php?bar=foo',
        '[2001:4860:4860::8844]',
    )).toEqual(true);
    expect(isURLMatched(
        '[2001:4860:4860::8844]/order.php?bar=[foo]',
        '[2001:4860:4860::8844]',
    )).toEqual(true);
    expect(isURLMatched(
        'google.co.uk/order.php?bar=[foo]',
        '[2001:4860:4860::8844]',
    )).toEqual(false);

    // Temporary Dark Sites list fix
    expect(isURLEnabled(
        'https://darkreader.org/',
        {siteListDisabled: [], siteListEnabled: ['darkreader.org']} as UserSettings,
        ['darkreader.org'],
        {isProtected: false},
    )).toBe(true);
    expect(isURLEnabled(
        'https://darkreader.org/',
        {siteListDisabled: [], siteListEnabled: []} as UserSettings,
        ['darkreader.org'],
        {isProtected: false},
    )).toBe(false);
    expect(isURLEnabled(
        'https://google.com/',
        {siteListDisabled: [], siteListEnabled: ['darkreader.org']} as UserSettings,
        [],
        {isProtected: false},
    )).toBe(true);
});

test('Get URL host or protocol', () => {
    expect(getURLHostOrProtocol('https://www.google.com')).toBe('www.google.com');
    expect(getURLHostOrProtocol('https://www.google.com/maps')).toBe('www.google.com');
    expect(getURLHostOrProtocol('http://localhost:8080')).toBe('localhost:8080');
    expect(getURLHostOrProtocol('about:blank')).toBe('about:');
    expect(getURLHostOrProtocol('http://user:pass@www.example.org')).toBe('www.example.org');
    expect(getURLHostOrProtocol('data:text/html,<html>Hello</html>')).toBe('data:');
    expect(getURLHostOrProtocol('file:///Users/index.html')).toBe('file:');
});

test('Absolute URL', () => {
    expect(getAbsoluteURL('https://www.google.com', 'image.jpg')).toBe('https://www.google.com/image.jpg');
    expect(getAbsoluteURL('https://www.google.com', '/image.jpg')).toBe('https://www.google.com/image.jpg');
    expect(getAbsoluteURL('https://www.google.com/path', '/image.jpg')).toBe('https://www.google.com/image.jpg');
    expect(getAbsoluteURL('//www.google.com', '/image.jpg')).toBe(`${location.protocol}//www.google.com/image.jpg`);
    expect(getAbsoluteURL('https://www.google.com', 'image.jpg?size=128')).toBe('https://www.google.com/image.jpg?size=128');
    expect(getAbsoluteURL('https://www.google.com/path', 'image.jpg')).toBe('https://www.google.com/image.jpg');
    expect(getAbsoluteURL('https://www.google.com/path/', 'image.jpg')).toBe('https://www.google.com/path/image.jpg');
    expect(getAbsoluteURL('https://www.google.com/long/path', '../image.jpg')).toBe('https://www.google.com/image.jpg');
    expect(getAbsoluteURL('https://www.google.com/long/path/', '../image.jpg')).toBe('https://www.google.com/long/image.jpg');
    expect(getAbsoluteURL('https://www.google.com/long/path/', '../another/image.jpg')).toBe('https://www.google.com/long/another/image.jpg');
    expect(getAbsoluteURL('https://www.google.com/path/page.html', 'image.jpg')).toBe('https://www.google.com/path/image.jpg');
    expect(getAbsoluteURL('https://www.google.com/path/page.html', '/image.jpg')).toBe('https://www.google.com/image.jpg');
    expect(getAbsoluteURL('https://www.google.com', '//www.google.com/path/image.jpg')).toBe('https://www.google.com/path/image.jpg');
    expect(getAbsoluteURL('https://www.google.com', '//www.google.com/path/../another/image.jpg')).toBe('https://www.google.com/another/image.jpg');
    expect(getAbsoluteURL('https://www.google.com', 'https://www.google.com/path/image.jpg')).toBe('https://www.google.com/path/image.jpg');
    expect(getAbsoluteURL('https://www.google.com', 'https://www.google.com/path/../another/image.jpg')).toBe('https://www.google.com/another/image.jpg');
    expect(getAbsoluteURL('https://www.google.com/path/page.html', 'image.jpg')).toBe('https://www.google.com/path/image.jpg');
    expect(getAbsoluteURL('https://www.google.com/path/page.html', '../image.jpg')).toBe('https://www.google.com/image.jpg');
    expect(getAbsoluteURL('path/index.html', 'image.jpg')).toBe(`${location.origin}/path/image.jpg`);
    expect(getAbsoluteURL('path/index.html', '/image.jpg?size=128')).toBe(`${location.origin}/image.jpg?size=128`);
});
