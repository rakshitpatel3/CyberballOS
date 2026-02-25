// Peter Eberhard FEB 2026 (peter.eberhard26@gmail.com)

import { Aurelia } from 'aurelia-framework';
import environment from './environment';


export function configure(aurelia: Aurelia) {

  aurelia.use
    .standardConfiguration()
    .feature('resources');

  aurelia.use.developmentLogging(environment.debug ? 'debug' : 'warn');

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

  console.log('main.ts loaded... heartbeat check');

  // Start Aurelia and retry mounting if setRoot fails
  aurelia.start()
    .then(() => {
      let attempts = 0;
      const MAX_ATTEMPTS = 3;

      function trySetRoot() {
        attempts++;
        aurelia.setRoot()
          .then(() => {
            console.log('Aurelia mounted successfully'); 
          })
          .catch(err => {
            console.log(`setRoot failed (attempt ${attempts})`, err);

            if (attempts < MAX_ATTEMPTS) {
              setTimeout(trySetRoot, 300);
            } else {
              console.log('setRoot failed after retries');
            }
          });
      }

      trySetRoot();
    })
    .catch(err => {
      console.log('Aurelia start failed:', err);
    });
}
