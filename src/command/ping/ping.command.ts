import { createCommand } from '../mod.ts';
import { pingService } from './ping.service.ts';
import { ApplicationCommandTypes } from '../../../depends.ts';

createCommand(
    {
            name: 'ping',
            description: 'ping the Bot!',
            type: ApplicationCommandTypes.ChatInput,
            scope: 'Global',

            execute: async (bot, interaction) =>
            {
                await pingService.send(bot, interaction);
            }
    });
