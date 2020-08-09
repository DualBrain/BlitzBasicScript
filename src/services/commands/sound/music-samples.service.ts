import { DebugEnvironment } from '../../../environment/debug.environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BbScriptChannel } from 'bbscript/src/classes/in-game/sound/channel';
import { BB_SCRIPT_CD_TRACK_MODE } from 'bbscript/src/enums/in-game/sound/cd-track-mode';
import { BbScriptSound } from 'bbscript/src/classes/in-game/sound/sound';
import { rejects } from 'assert';

@Injectable()
export class CommandsSoundMusicSamplesService {
  constructor(private http: HttpClient, private environment: DebugEnvironment) {}

  async playCDTrack(track: number, mode?: BB_SCRIPT_CD_TRACK_MODE): Promise<BbScriptChannel> {
    return null;
  }

  //TODO Midi will not be natively supported, use MIDI.js or similar library
  async playMusic(filePath: string, mode?: number): Promise<BbScriptSound> {
    return this.loadSound(filePath).then((sound: BbScriptSound) => {
      if (mode !== undefined) {
        switch (mode) {
          case 0:
            //play one time
            break;
          case 1:
            //play loop
            break;
          case 3:
          //set loop without playing
        }
      } else {
        return sound;
      }
    });
  }

  async freeSound(sound: BbScriptSound): Promise<void> {
    sound = null;
  }

  async loadSound(filePath: string): Promise<BbScriptSound> {
    return new Promise((resolve: Function, reject: Function) => {
      // info: the responseType conversion to JSON is a workaround, see https://github.com/angular/angular/issues/18586
      this.http
        .get<ArrayBuffer>(`${this.environment.getServer()}${filePath}`, {
          responseType: 'arraybuffer' as 'json'
        })
        .toPromise()
        .then((soundAsBlob: ArrayBuffer) => {
          let audioCtx: AudioContext = new AudioContext();
          let bufferSourceNode: AudioBufferSourceNode = audioCtx.createBufferSource();
          let volumeGain: GainNode = audioCtx.createGain();
          let pannerNode: StereoPannerNode = audioCtx.createStereoPanner();

          audioCtx.decodeAudioData(soundAsBlob).then(
            (buffer: AudioBuffer) => {
              // TODO: test if this also works if the state is not initialized with "suspend"
              audioCtx.resume().then(() => {
                bufferSourceNode.buffer = buffer;

                volumeGain.gain.value = 1;
                volumeGain.connect(audioCtx.destination);

                pannerNode.pan.value = 0;
                pannerNode.connect(volumeGain);

                bufferSourceNode.connect(pannerNode);

                resolve(new BbScriptSound(audioCtx, bufferSourceNode, volumeGain, pannerNode));
              });
            },
            e => {
              console.info('Error with decoding audio data' + e.err);
              resolve(null);
            }
          );
        });
    });
  }

  async loopSound(sound: BbScriptSound): Promise<void> {
    sound.source.loop = true;
  }

  async playSound(sound: BbScriptSound): Promise<void> {
    sound.source.start(0);
  }

  async soundPan(sound: BbScriptSound, pan: number): Promise<void> {
    sound.stereoPanner.pan.value = pan;
  }

  async soundPitch(sound: BbScriptSound, frequency: number): Promise<void> {
    //TODO check how many channels exist and copy all of them successively

    let newBufferNode = sound.context.createBufferSource();
    newBufferNode.buffer = sound.context.createBuffer(2, sound.source.buffer.length, frequency);
    let leftChannel = sound.source.buffer.getChannelData(0);
    let rightChannel = sound.source.buffer.getChannelData(1);
    newBufferNode.buffer.copyToChannel(leftChannel, 0);
    newBufferNode.buffer.copyToChannel(rightChannel, 1);

    sound.source = newBufferNode;
    sound.source.connect(sound.stereoPanner);
  }

  async soundVolume(sound: BbScriptSound, volume: number): Promise<void> {
    sound.volumeGain.gain.value = volume;
  }
}
