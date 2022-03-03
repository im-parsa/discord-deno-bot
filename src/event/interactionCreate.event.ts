import { events } from './mod.ts';
import { logger } from '../util/logger.ts';
import { Command, commands } from '../command/mod.ts';
import { getGuildFromId, isSubCommand, isSubCommandGroup } from '../util/helpers.ts';
import { ApplicationCommandOptionTypes, bgBlack, bgYellow, black, BotWithCache, DiscordenoGuild, green, red, white, yellow } from '../../depends.ts';

const log = logger({ name: 'Event: InteractionCreate' });

events.interactionCreate = async (rawBot: any, interaction: any) =>
{
  const bot = rawBot as BotWithCache;

  if (interaction.data && interaction.id)
  {
    let guildName = 'Direct Message';
    let guild = {} as DiscordenoGuild;

    if (interaction.guildId)
    {
      const guildOrVoid = await getGuildFromId(bot, interaction.guildId).catch(
          (Error) =>
          {
            log.error(Error);
          }
      );
      if (guildOrVoid)
      {
        guild = guildOrVoid;
        guildName = guild.name;
      }
    }

    log.info(
        `[Command: ${bgYellow(black(String(interaction.data.name)))} - ${
            bgBlack(white(`Trigger`))
        }] by ${interaction.user.username}#${interaction.user.discriminator} in ${guildName}${
            guildName !== 'Direct Message' ? ` (${guild.id})` : ``
        }`,
    );

    let command: undefined | Command = interaction.data.name ? commands.get(interaction.data.name) : undefined;
    let commandName = command?.name;

    if (command !== undefined)
    {
      if (interaction.data.name)
      {
        if (interaction.data.options?.[0])
        {
          const optionType = interaction.data.options[0].type;

          if (optionType === ApplicationCommandOptionTypes.SubCommandGroup)
          {
            if (!command.subcommands)
            {
              return;
            }

            const subCommandGroup = command.subcommands?.find(
                (command) => command.name == interaction.data?.options?.[0].name
            );
            if (!subCommandGroup)
            {
              return;
            }

            if (isSubCommand(subCommandGroup))
            {
              return;
            }

            const targetCmdName = interaction.data.options?.[0].options?.[0].name || interaction.data.options?.[0].options?.[0].name;

            if (!targetCmdName)
            {
              return;
            }

            command = subCommandGroup.subCommands.find((c) => c.name === targetCmdName);

            commandName += ` ${subCommandGroup.name} ${command?.name}`;
          }

          if (optionType === ApplicationCommandOptionTypes.SubCommandGroup)
          {
            if (!command?.subcommands) return;

            const found = command.subcommands.find((command) => command.name == interaction.data?.options?.[0].name);
            if (!found)
            {
              return;
            }

            if (isSubCommandGroup(found)) return;

            command = found;
            commandName += ` ${command?.name}`;
          }
        }

        try
        {
          if (command)
          {
            command.execute(rawBot, interaction);
            log.info(
                `[Command: ${bgYellow(black(String(interaction.data.name)))} - ${
                    bgBlack(green(`Success`))
                }] by ${interaction.user.username}#${interaction.user.discriminator} in ${guildName}${
                    guildName !== 'Direct Message' ? ` (${guild.id})` : ``
                }`
            );
          }
          else
          {
            throw '';
          }
        }
        catch (err)
        {
          log.error(
              `[Command: ${bgYellow(black(String(interaction.data.name)))} - ${
                  bgBlack(red(`Error`))
              }] by ${interaction.user.username}#${interaction.user.discriminator} in ${guildName}${
                  guildName !== 'Direct Message' ? ` (${guild.id})` : ``
              }`
          );
          err.length ? log.error(err) : undefined;
        }
      }
      else
      {
        log.warn(
            `[Command: ${bgYellow(black(String(interaction.data.name)))} - ${
                bgBlack(yellow('Not Found'))
            }] by ${interaction.user.username}#${interaction.user.discriminator} in ${guildName}${
                guildName !== 'Direct Message' ? ` (${guild.id})` : ``
            }`
        );
      }
    }
  }
};
