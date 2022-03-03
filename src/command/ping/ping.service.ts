import { logger, LogLevels } from '../../util/logger.ts';

import { InteractionResponseTypes } from '../../../depends.ts';
import { humanizeMilliseconds, snowflakeToTimestamp } from '../../util/helpers.ts';

export class pingService
{
    public log: { warn: (...args: any[]) => void; debug: (...args: any[]) => void; log: (level: LogLevels, ...args: any[]) => (void | undefined); error: (...args: any[]) => void; info: (...args: any[]) => void; fatal: (...args: any[]) => void };

    private static data: { content: string };
    private static log: { warn: (...args: any[]) => void; debug: (...args: any[]) => void; log: (level: LogLevels, ...args: any[]) => (undefined | void); error: (...args: any[]) => void; info: (...args: any[]) => void; fatal: (...args: any[]) => void };

    constructor()
    {
        this.log = logger({ name: 'Command: Ping' });
    }
    
    static async structure(interaction: { id: any; token?: any; })
    {
        const ping = Date.now() - snowflakeToTimestamp(interaction.id);

        this.data =
            {
                content: `🏓 Pong! Ping ${ping}ms (${humanizeMilliseconds(ping)})`,
            };
    }

    static async send(bot: any, interaction: any)
    {
        try
        {
            await this.structure(interaction);

            await bot.helpers.sendInteractionResponse(
                interaction.id,
                interaction.token,
                {
                    type: InteractionResponseTypes.ChannelMessageWithSource,
                    data: this.data
                }
            );
        }
        catch (Error)
        {
            this.log.fatal(Error);
        }
    }
}
