import { ItemLicitacao } from "@prisma/client";
import prisma from "lib/prisma";
import { js2xml } from "xml-js";
import fs from 'fs';
import path from 'path';

export default class ItemLicitacaoModel {
  name: string = "Item da licitação";
  items: [ItemLicitacao] | null = null;
  document = null;
  defaultDirectory: string | null = null;
  properties = {
    "NumeroLicitacao":null,
    "NumeroContratacao":null,
    "NumeroItem":null,
    "Descricao":null,
    "UnidadeMedida":null,
    "Quantidade":null,
    "ValorUnitarioEstimado":null
  }

  constructor (items: [ItemLicitacao], codigo: string, exercicio: string, mes: string, defaultDirectory: string) {
    this.items = items;
    console.log(codigo, exercicio, mes)
    this.defaultDirectory = defaultDirectory;
    this.document = {
      "_declaration": {
        "_attributes":{
          "version":"1.0",
          "encoding": "utf-8"
        }
      },
      SIAP: {
        "_attributes": {
          "Codigo": `${codigo}`,
          "Exercicio": `${exercicio}`,
          "Mes": `${mes}`,
        },
        ItemLicitacao: []
      }
    };
  }



  dateFormat(date:Date): string{
    if (!date) return ""
    return date.toISOString().substring(0,10) //`${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`
  }

  private format() {
    this.document.SIAP.ItemLicitacao = this.items?.map( item => {
      return {
          "NumeroLicitacao":item.numero_licitacaoId,
          "NumeroContratacao":item.numero_contratacaoId,
          "NumeroItem":item.numero_item,
          "Descricao":item.descricao,
          "UnidadeMedida":item.unidade_medida,
          "Quantidade":item.quantidade.toString(),
          "ValorUnitarioEstimado":item.valor_unitario_estimado?.toString(),
        }
   })
  }

  createXml() {
    this.format()
    const result = js2xml(this.document, {compact: true, spaces: 4, fullTagEmptyElement: true})
    const filePath = path.join(this.defaultDirectory as string, 'ItemLicitacao.xml')

    fs.writeFile(filePath, result, (err) => {
      if (err) {
        console.error('Error writing to the file:', err);
        return null;
      } else {
        console.log('Data has been written to the file successfully.');
        return filePath;
      }
    });
  }
}