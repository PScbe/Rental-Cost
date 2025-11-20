import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import * as metaPixel from '../utils/metaPixel';
import * as metaConversions from '../utils/metaConversions';

/**
 * Custom hook for Meta tracking
 * Provides easy-to-use functions for tracking events
 */
export const useMetaTracking = () => {
    const location = useLocation();

    // Track page views on route change
    useEffect(() => {
        const pixelId = import.meta.env.VITE_META_PIXEL_ID;

        if (pixelId) {
            // Track with Pixel
            metaPixel.trackPageView();

            // Track with Conversions API (server-side)
            metaConversions.trackServerPageView();
        }
    }, [location.pathname]);

    // Track standard events (both Pixel and Conversions API)
    const trackLead = useCallback(async (leadData = {}, userData = {}) => {
        metaPixel.trackLead(leadData);
        await metaConversions.trackServerLead(leadData, userData);
    }, []);

    const trackInitiateCheckout = useCallback(async (checkoutData = {}, userData = {}) => {
        metaPixel.trackInitiateCheckout(checkoutData);
        await metaConversions.trackServerInitiateCheckout(checkoutData, userData);
    }, []);

    const trackContact = useCallback(async (contactData = {}, userData = {}) => {
        metaPixel.trackContact(contactData);
        await metaConversions.trackServerContact(contactData, userData);
    }, []);

    const trackSchedule = useCallback(async (scheduleData = {}, userData = {}) => {
        metaPixel.trackSchedule(scheduleData);
        await metaConversions.trackServerSchedule(scheduleData, userData);
    }, []);

    const trackViewContent = useCallback((contentData = {}) => {
        metaPixel.trackViewContent(contentData);
    }, []);

    const trackSearch = useCallback((searchData = {}) => {
        metaPixel.trackSearch(searchData);
    }, []);

    const trackCustomEvent = useCallback((eventName, parameters = {}) => {
        metaPixel.trackCustomEvent(eventName, parameters);
    }, []);

    return {
        trackLead,
        trackInitiateCheckout,
        trackContact,
        trackSchedule,
        trackViewContent,
        trackSearch,
        trackCustomEvent,
    };
};

export default useMetaTracking;
