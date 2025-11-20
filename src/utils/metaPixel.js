/**
 * Meta Pixel Integration
 * Handles client-side event tracking via Meta Pixel
 */

// Initialize Meta Pixel
export const initMetaPixel = (pixelId) => {
    if (!pixelId) {
        console.warn('Meta Pixel ID not provided');
        return;
    }

    // Check if fbq already exists
    if (window.fbq) return;

    // Meta Pixel base code
    !(function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () {
            n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    window.fbq('init', pixelId);
    window.fbq('track', 'PageView');

    console.log('Meta Pixel initialized:', pixelId);
};

// Track standard events
export const trackEvent = (eventName, parameters = {}) => {
    if (!window.fbq) {
        console.warn('Meta Pixel not initialized');
        return;
    }

    window.fbq('track', eventName, parameters);
    console.log('Meta Pixel event tracked:', eventName, parameters);
};

// Track custom events
export const trackCustomEvent = (eventName, parameters = {}) => {
    if (!window.fbq) {
        console.warn('Meta Pixel not initialized');
        return;
    }

    window.fbq('trackCustom', eventName, parameters);
    console.log('Meta Pixel custom event tracked:', eventName, parameters);
};

// Standard event helpers
export const trackPageView = () => {
    trackEvent('PageView');
};

export const trackViewContent = (contentData = {}) => {
    trackEvent('ViewContent', {
        content_name: contentData.name || '',
        content_category: contentData.category || '',
        content_ids: contentData.ids || [],
        content_type: contentData.type || 'product',
        value: contentData.value || 0,
        currency: contentData.currency || 'INR',
    });
};

export const trackLead = (leadData = {}) => {
    trackEvent('Lead', {
        content_name: leadData.name || '',
        content_category: leadData.category || 'booking',
        value: leadData.value || 0,
        currency: leadData.currency || 'INR',
    });
};

export const trackInitiateCheckout = (checkoutData = {}) => {
    trackEvent('InitiateCheckout', {
        content_name: checkoutData.name || '',
        content_category: checkoutData.category || '',
        num_items: checkoutData.numItems || 1,
        value: checkoutData.value || 0,
        currency: checkoutData.currency || 'INR',
    });
};

export const trackContact = (contactData = {}) => {
    trackEvent('Contact', {
        content_name: contactData.name || 'contact_form',
        content_category: contactData.category || 'inquiry',
    });
};

export const trackSearch = (searchData = {}) => {
    trackEvent('Search', {
        search_string: searchData.query || '',
        content_category: searchData.category || '',
    });
};

export const trackSchedule = (scheduleData = {}) => {
    trackEvent('Schedule', {
        content_name: scheduleData.name || 'booking',
        value: scheduleData.value || 0,
        currency: scheduleData.currency || 'INR',
    });
};

// Advanced matching for better attribution
export const setUserData = (userData = {}) => {
    if (!window.fbq) {
        console.warn('Meta Pixel not initialized');
        return;
    }

    const advancedMatching = {};

    if (userData.email) advancedMatching.em = userData.email;
    if (userData.phone) advancedMatching.ph = userData.phone;
    if (userData.firstName) advancedMatching.fn = userData.firstName;
    if (userData.lastName) advancedMatching.ln = userData.lastName;
    if (userData.city) advancedMatching.ct = userData.city;
    if (userData.state) advancedMatching.st = userData.state;
    if (userData.zip) advancedMatching.zp = userData.zip;
    if (userData.country) advancedMatching.country = userData.country;

    window.fbq('init', import.meta.env.VITE_META_PIXEL_ID, advancedMatching);
    console.log('Meta Pixel user data set');
};

export default {
    initMetaPixel,
    trackEvent,
    trackCustomEvent,
    trackPageView,
    trackViewContent,
    trackLead,
    trackInitiateCheckout,
    trackContact,
    trackSearch,
    trackSchedule,
    setUserData,
};
