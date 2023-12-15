import { ContratacaoDireta } from "@prisma/client";
import prisma from "lib/prisma";
import { js2xml } from "xml-js";
import fs from 'fs';
import path from 'path';

export default class ContratacaoModel {
  name: string = "Contratação";
  contratacoes: [ContratacaoDireta] | null = null;
  document = null;
  defaultDirectory: string | null = null;
  properties = {
    "NumeroContratacao":null,
    "CNPJ":null,
    "NumeroProcesso":null,
    "Enquadramento":null,
    "ReferenciaLegal":null,
    "NaturezaObjeto":null,
    "Objeto":null,
    "ValorPrevisto":null,
    "CodigoPrograma":null,
    "OrcamentoProprio":null,
    "VeiculoPublicacao":null,
    "DataPublicacao":null,
    "DataPublicacaoEdital":null,
    "DocumentoJuridico":null,
  }

  constructor (contratacoes: [ContratacaoDireta], codigo: string, exercicio: string, mes: string, defaultDirectory: string) {
    this.contratacoes = contratacoes;
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
        ContratacaoDireta: []
      }
    };
  }



  dateFormat(date:Date): string{
    if (!date) return ""
    return date.toISOString().substring(0,10) //`${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`
  }

  private format() {
    this.document.SIAP.ContratacaoDireta = this.contratacoes?.map( contratacao => {
      return {
        
          "NumeroContratacao":contratacao.numero_contratacao,
          "CNPJ":contratacao.cnpj.replaceAll(".","").replace("/","").replace("-",""),
          "NumeroProcesso":contratacao.numero_processo,
          "Enquadramento":contratacao.enquadramentoId,
          "ReferenciaLegal":contratacao.referencia_legalId,
          "NaturezaObjeto":contratacao.natureza_objetoId,
          "Objeto":contratacao.objeto,
          "ValorPrevisto":contratacao.valor_previsto.toString(),
          "CodigoPrograma":contratacao.codigo_programa,
          "OrcamentoProprio":contratacao.orcamento_proprio ? 1 : 2,
          "VeiculoPublicacao":contratacao.veiculo_publicacaoId,
          "DataPublicacao":this.dateFormat(contratacao.data_publicacao as Date),
          "DataPublicacaoEdital":this.dateFormat(contratacao.data_publicacao_edital as Date),
          "DocumentoJuridico":contratacao.documento_juridico.toString(),
        }
   })
  }

  createXml() {
    this.format()
    const result = js2xml(this.document, {compact: true, spaces: 4, fullTagEmptyElement: true})
    const filePath = path.join(this.defaultDirectory as string, 'ContratacaoDireta.xml')

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