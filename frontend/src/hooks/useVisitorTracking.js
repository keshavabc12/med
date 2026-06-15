import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getDeviceType() {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return 'Tablet';
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return 'Mobile';
  return 'Desktop';
}

function getBrowser() {
  const ua = navigator.userAgent;
  if (ua.includes('Firefox/')) return 'Firefox';
  if (ua.includes('Seamonkey/')) return 'Seamonkey';
  if (ua.includes('Chrome/') && !ua.includes('Chromium/') && !ua.includes('Edg/')) return 'Chrome';
  if (ua.includes('Safari/') && !ua.includes('Chrome/') && !ua.includes('Chromium/')) return 'Safari';
  if (ua.includes('OPR/') || ua.includes('Opera/')) return 'Opera';
  if (ua.includes('Edg/')) return 'Edge';
  if (ua.includes('MSIE') || ua.includes('Trident/')) return 'IE';
  return 'Unknown';
}

export default function useVisitorTracking() {
  const location = useLocation();

  useEffect(() => {
    // Skip tracking for admin pages to avoid skewing analytics with staff visits
    if (location.pathname.startsWith('/admin')) {
      return;
    }

    // Get or create session ID for deduplication (cleared when browser closes)
    let sessionId = sessionStorage.getItem('pharma_session_id');
    if (!sessionId) {
      sessionId = generateUUID();
      sessionStorage.setItem('pharma_session_id', sessionId);
    }

    const deviceType = getDeviceType();
    const browser = getBrowser();

    const sendPing = async () => {
      try {
        await fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, deviceType, browser }),
        });
      } catch (e) {
        // Silently ignore ping failures
      }
    };

    // Send initial ping on page load/navigation
    sendPing();

    // Send heartbeat every 30 seconds to keep the "Live Visitors" metric accurate
    const interval = setInterval(sendPing, 30000);

    return () => clearInterval(interval);
  }, [location.pathname]); // Re-ping on navigation
}
