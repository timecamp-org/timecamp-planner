import { injectable } from 'inversify';

export interface ColorGeneratorInterface {
  generate(): string
}

@injectable()
export class ColorGenerator implements ColorGeneratorInterface {

  colors: string[]

  constructor(colors: string[]) {
    this.colors = colors
  }

  generate(): string {
    const colorsLength = this.colors.length
    let index = Math.floor(Math.random() * colorsLength)
    return this.colors[index]
  }

}
