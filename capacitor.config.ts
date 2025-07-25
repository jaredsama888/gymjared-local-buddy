import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.6407f39c70e04c3b84dced9eb686aaa3',
  appName: 'GymJared',
  webDir: 'dist',
  server: {
    url: 'https://6407f39c-70e0-4c3b-84dc-ed9eb686aaa3.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    allowMixedContent: true
  }
};

export default config;