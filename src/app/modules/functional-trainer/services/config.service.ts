import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { KeyService } from 'src/app/shared/services/key/key.service';


@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  octaveConfig: {low: number, high: number} = { low: 2, high: 6};
  possibleNotesConfig: number[] = _.range(this.keySrv.selectedNoteList().length)
  scaleConfig: number[] = [0, 2, 4, 5, 7, 9, 11];

  constructor(private keySrv: KeyService) { }

  setOctaves(low: number, high: number) {
    this.octaveConfig = {low: low, high: high};
  }
}
