import { events } from './src/event/mod.ts';
import { logger } from './src/util/logger.ts';
import { BOT_ID, BOT_TOKEN } from './configs.ts';
import { updateCommands } from './src/util/helpers.ts';
import { ActivityTypes, createBot, enableCachePlugin, enableCacheSweepers, fastFileLoader, startBot } from './depends.ts';

const log = logger({ name: 'Main' });

log.info('Starting Bot, this might take a while...');

const paths = ['./src/event', './src/command'];

await fastFileLoader(paths).catch((Error: any) =>
{
    log.fatal(`Unable to Import ${paths}`);
    log.fatal(Error);

    Deno.exit(1);
});

export const bot = enableCachePlugin(
    createBot(
        {
            token: BOT_TOKEN,
            botId: BOT_ID,
            intents: [],
            events,
        }),
);

enableCacheSweepers(bot);

bot.gateway.presence =
    {
        status: 'online',
        activities: [
            {
                name: 'Deno.js is Nice !',
                type: ActivityTypes.Game,
                createdAt: Date.now(),
            },
        ],
    };

await startBot(bot);

await updateCommands(bot);
