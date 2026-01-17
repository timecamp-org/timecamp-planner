import { CSVExporterInterface } from '../interfaces/CSVExporterInterface'
import { AnyDict } from '../../common/types'
import { parse } from 'json2csv'
import { injectable } from 'inversify'

@injectable()
export class CSVExporter implements CSVExporterInterface {

  public createLinkedCell(title: string, url: string): string {
    return `=HYPERLINK("${url}";"${title.replace(/"/g, '\'')}")`
  }

  public formatMultipleValuesCell(sourceData: any[], propName?: string): string {
    if (!sourceData) {
      return ''
    }
    return sourceData.reduce((acc, item, index, srcArray) => {
      const isLastItem = index === srcArray.length - 1
      const value = propName ? item[propName] : item
      return `${acc}${value}${!isLastItem ? `\n` : ''}`
    }, '')
  }

  render(source: AnyDict[], options: AnyDict): string {
    return parse(source, options)
  }
}