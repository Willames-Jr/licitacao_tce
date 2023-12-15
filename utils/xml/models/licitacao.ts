import { Licitacao } from "@prisma/client";
import prisma from "lib/prisma";
import { js2xml } from "xml-js";
import fs from 'fs';
import path from 'path';

export default class LicitacaoModel {
  name: string = "Licitação";
  licitacoes: [Licitacao] | null = null;
  document = null;
  defaultDirectory: string | null = null;
  properties = {
    "NumeroLicitacao":null,
    "CNPJ":null,
    "NumeroProcesso":null,
    "Modalidade":null,
    "CriterioTipoJulgamento":null,
    "NaturezaObjeto":null,
    "Agrupamento":null,
    "JustificativaGrupoLote":null,
    "RegistroPreco":null,
    "PossuiParticipantes":null,
    "Objeto":null,
    "RegimeExecucaoObra":null,
    "NaturezaObra":null,
    "ValorMaximo":null,
    "ValorPrevisto":null,
    "CodigoPrograma":null,
    "OrcamentoProprio":null,
    "VeiculoPublicacaoEdital":null,
    "DataPublicacaoEdital":null,
    "Garantia":null,
  }

  constructor (licitacoes: [Licitacao], codigo: string, exercicio: string, mes: string, defaultDirectory: string) {
    this.licitacoes = licitacoes;
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
        Licitacao: []
      }
    };
  }



  dateFormat(date:Date): string{
    if (!date) return ""
    return date.toISOString().substring(0,10) //`${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`
  }

  private format() {
    this.document.SIAP.Licitacao = this.licitacoes?.map( licitacao => {
      return {
          "NumeroLicitacao":licitacao.numero_licitacao,
          "CNPJ":licitacao.cnpj.replaceAll(".","").replace("/","").replace("-",""),
          "NumeroProcesso":licitacao.numero_processo,
          "Modalidade":licitacao.modalidadeId,
          "CriterioTipoJulgamento":licitacao.criterio_tipo_julgamentoId,
          "NaturezaObjeto":licitacao.natureza_objetoId,
          "Agrupamento":licitacao.agrupamentoId,
          "JustificativaGrupoLote":licitacao.justificativa_grupo_lote,
          "RegistroPreco":licitacao.registro_preco ? 1 : 2,
          "PossuiParticipantes":licitacao.possui_participantes ? 1 : 2,
          "Objeto": licitacao.objeto,
          "RegimeExecucaoObra": licitacao.regime_execucao_obraId,
          "NaturezaObra": licitacao.natureza_obraId,
          "ValorMaximo": licitacao.valor_maximo?.toString(),
          "ValorPrevisto": licitacao.valor_previsto.toString(),
          "CodigoPrograma": licitacao.codigo_programa,
          "OrcamentoProprio": licitacao.orcamento_proprio ? 1 : 2,
          "VeiculoPublicacaoEdital": licitacao.veiculo_publicacaoId,
          "DataPublicacaoEdital": this.dateFormat(licitacao.data_publicacao_edital),
          "Garantia": licitacao.garantia ? 1 : 2,
        }
   })
  }

  createXml() {
    this.format()
    const result = js2xml(this.document, {compact: true, spaces: 4, fullTagEmptyElement: true})
    const filePath = path.join(this.defaultDirectory as string, 'Licitacao.xml')

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