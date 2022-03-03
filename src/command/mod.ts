import { ApplicationCommandOption, ApplicationCommandTypes, Bot, Collection, DiscordenoInteraction } from '../../depends.ts';

export type subCommand = Omit<Command, 'subcommands'>;

export type subCommandGroup =
    {
        name: string;
        subCommands: subCommand[];
    }

export interface Command
{
    name: string;
    description: string;
    usage?: string[];
    options?: ApplicationCommandOption[];
    type: ApplicationCommandTypes;
    scope?: 'Global' | 'Guild';
    execute: (bot: Bot, interaction: DiscordenoInteraction) => unknown;
    subcommands?: Array<subCommandGroup | subCommand>;
}

export const commands = new Collection<string, Command>();

export function createCommand(command: Command)
{
    commands.set(command.name, command);
}
