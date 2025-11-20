/**
 * Meta Conversions API Integration
 * Server-side event tracking for better attribution and iOS 14+ compatibility
 */

const META_API_VERSION = 'v21.0';
const META_GRAPH_API_URL = `https://graph.facebook.com/${META_API_VERSION}`;

/**
 * Send conversion event to Meta Conversions API
 * @param {Object} eventData - Event data to send
 * @returns {Promise} API response
 */
export const sendConversionEvent = async (eventData) => {
    const accessToken = import.meta.env.VITE_META_ACCESS_TOKEN;
    const pixelId = import.meta.env.VITE_META_PIXEL_ID;
    const testEventCode = import.meta.env.VITE_META_TEST_EVENT_CODE;

    if (!accessToken) {
        console.error('Meta access token not configured');
        return null;
    }

    if (!pixelId) {
        console.error('Meta Pixel ID not configured');
        return null;
    }

    try {
        const url = `${META_GRAPH_API_URL}/${pixelId}/events`;

        const payload = {
            data: [
                {
                    event_name: eventData.eventName,
                    event_time: Math.floor(Date.now() / 1000),
                    event_source_url: window.location.href,
                    action_source: 'website',
                    user_data: {
                        client_ip_address: eventData.clientIp || '',
                        client_user_agent: navigator.userAgent,
                        fbc: getCookie('_fbc') || '',
                        fbp: getCookie('_fbp') || '',
                        ...(eventData.userData || {}),
                    },
                    custom_data: eventData.customData || {},
                    event_id: eventData.eventId || generateEventId(),
                },
            ],
            access_token: accessToken,
        };

        // Add test event code if in test mode
        if (testEventCode) {
            payload.test_event_code = testEventCode;
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok) {
            console.error('Meta Conversions API error:', result);
            return null;
        }

        console.log('Meta Conversions API event sent:', eventData.eventName, result);
        return result;
    } catch (error) {
        console.error('Error sending conversion event:', error);
        return null;
    }
};

/**
 * Track PageView event
 */
export const trackServerPageView = async (userData = {}) => {
    return sendConversionEvent({
        eventName: 'PageView',
        userData,
        customData: {
            page_title: document.title,
            page_url: window.location.href,
        },
    });
};

/**
 * Track Lead event
 */
export const trackServerLead = async (leadData = {}, userData = {}) => {
    return sendConversionEvent({
        eventName: 'Lead',
        userData,
        customData: {
            content_name: leadData.name || '',
            content_category: leadData.category || 'booking',
            value: leadData.value || 0,
            currency: leadData.currency || 'INR',
        },
    });
};

/**
 * Track InitiateCheckout event
 */
export const trackServerInitiateCheckout = async (checkoutData = {}, userData = {}) => {
    return sendConversionEvent({
        eventName: 'InitiateCheckout',
        userData,
        customData: {
            content_name: checkoutData.name || '',
            content_category: checkoutData.category || '',
            num_items: checkoutData.numItems || 1,
            value: checkoutData.value || 0,
            currency: checkoutData.currency || 'INR',
        },
    });
};

/**
 * Track Contact event
 */
export const trackServerContact = async (contactData = {}, userData = {}) => {
    return sendConversionEvent({
        eventName: 'Contact',
        userData,
        customData: {
            content_name: contactData.name || 'contact_form',
            content_category: contactData.category || 'inquiry',
        },
    });
};

/**
 * Track Schedule event
 */
export const trackServerSchedule = async (scheduleData = {}, userData = {}) => {
    return sendConversionEvent({
        eventName: 'Schedule',
        userData,
        customData: {
            content_name: scheduleData.name || 'booking',
            value: scheduleData.value || 0,
            currency: scheduleData.currency || 'INR',
        },
    });
};

// Helper functions

/**
 * Get cookie value by name
 */
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return '';
}

/**
 * Generate unique event ID for deduplication
 */
function generateEventId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Hash user data for privacy (optional, for PII)
 * Note: Meta recommends sending hashed data for email, phone, etc.
 */
export const hashUserData = async (data) => {
    if (!data) return '';

    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data.toLowerCase().trim());
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return hashHex;
};

export default {
    sendConversionEvent,
    trackServerPageView,
    trackServerLead,
    trackServerInitiateCheckout,
    trackServerContact,
    trackServerSchedule,
    hashUserData,
};
