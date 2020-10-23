import { main } from './main';
import * as serviceWorker from './service-worker';

main();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
serviceWorker.register();
