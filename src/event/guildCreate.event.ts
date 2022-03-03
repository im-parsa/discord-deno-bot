import { events } from './mod.ts';
import { updateGuildCommands } from '../util/helpers.ts';

events.guildCreate = async (bot: any, guild: any) => await updateGuildCommands(bot, guild);
