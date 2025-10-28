import { ref } from 'vue'

export enum WeatherCondition {
  Sunny = 'Sunny',
  PartlyCloudy = 'Partly Cloudy',
  Cloudy = 'Cloudy',
  Rain = 'Rain',
  Thunderstorm = 'Thunderstorm',
  Snow = 'Snow',
}

export const weatherCodeMap = new Map([
  [0, WeatherCondition.Sunny],
  [1, WeatherCondition.PartlyCloudy],
  [2, WeatherCondition.PartlyCloudy],
  [3, WeatherCondition.PartlyCloudy],
  [45, WeatherCondition.Cloudy],
  [48, WeatherCondition.Cloudy],
  [51, WeatherCondition.Rain],
  [53, WeatherCondition.Rain],
  [55, WeatherCondition.Rain],
  [56, WeatherCondition.Rain],
  [57, WeatherCondition.Rain],
  [61, WeatherCondition.Rain],
  [63, WeatherCondition.Rain],
  [65, WeatherCondition.Rain],
  [66, WeatherCondition.Rain],
  [67, WeatherCondition.Rain],
  [71, WeatherCondition.Snow],
  [73, WeatherCondition.Snow],
  [75, WeatherCondition.Snow],
  [77, WeatherCondition.Snow],
  [80, WeatherCondition.Rain],
  [81, WeatherCondition.Rain],
  [82, WeatherCondition.Rain],
  [85, WeatherCondition.Snow],
  [86, WeatherCondition.Snow],
  [95, WeatherCondition.Thunderstorm],
  [96, WeatherCondition.Thunderstorm],
  [99, WeatherCondition.Thunderstorm]
]);

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
    highlightColor: 0xC080FF,
    midtoneColor: 0x6A2FB0,
    lowlightColor: 0x2A0D4B,
    baseColor: 0x3F1E6D,
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
