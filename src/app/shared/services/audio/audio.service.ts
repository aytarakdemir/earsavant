import { Injectable, WritableSignal, signal } from '@angular/core';
import * as Tone from 'tone';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  constructor() {}

  private chordProgressionActive: WritableSignal<boolean> = signal(false);
  private melodyActive: WritableSignal<boolean> = signal(false);
  private sampler!: Tone.Sampler;

  public start() {
    Tone.start();
    Tone.Destination.volume.value = -10


    this.sampler = new Tone.Sampler({
      urls: {
        "C4": "C4.mp3",
        "D#4": "Ds4.mp3",
        "F#4": "Fs4.mp3",
        "A4": "A4.mp3",
      },
      release: 1,
      baseUrl: "https://tonejs.github.io/audio/salamander/",
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

  public playNote(
    note: string,
    lag: number = 0,
    sustainTime: number = 0.3
  ): void {
    if (Tone.context.state !== 'suspended') {
      
      Tone.loaded().then(() => {
        const now = Tone.now();
        this.sampler.triggerAttack(note, now + lag);
        this.sampler.triggerRelease(note, now + lag + sustainTime);
      
      })
    }
  }

  public playMelody(
    notes: string[],
    spaceTime: number = 0.3,
    sustainTime: number = 0.3
  ) {
    if (!this.melodyActive()) {
      this.setMelodyActive();
      notes.forEach((note, index) => {
        this.playNote(note, index * spaceTime, sustainTime);
      });
      setTimeout(() => {
        this.setMelodyPassive();
      }, (notes.length - 1) * spaceTime);
    }
  }

  public playChord(
    notes: string[],
    lag: number = 0,
    sustainTime: number = 0.5
  ): void {
    notes.forEach((note: string) => {
      this.playNote(note, lag, sustainTime);
    });
  }

  public playProgression(
    chords: string[][],
    spaceTime: number = 0.3,
    sustainTime: number = 0.3
  ) {
    if (!this.chordProgressionActive()) {
      this.setProgressionActive();
      chords.forEach((chord, index) => {
        this.playChord(chord, index * spaceTime, sustainTime);
      }, (chords.length - 1) * spaceTime + sustainTime);
      setTimeout(() => {
        this.setProgressionPassive();
      }, (chords.length - 1) * spaceTime + sustainTime * 5000);
    }
  }



}
