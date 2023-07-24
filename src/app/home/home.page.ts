import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { ScreenOrientation, ScreenOrientationResult } from '@capacitor/screen-orientation';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class HomePage implements OnInit, OnDestroy {

  darkMode = false;
  orientation: any;
  isPortrait = true;
  allRestaurants = [
    {
      id: '1',
      cover: 'assets/dishes/6.jpeg',
      name: 'Burger Singha',
      cuisines: [
        'Indian',
        'Italian',
        'Mexican'
      ],
      rating: 5,
      delivery_time: 25,
      distance: 2.5,
      price: 100,
      latitude: 0,
      longitude: 0
    },
    {
      id: '2',
      cover: 'assets/dishes/5.jpeg',
      name: 'Pizza Place',
      cuisines: [
        'Italian',
        'Mexican',
        'Chinese'
      ],
      rating: 5,
      delivery_time: 25,
      distance: 2.5,
      price: 100
    },
    {
      id: '3',
      cover: 'assets/dishes/4.jpeg',
      name: 'Indian Kitchen',
      cuisines: [
        'Indian',
        'Chinese'
      ],
      rating: 5,
      delivery_time: 25,
      distance: 2.5,
      price: 100
    },
  ];
  lock = false;

  constructor() {}

  ngOnInit(): void {
    this.checkAppMode();
    this.checkOrientation();
  }

  async checkAppMode() {
    // const checkIsDarkMode = localStorage.getItem('darkModeActivated');
    const checkIsDarkMode = await Preferences.get({key: 'darkModeActivated'});
    console.log(checkIsDarkMode);
    checkIsDarkMode?.value == 'true'
      ? (this.darkMode = true)
      : (this.darkMode = false);
    document.body.classList.toggle('dark', this.darkMode);
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    document.body.classList.toggle('dark', this.darkMode);
    if(this.darkMode) {
      Preferences.set({key: 'darkModeActivated', value: 'true'}); 
    } else {
      // localStorage.setItem('darkModeActivated', 'false');
      Preferences.set({key: 'darkModeActivated', value: 'false'});
    }
  }

  async checkOrientation() {
    ScreenOrientation.addListener(
      'screenOrientationChange', 
      (orientation: ScreenOrientationResult) => {
        if(orientation) this.checkPortrait(orientation);
      }
    );
    const orientation = await ScreenOrientation.orientation();
    if(orientation) this.checkPortrait(orientation);
  }

  checkPortrait(orientation: ScreenOrientationResult) {
    console.log(orientation);
    this.orientation = orientation;
    const pattern = /portrait/;
    if(this.orientation?.type.match(pattern)) {
      this.isPortrait = true;
    } else {
      this.isPortrait = false;
    }
    console.log(this.isPortrait);
  }

  async lockOrientation(orientationType?: OrientationType) {
    await ScreenOrientation.lock({
      orientation: orientationType || 'portrait'
    });
  }

  async unlockOrientation() {
    await ScreenOrientation.unlock();
  }

  toggleLock() {
    this.lock = !this.lock;
    if(this.lock) {
      console
      this.lockOrientation(this.orientation?.type);
    }
    else this.unlockOrientation();
    this.checkPortrait(this.orientation);
  }

  getCuisines(data: any) {
    return data.join(', ');
  }

  ngOnDestroy(): void {
    ScreenOrientation.removeAllListeners();
  }
}
