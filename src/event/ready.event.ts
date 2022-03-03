import { events } from './mod.ts';
import { logger } from '../util/logger.ts';

const log = logger({ name: 'Event: Ready' });

events.ready = () =>
{
  log.info('Deno.js Bot Ready');
};
