import { Component, Input, OnInit } from '@angular/core';
import { FormControl, AbstractControl, FormGroup, FormBuilder } from '@angular/forms';
import { MapSettings } from '@app/shared/game';

@Component({
  selector: 'app-hero-settings',
  templateUrl: './hero-settings.component.html',
  styleUrls: ['./hero-settings.component.css']
})
export class HeroSettingsComponent implements OnInit {
  @Input() settings: MapSettings;
  settingsForm: FormGroup;

  constructor(
    private fb: FormBuilder,
  ) {
    //this.createForm();
  }

  ngOnInit() {
  }


  rebuildForm() {
  }
  revert() { this.rebuildForm(); }

  addHero(hero: string) {
    this.updateHeroesCount(hero, 1);
  }
  removeHero(hero: string) {
    this.updateHeroesCount(hero, -1);
  }

  private updateHeroesCount(hero: string, change: number) {
    const heroesCountControl: AbstractControl = this.settingsForm.get('heroesCount');
    const heroesCount = heroesCountControl.get(hero).value + change;
    heroesCountControl.patchValue({
      [hero]: heroesCount,
    });
  }
}
