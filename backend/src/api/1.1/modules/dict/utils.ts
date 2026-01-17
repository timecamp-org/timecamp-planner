import Table from "../db/Table";
import { DictionaryTypes } from "./types";
import { dbNamingConverter } from '../../../../config/db.config.static'

export const convertDictionaryTypeToTable = (dictionaryType: DictionaryTypes): keyof Table=>{
    const prefix = 'dict'
    const suffix = dbNamingConverter.convertIdentifier(dictionaryType)
    const result = prefix.concat(suffix).toUpperCase()

    return result as keyof Table

}