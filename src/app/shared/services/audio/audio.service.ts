import { Injectable, WritableSignal, signal } from '@angular/core';
import * as Tone from 'tone';

/**
 * For playing sounds and feeding signals about the state of the process.
 */
@Injectable({
  providedIn: 'root',
})
export class AudioService {
  constructor() {}

  public chordProgressionActive: WritableSignal<boolean> = signal(false);
  public melodyActive: WritableSignal<boolean> = signal(false);
  private sampler!: Tone.Sampler;

  public samplerReady: WritableSignal<boolean> = signal(false);

  private instrument!: Tone.PolySynth;

  /**
   * Initializes the Tone.js library. This method should be called by an user input before any other methods of the AudioService is called.
   */
  public start() {
    if (Tone.Transport.state !== "started") {
      Tone.start();
    }
    Tone.Destination.volume.value = -5;

    this.sampler = new Tone.Sampler({
      urls: {
        "C6": "../../../assets/samples/C6.mp3",
        "D#6": "../../../assets/samples/Ds6.mp3",
        "F#6": "../../../assets/samples/Fs6.mp3",
        "A6": "../../../assets/samples/A6.mp3",
        "C5": "../../../assets/samples/C5.mp3",
        "D#5": "../../../assets/samples/Ds5.mp3",
        "F#5": "../../../assets/samples/Fs5.mp3",
        "A5": "../../../assets/samples/A5.mp3",
        "C4": "../../../assets/samples/C4.mp3",
        "D#4": "../../../assets/samples/Ds4.mp3",
        "F#4": "../../../assets/samples/Fs4.mp3",
        "A4": "../../../assets/samples/A4.mp3",
        "C3": "../../../assets/samples/C3.mp3",
        "D#3": "../../../assets/samples/Ds3.mp3",
        "F#3": "../../../assets/samples/Fs3.mp3",
        "A3": "../../../assets/samples/A3.mp3",
        "C2": "../../../assets/samples/C2.mp3",
        "D#2": "../../../assets/samples/Ds2.mp3",
        "F#2": "../../../assets/samples/Fs2.mp3",
        "A2": "../../../assets/samples/A2.mp3",
        "C1": "../../../assets/samples/C1.mp3",
        "D#1": "../../../assets/samples/Ds1.mp3",
        "F#1": "../../../assets/samples/Fs1.mp3",
        "A1": "../../../assets/samples/A1.mp3",
        "A0": "../../../assets/samples/A0.mp3",
      },
      release: 0.5,
      onload: () => {
        this.samplerReady.set(true);
      }
    }).toDestination();
  }

  private setProgressionActive() {
    this.chordProgressionActive.set(true);
  }

  private setProgressionPassive() {
    this.chordProgressionActive.set(false);
  }

  private setMelodyActive() {
    this.melodyActive.set(true);
  }

  private setMelodyPassive() {
    this.melodyActive.set(false);
  }

  /**
   * Plays the given note.
   * @param note Note and octave number.
   * @param lag Amount of time before the note begins to play. In seconds.
   * @param sustainTime Amount of time the note sustains for. In seconds.
   */
  public playNote(
    note: string,
    lag: number = 0,
    sustainTime: number = 0.3
  ): void {
    if (Tone.context.state !== 'suspended' || !this.samplerReady) {      
      Tone.loaded().then(() => {
        const now = Tone.context.currentTime;
        this.sampler.triggerAttackRelease(note, sustainTime, now + lag);
      })
    }
  }

  public playMelody(
    notes: string[],
    spaceTime: number = 0.3,
    sustainTime: number = 0.3
  ) {
    if (this.melodyActive() || !this.samplerReady) return;
    
    this.setMelodyActive();
    notes.forEach((note, index) => {
      this.playNote(note, index * spaceTime, sustainTime);
    });
    setTimeout(() => {
      this.setMelodyPassive();
    }, (notes.length - 1) * (spaceTime * 1000) + (sustainTime * 1000));
  }

  public playChord(
    notes: string[],
    lag: number = 0,
    sustainTime: number = 0.5
  ): void {
    if (Tone.context.state !== 'suspended' || !this.samplerReady) {      
      Tone.loaded().then(() => {
        const now = Tone.context.currentTime;
        this.sampler.triggerAttackRelease(notes, sustainTime, now + lag);
      })
    }
  }

  public playProgression(
    chords: string[][],
    spaceTime: number = 0.3,
    sustainTime: number = 0.3
  ) {
    if (this.chordProgressionActive() || !this.samplerReady) return;
    this.setProgressionActive();

    const part = new Tone.Part(((time, value) => {
      this.sampler.triggerAttackRelease(value.chord, sustainTime, time);
    }), chords.map(((chord, i)=>{return {chord: chord, time: i * spaceTime}}))).start(0);
    Tone.Transport.start();


    setTimeout(() => {
      part.stop()
      Tone.Transport.stop();
      this.setProgressionPassive();
    }, (chords.length - 1) * (spaceTime * 1000) + (sustainTime * 1000));
  }



}
