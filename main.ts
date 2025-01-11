import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { appcomponent} from './app/app.component';

bootstrapApplication(appcomponent, appConfig)
  .catch((err) => console.error(err));
