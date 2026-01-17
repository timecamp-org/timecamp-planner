//@ts-nocheck
import { theme } from '../../heySpace/theme/app-theme';

import * as Colors from './colors';

export default class ProjectColors {
  static prevProjectColorIndex = -1;

  static projectColors = [
    Colors.clearBlueColor,
    Colors.seafoamBlueColor,
    Colors.macaroniAndCheeseColor,
    Colors.lipstickColor,
    Colors.softPinkColor,
    Colors.darkPeachColor,
    Colors.lightBlueColor,
    Colors.cornFlowerColor,
    Colors.mediumPinkColor,
  ];

  static projectColorsNext = {
    [theme.color.decorative['honey-500']]: {
      100: theme.color.decorative['honey-100'],
      500: theme.color.decorative['honey-500'],
      800: theme.color.decorative['honey-800'],
    },
    [theme.color.decorative['emerald-500']]: {
      100: theme.color.decorative['emerald-100'],
      500: theme.color.decorative['emerald-500'],
      800: theme.color.decorative['emerald-800'],
    },
    [theme.color.decorative['cyan-500']]: {
      100: theme.color.decorative['cyan-100'],
      500: theme.color.decorative['cyan-500'],
      800: theme.color.decorative['cyan-800'],
    },
    [theme.color.decorative['sky-500']]: {
      100: theme.color.decorative['sky-100'],
      500: theme.color.decorative['sky-500'],
      800: theme.color.decorative['sky-800'],
    },
    [theme.color.decorative['midnight-500']]: {
      100: theme.color.decorative['midnight-100'],
      500: theme.color.decorative['midnight-500'],
      800: theme.color.decorative['midnight-800'],
    },
    [theme.color.decorative['violet-500']]: {
      100: theme.color.decorative['violet-100'],
      500: theme.color.decorative['violet-500'],
      800: theme.color.decorative['violet-800'],
    },
    [theme.color.decorative['fuchsia-500']]: {
      100: theme.color.decorative['fuchsia-100'],
      500: theme.color.decorative['fuchsia-500'],
      800: theme.color.decorative['fuchsia-800'],
    },
    [theme.color.decorative['wine-500']]: {
      100: theme.color.decorative['wine-100'],
      500: theme.color.decorative['wine-500'],
      800: theme.color.decorative['wine-800'],
    },
    [theme.color.decorative['peanut-500']]: {
      100: theme.color.decorative['peanut-100'],
      500: theme.color.decorative['peanut-500'],
      800: theme.color.decorative['peanut-800'],
    },
  };

  static projectColorsWithNames = [
    {
      color: Colors.clearBlueColor,
      name: 'Denim Blue',
    },
    {
      color: Colors.seafoamBlueColor,
      name: 'Turtle Green',
    },
    {
      color: Colors.macaroniAndCheeseColor,
      name: 'Mustard',
    },
    {
      color: Colors.lipstickColor,
      name: 'Scarlet',
    },
    {
      color: Colors.softPinkColor,
      name: 'Flamingo',
    },
    {
      color: Colors.darkPeachColor,
      name: 'Fern',
    },
    {
      color: Colors.lightBlueColor,
      name: 'Ice Blue',
    },
    {
      color: Colors.cornFlowerColor,
      name: 'Bluebonnet',
    },
    {
      color: Colors.mediumPinkColor,
      name: 'Lollipop Purple',
    },
    {
      color: theme.color.decorative['honey-500'],
      name: 'Honey',
    },
    {
      color: theme.color.decorative['emerald-500'],
      name: 'Emerald',
    },
    {
      color: theme.color.decorative['cyan-500'],
      name: 'Cyan',
    },
    {
      color: theme.color.decorative['sky-500'],
      name: 'Sky',
    },
    {
      color: theme.color.decorative['midnight-500'],
      name: 'Midnight',
    },
    {
      color: theme.color.decorative['violet-500'],
      name: 'Violet',
    },
    {
      color: theme.color.decorative['fuchsia-500'],
      name: 'Fuchsia',
    },
    {
      color: theme.color.decorative['wine-500'],
      name: 'Wine',
    },
    {
      color: theme.color.decorative['peanut-500'],
      name: 'Peanut',
    },
  ];

  static getProjectColors() {
    return Object.keys(this.projectColorsNext);
  }

  static getProjectColorsWithNames() {
    return this.projectColorsWithNames;
  }

  static getRandomProjectColor() {
    const colorsLength = this.getProjectColors().length;
    let index = Math.floor(Math.random() * colorsLength);

    if (index === this.prevProjectColorIndex) {
      if (index + 1 === colorsLength - 1) {
        index--;
      } else {
        index++;
      }
    }

    this.prevProjectColorIndex = index;

    return this.getProjectColors()[index];
  }

  static getContrastColors(projectColor) {
    return this.projectColorsNext?.[projectColor] || '';
  }
}
