import { Decimal } from "@prisma/client/runtime/library"

export type Validation = {
  nome: [string?],
  codigo: [string?]
}

export type Message = {
  type: "info" | "success" | "danger" | "warning" | "neutral" | undefined,
  text: string
}

export type GenericType = {
  codigo: number,
  descricao: string
}

export type AtaRegistroPrecoValidation = {
  numero_ata: [string?],
  valor: [string?],
  descricao: [string?],
  inicio_vigencia: [string?],
  fim_vigencia: [string?],
  data_publicacao: [string?],
  link_publicacao: [string?],
  numero_licitacaoId: [string?],
  codigo_beneficiarioId: [string?],
  veiculo_publicacaoId: [string?],
}

export type AtaRegistroPreco = {
  numero_ata: string,
  valor: number,
  descricao: string,
  inicio_vigencia: Date,
  fim_vigencia: Date,
  data_publicacao: Date,
  link_publicacao: string,
  numero_licitacaoId: string,
  codigo_beneficiarioId: string,
  veiculo_publicacaoId: number,
}


export type PropostaValidation = {
  id: [string?],
  marca_item: [string?],
  codigo_barras: [string?],
  data_homologacao: [string?],
  quantidade: [string?],
  numero_contratacaoId: [string?],
  numero_licitacaoId: [string?],
  numero_loteId: [string?],
  numero_itemId: [string?],
  adjudicadoId: [string?],
  codigo_participanteId: [string?],
  valor: [string?],
  vencedor: [string?]
}

export type Proposta = {
  id: number,
  marca_item: string,
  codigo_barras: string,
  data_homologacao: Date,
  quantidade: number,
  numero_contratacaoId: number,
  numero_licitacaoId: number,
  numero_loteId: number,
  numero_itemId: number,
  adjudicadoId: number,
  codigo_participanteId: number,
  valor: number,
  vencedor: boolean

}

export type AdjudicacaoLicitacao = {
  id: number,                         
  data_adjudicacao: Date,
  data_homologacao: Date,     
  data_publicacao_resultado: Date,
  homologacao_parcial: boolean,
  data_anulacao: Date | null,               
  motivo_anulacao: string | null,           
  data_publicacao_anulacao: Date | null,
  data_revogacao: Date | null,             
  motivo_revogacao: string | null,          
  data_publicacao_revogacao: Date | null,  
  data_vigencia: Date | null,              
  fracassada: boolean,                
  veiculo_publicacaoId: number, 
  numero_licitacaoId: number, 
}

export type AdjudicacaoLicitacaoValidation = {
  id: [string?]
  data_adjudicacao: [string?]
  data_homologacao: [string?]
  data_publicacao_resultado: [string?]
  homologacao_parcial: [string?]
  data_anulacao: [string?]
  motivo_anulacao: [string?]
  data_publicacao_anulacao: [string?]
  data_revogacao: [string?]
  motivo_revogacao: [string?]
  data_publicacao_revogacao: [string?]
  data_vigencia: [string?]
  fracassada: [string?]
  veiculo_publicacaoId: [string?]
  numero_licitacaoId: [string?]
}

export type OrgaoParticipanteItemValidation = {
  id: [string?]
  orgao_participanteId: [string?]
  numero_licitacaoId: [string?]
  numero_loteId: [string?]
  numero_itemId: [string?]
  quantidade: [string?]
}

export type OrgaoParticipanteItem = {
  id: number
  orgao_participanteId: number
  numero_licitacaoId: string
  numero_loteId: number
  numero_itemId: number
  quantidade: number
}

export type OrgaoParticipanteValidation = {
  cnpj: [string?],
  numero_licitacaoId: [string?]
}

export type OrgaoParticipante = {
  id: number,
  cnpj: string,
  numero_licitacaoId: string
}

export type GrupoItemLicitacaoValidation = {
  numero_licitacaoId: [string?],
  numero_item: [string?],
  unidade_medida: [string?],
  quantidade_estimada: [string?],
  valor_unitario_estimado:[string?],
  descricao: [string?],
}

export type GrupoItemLicitacao = {
  numero_licitacaoId: string,
  numero_item: number,
  unidade_medida: string,
  quantidade_estimada: number,
  valor_unitario_estimado:number,
  descricao: string,
}

export type GrupoLicitacaoValidation = {
  id: [string?],
  numero_licitacaoId: [string?],
  numero_lote: [string?],
  descricao: [string?],
}

export type GrupoLicitacao = {
  id: number,
  numero_licitacaoId: string,
  numero_lote: number,
  descricao: string,
}


export type ItemLicitacaoValidation = {
  numero_contratacaoId:      [string?],
  numero_licitacaoId:        [string?],
  numero_item:             [string?],
  descricao:               [string?],
  unidade_medida:          [string?],
  quantidade:              [string?],
  valor_unitario_estimado: [string?],
}

export type ItemLicitacao = {
  numero_contratacaoId:      number,
  numero_licitacaoId:        number,
  numero_item:             number,
  descricao:               string,
  unidade_medida:          string,
  quantidade:              number,
  valor_unitario_estimado: number,
}

export type ContratacaoValidation = {
  numero_contratacao:     [string?],
  cnpj:                   [string?],
  numero_processo:        [string?],
  enquadramentoId:        [string?],
  referencia_legalId:     [string?],
  natureza_objetoId:      [string?],
  objeto:                 [string?],
  valor_previsto:         [string?],
  codigo_programa:        [string?],
  orcamento_proprio:      [string?],
  veiculo_publicacaoId:   [string?],
  data_publicacao:        [string?],
  data_publicacao_edital: [string?],
  documento_juridico:     [string?],
}

export type Contratacao = {
  numero_contratacao: string,
  cnpj:                   string,
  numero_processo:        string,
  enquadramentoId:        number,
  referencia_legalId:     number,
  natureza_objetoId:      number,
  objeto:                 string,
  valor_previsto:         Decimal,
  codigo_programa:        string | null,
  orcamento_proprio:      boolean,
  veiculo_publicacaoId:     number,
  data_publicacao:        Date | null,
  data_publicacao_edital: Date | null,
  documento_juridico:     string,
}

export type Licitacao = {
  numero_licitacao:         string,
  cnpj:                     string,
  numero_processo:          string,
  justificativa_grupo_lote: string | undefined,
  registro_preco:           boolean,
  possui_participantes:     boolean,
  objeto:                   string,
  valor_previsto:           number,
  valor_maximo:             number | undefined,
  codigo_programa:          string | undefined,
  orcamento_proprio:        boolean,
  data_publicacao_edital:   Date,
  garantia:                 boolean,
  agrupamentoId:              number,
  veiculo_publicacaoId:       number,
  modalidadeId:               number,
  natureza_obraId:            number | undefined,
  natureza_objetoId:          number,
  criterio_tipo_julgamentoId: number,
  regime_execucao_obraId:     number | undefined,
  veiculo_publicacao      :number,
  regime_execucao_obra     :number,
  natureza_obra            :number,
  modalidade               :number,
  criterio_tipo_julgamento :number,
  natureza_objeto          :number,
  agrupamento              :number,

}

export type HTTPError = {
  error : {
    code: string,
    message: string
  }
}