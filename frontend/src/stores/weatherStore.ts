import { ref } from 'vue'

export enum WeatherCondition {
  Sunny = 'Sunny',
  PartlyCloudy = 'Partly Cloudy',
  Cloudy = 'Cloudy',
  Rain = 'Rain',
  Thunderstorm = 'Thunderstorm',
  Snow = 'Snow',
}

export const weatherColorPalettes = {
  [WeatherCondition.Sunny]: {
    highlightColor: 0x3786cd,
    midtoneColor: 0xffffff,
    lowlightColor: 0xdc9e77,
    baseColor: 0x3a7be1,
    blurFactor: 0.60,
    speed: 1,
    zoom: 1,
  },
  [WeatherCondition.PartlyCloudy]: {
    highlightColor: 0x3072ca,
    midtoneColor: 0x9e9eb9,
    lowlightColor: 0xf0f0f0,
    baseColor: 0xffffff,
    blurFactor: 0.60,
    speed: 1,
    zoom: 1,
  },
  [WeatherCondition.Cloudy]: {
    highlightColor: 0xe3e3e3,
    midtoneColor: 0x9eb9d6,
    lowlightColor: 0x6ec2e5,
    baseColor: 0xffffff,
    blurFactor: 0.60,
    speed: 1,
    zoom: 1,
  },
  [WeatherCondition.Rain]: {
    highlightColor: 0xd9d9d9,
    midtoneColor: 0xa1a8a9,
    lowlightColor: 0xbabfc0,
    baseColor: 0xa2a2a2,
    blurFactor: 0.60,
    speed: 1,
    zoom: 1,
  },
  [WeatherCondition.Thunderstorm]: {
    highlightColor: 0xC080FF, // bright neon lavender
    midtoneColor: 0x6A2FB0,   // deep, saturated purple
    lowlightColor: 0x2A0D4B,  // almost-black purple
    baseColor: 0x3F1E6D,      // dark bluish-purple base
    blurFactor: 0.60,
    speed: 1,
    zoom: 1,
  },
  [WeatherCondition.Snow]: {
    highlightColor: 0xffffff,
    midtoneColor: 0x49a0f2,
    lowlightColor: 0xffffff,
    baseColor: 0xffffff,
    blurFactor: 0.50,
    speed: 2.20,
    zoom: 0.50,
  }
}

export const current_weather_condition = ref<WeatherCondition>(WeatherCondition.Snow);
