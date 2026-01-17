import { AnyDict } from '../../common/types'


export interface CSVExporterInterface {
  createLinkedCell(title: string, url: string): string;
  formatMultipleValuesCell(sourceData: any[], propName?: string): string;
  render(source: AnyDict[], options: AnyDict): string;
}
