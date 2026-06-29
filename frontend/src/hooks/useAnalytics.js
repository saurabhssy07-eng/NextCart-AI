import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * A production-ready analytics hook that currently logs to the console
 * but is structured to drop in Google Analytics, Mixpanel, or PostHog later.
 */
export const useAnalytics = () => {
  const trackEvent = (eventName, properties = {}) => {
    // In production, this would be:
    // mixpanel.track(eventName, properties);
    // or window.gtag('event', eventName, properties);
    if (import.meta.env.DEV) {
      console.log(`%c[Analytics] ${eventName}`, 'color: #3b82f6; font-weight: bold', properties);
    }
  };

  const identifyUser = (userId, traits = {}) => {
    // mixpanel.identify(userId);
    // mixpanel.people.set(traits);
    if (import.meta.env.DEV) {
      console.log(`%c[Analytics] User Identified: ${userId}`, 'color: #10b981; font-weight: bold', traits);
    }
  };

  return { trackEvent, identifyUser };
};

export const usePageTracking = () => {
  const location = useLocation();
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    trackEvent('Page Viewed', { path: location.pathname, search: location.search });
  }, [location.pathname, location.search]); // eslint-disable-line react-hooks/exhaustive-deps
};
