import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface AnalyticsEvent {
  event_type: string;
  properties?: Record<string, any>;
  page_url?: string;
}

export const useAnalytics = () => {
  const trackEvent = async (event: AnalyticsEvent) => {
    try {
      const sessionId = sessionStorage.getItem('session_id') || 
        Math.random().toString(36).substring(2, 15);
      
      if (!sessionStorage.getItem('session_id')) {
        sessionStorage.setItem('session_id', sessionId);
      }

      await supabase.from('analytics_events').insert({
        event_type: event.event_type,
        session_id: sessionId,
        properties: event.properties || {},
        page_url: event.page_url || window.location.href,
        user_agent: navigator.userAgent
      });
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  };

  const trackPageView = (page: string) => {
    trackEvent({
      event_type: 'page_view',
      properties: { page },
      page_url: window.location.href
    });
  };

  const trackSignup = (role: string) => {
    trackEvent({
      event_type: 'signup_started',
      properties: { role }
    });
  };

  const trackConversion = (type: string, value?: number) => {
    trackEvent({
      event_type: 'conversion',
      properties: { conversion_type: type, value }
    });
  };

  const trackEngagement = (action: string, target?: string) => {
    trackEvent({
      event_type: 'engagement',
      properties: { action, target }
    });
  };

  // Track initial page load
  useEffect(() => {
    trackPageView('app_load');
  }, []);

  return {
    trackEvent,
    trackPageView,
    trackSignup,
    trackConversion,
    trackEngagement
  };
};