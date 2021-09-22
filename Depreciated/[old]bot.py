import logging
import os

import discord
from discord_slash import SlashCommand
from dotenv import load_dotenv

logger = logging.getLogger('discord')
logger.setLevel(logging.DEBUG)
handler = logging.FileHandler(
    filename='discord.log', encoding='utf-8', mode='w')
handler.setFormatter(logging.Formatter(
    '%(asctime)s:%(levelname)s:%(name)s: %(message)s'))
logger.addHandler(handler)


load_dotenv()
TOKEN = os.getenv('DISCORD_TOKEN')
GUILD = os.getenv('DISCORD_GUILD')

client = discord.Client()
slash = SlashCommand(client, sync_commands=True)


@client.event
async def on_ready():
    print(f'{client.user} has connected to Discord!')
    for guild in client.guilds:
        if guild.name == GUILD:
            break

    print(
        f'{client.user} is connected to the following guild:\n'
        f'{guild.name}(id: {guild.id})'
    )
    print("Slasher ready!")


@slash.slash(name="Ping", description="Shows Bot Latency")
async def ping(ctx):
    await ctx.send(f'Bot Speed - {round(client.latency * 1000)}ms ')

'''
@slash.slash(name="PingV2", description="Shows Bot Latency, in fancy way")
async def pingfancy(ctx):
    embed = discord.Embed(
        title=f"Ping",
        color=discord.Color.teal(),
        description=f"Bot Speed - {round(client.latency * 1000)}ms"
    )
    await ctx.send(embed=embed)
'''
client.run(TOKEN)
