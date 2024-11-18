import React from 'react';

import { Router } from './Router.jsx';
import { initShared } from './shared/browser/initShared.js';
import { Scrollbar } from './shared/browser/Scrollbar.jsx';
import { Toast } from './shared/browser/Toast.jsx';
import { apps } from './shared/js/apps.js';
import { AppWrapper } from './shared/semi/AppWrapper.jsx';

initShared({
  logo: '/icons/icon-192.png',
  app: apps.moon.name,
  privacyUrl: 'https://easyy.click/privacy',
  termsUrl: 'https://easyy.click/terms',
  resetPassword: false,
});

function App() {
  return (
    <AppWrapper>
      <Router />

      <Toast />

      {/* thumbColor: --semi-brand-2, trackColor: --semi-brand-0 */}
      <Scrollbar thumbColor="#e6ae6c" trackColor="#fbf4ea" />
    </AppWrapper>
  );
}

export default App;
