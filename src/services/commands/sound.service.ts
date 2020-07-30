import { Injectable } from "@angular/core";
import { CommandsSound3DService } from "./sound/3d.service";
import { CommandsSoundChannelsService } from "./sound/channels.service";
import { CommandsSoundMusicSamplesService } from "./sound/music-samples.service";
import { GameSound } from "bbscript/src/interfaces/game/sound";
import { BbScriptEntity } from "bbscript/src/classes/in-game/3d/entities/entity";
import { BbScriptListener } from "bbscript/src/classes/in-game/sound/listener";
import { BbScriptSound } from "bbscript/src/classes/in-game/sound/sound";
import { BbScriptChannel } from "bbscript/src/classes/in-game/sound/channel";
import { BB_SCRIPT_CD_TRACK_MODE } from "bbscript/src/enums/in-game/sound/cd-track-mode";

@Injectable()
export class CommandsSoundService {
  constructor(
    private sound3dService: CommandsSound3DService,
    private channelService: CommandsSoundChannelsService,
    private musicSamplesService: CommandsSoundMusicSamplesService
  ) {}

  // 3D SOUND
  async createListener(
    parent: BbScriptEntity,
    rolloff?: number,
    doppler?: number,
    distance?: number
  ): Promise<BbScriptListener> {
    return this.sound3dService.createListener(
      parent,
      rolloff,
      doppler,
      distance
    );
  }

  async emitSound(
    sound: BbScriptSound,
    entity: BbScriptEntity
  ): Promise<BbScriptChannel> {
    return this.sound3dService.emitSound(sound, entity);
  }

  async load3DSound(filePath: string): Promise<BbScriptSound> {
    return this.sound3dService.load3DSound(filePath);
  }

  // CHANNELS
  async channelPan(channel: BbScriptChannel, balance: number): Promise<void> {
    return this.channelService.channelPan(channel, balance);
  }

  async channelPitch(
    channel: BbScriptChannel,
    frequency: number
  ): Promise<void> {
    return this.channelService.channelPitch(channel, frequency);
  }

  async channelPlaying(channel: BbScriptChannel): Promise<boolean> {
    return this.channelService.channelPlaying(channel);
  }

  async channelVolume(channel: BbScriptChannel, volume: number): Promise<void> {
    return this.channelService.channelVolume(channel, volume);
  }

  async pauseChannel(channel: BbScriptChannel): Promise<void> {
    return this.channelService.pauseChannel(channel);
  }

  async resumeChannel(channel: BbScriptChannel): Promise<void> {
    return this.channelService.resumeChannel(channel);
  }

  async stopChannel(channel: BbScriptChannel): Promise<void> {
    return this.channelService.stopChannel(channel);
  }

  // MUSIC SAMPLES
  async playCDTrack(
    track: number,
    mode?: BB_SCRIPT_CD_TRACK_MODE
  ): Promise<BbScriptChannel> {
    return this.musicSamplesService.playCDTrack(track, mode);
  }

  //TODO Midi will not be natively supported, use MIDI.js or similar library
  async playMusic(filePath: string, mode?: number): Promise<GameSound> {
    return this.musicSamplesService.playMusic(filePath, mode);
  }

  async freeSound(sound: GameSound): Promise<void> {
    return this.musicSamplesService.freeSound(sound);
  }

  async loadSound(filePath: string): Promise<GameSound> {
    return this.musicSamplesService.loadSound(filePath);
  }

  async loopSound(sound: GameSound): Promise<void> {
    return this.musicSamplesService.loopSound(sound);
  }

  async playSound(sound: GameSound): Promise<void> {
    return this.musicSamplesService.playSound(sound);
  }

  async soundPan(sound: GameSound, pan: number): Promise<void> {
    return this.musicSamplesService.soundPan(sound, pan);
  }

  async soundPitch(sound: GameSound, frequency: number): Promise<void> {
    return this.musicSamplesService.soundPitch(sound, frequency);
  }

  async soundVolume(sound: GameSound, volume: number): Promise<void> {
    return this.musicSamplesService.soundVolume(sound, volume);
  }
}
