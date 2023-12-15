import React, { useEffect, useState } from "react";
import prisma from "lib/prisma";
import Layout from "example/containers/Layout";
import PageTitle from "example/components/Typography/PageTitle";
import { Alert, Button,Text, HelperText, Input, Label, Select, Textarea } from "@roketid/windmill-react-ui";
import SectionTitle from "example/components/Typography/SectionTitle";
import NProgress from 'nprogress';
import "nprogress/nprogress.css";
import { Save } from "@mui/icons-material";
import Router from "next/router";
import { Proposta, PropostaValidation, Message } from "utils/types";
import { GetStaticProps } from "next";
import { Agrupamento, ContratacaoDireta, CpNaturezaObjeto, CriterioTipoJulgamento, Enquadramento, GrupoLicitacaoItem, ItemLicitacao, Licitacao, LicitacaoNaturezaObjeto, Modalidade, NaturezaObra, Proponente, ReferenciaLegal, RegimeExecucaoObra, VeiculoPublicacao } from "@prisma/client";
import enquadramento from "prisma/data/enquadramento";
import referencialegal from "prisma/data/referencialegal";
import cpnaturezaobjeto from "prisma/data/cpnaturezaobjeto";
import veiculopublicacao from "prisma/data/veiculopublicacao";
import SelectField from "example/components/SelectField";
import DefaultInput from "example/components/DefaultInput";
import SearchableSelect from "example/components/SearchableSelect";
import CTA from "example/components/CTA";
import adjudicado from "prisma/data/adjudicado";

NProgress.configure({
    minimum: 0.3,
    easing: 'ease',
    speed: 500,
    showSpinner: false,
});

type Props = {
    initialData: Proposta,
    licitacoes: [Licitacao],
    itemsLotes: [GrupoLicitacaoItem],
    items: [ItemLicitacao],
    contratacoes: [ContratacaoDireta],
    proponentes: [Proponente],
    adjudicacoes: [{codigo:string, descricao:string}]
}

export async function getServerSideProps({ query }) {
    const { id } = query;
    let initialData = null;
    if (id) {
      initialData = await prisma.proposta.findUnique({
        where: { id: parseInt(id) },
      });
    }
    
    let licitacoes = await prisma.licitacao.findMany();
    let itemsLotes = await prisma.grupoLicitacao.findMany();
    let items = await prisma.itemLicitacao.findMany();
    let contratacoes = await prisma.contratacaoDireta.findMany();
    let proponentes = await prisma.proponente.findMany();
    const adjudicacoes = [{codigo:"",descricao:""}].concat(adjudicado);

    return {
      props: {
        initialData: JSON.parse(JSON.stringify(initialData)),
        licitacoes: JSON.parse(JSON.stringify(licitacoes)),
        itemsLotes: JSON.parse(JSON.stringify(itemsLotes)),
        items: JSON.parse(JSON.stringify(items)),
        contratacoes: JSON.parse(JSON.stringify(contratacoes)),
        proponentes: JSON.parse(JSON.stringify(proponentes)),
        adjudicacoes: adjudicacoes
      },
    };
}  


const Create: React.FC<Props> = ({initialData, licitacoes, contratacoes, items, itemsLotes, proponentes, adjudicacoes}) => {
  
  const [isEditMode, setIsEditMode] = useState(!!initialData)
  const [validation, setValidation] = useState<PropostaValidation>({
      id:[],
      marca_item:[],
      codigo_barras:[],
      data_homologacao:[],
      quantidade:[],
      numero_contratacaoId:[],
      numero_licitacaoId:[],
      numero_loteId:[],
      numero_itemId:[],
      adjudicadoId:[],
      codigo_participanteId:[],
      valor: [],
      vencedor: []
  });
  const [blocked, setBlocked] = useState(false);
  const [message, setMessage] = useState<Message>({
    type: undefined,
    text: ""
  })
  

  const [id, setId] = useState(null);
  const [marca_item, setMarcaItem] = useState(null);
  const [codigo_barras, setCodigoBarras] = useState(null);
  const [data_homologacao, setDataHomologacao] = useState(null);
  const [quantidade, setQuantidade] = useState(null);
  const [numero_contratacaoId, setNumeroContratacaoId] = useState(null);
  const [numero_licitacaoId, setNumeroLicitacaoId] = useState(null);
  const [numero_loteId, setNumeroLoteId] = useState(null);
  const [numero_itemId, setNumeroItemId] = useState(null);
  const [adjudicadoId, setAdjudicadoId] = useState(null);
  const [valor, setValor] = useState(null);
  const [vencedor, setVencedor] = useState(false);
  const [codigo_participanteId, setCodigoParticipanteId] = useState(null);
  
  useEffect(() => {
    if (isEditMode) {
      setId(initialData.id)
      setMarcaItem(initialData.marca_item)
      setCodigoBarras(initialData.codigo_barras)
      setDataHomologacao(initialData.data_homologacao)
      setQuantidade(initialData.quantidade)
      setNumeroContratacaoId(initialData.numero_contratacaoId)
      setNumeroLicitacaoId(initialData.numero_licitacaoId)
      setNumeroLoteId(initialData.numero_loteId)
      setNumeroItemId(initialData.numero_itemId)
      setAdjudicadoId(initialData.adjudicadoId)
      setCodigoParticipanteId(initialData.codigo_participanteId)
      setValor(initialData.valor)
      setVencedor(initialData.vencedor)
    }
  },[])

  const validFields = () => {
    let errors: PropostaValidation = {
      id:[],
      marca_item:[],
      codigo_barras:[],
      data_homologacao:[],
      quantidade:[],
      numero_contratacaoId:[],
      numero_licitacaoId:[],
      numero_loteId:[],
      numero_itemId:[],
      adjudicadoId:[],
      codigo_participanteId:[],
      valor: [],
      vencedor: [],
    }
    let isValid = true;

    if (!codigo_participanteId) {
      errors.codigo_participanteId.push("O campo deve ser preenchido")
      isValid = false  
    }
    
    if (!valor || parseFloat(valor) === 0) {
        errors.valor.push("O campo deve ser preenchido e maior que zero")
        isValid = false  
    }

    if (!numero_contratacaoId && !numero_licitacaoId) {
      errors.numero_loteId.push("O campo número da licitação e/ou número da contratação devem ser preenchidos")
      errors.numero_licitacaoId.push("O campo número da licitação e/ou número da contratação devem ser preenchidos")
      isValid = false  
    }

    if (!numero_loteId && !numero_itemId) {
      errors.numero_loteId.push("O campo número do item ou número do lote devem ser preenchidos")
      errors.numero_licitacaoId.push("O campo número do item ou número do lote devem ser preenchidos")
      isValid = false  
    }

    if (numero_loteId && numero_itemId) {
      errors.numero_loteId.push("Somente um dos campos precisa ser preenchido")
      errors.numero_licitacaoId.push("Somente um dos campos precisa ser preenchido")
      isValid = false  
    }





    setValidation(errors)
    return isValid
  }

  const handleSubmit = async () => {
    if (blocked) return
    setBlocked(true)
    if (!validFields()) {
      setBlocked(false)
      return
    }
    NProgress.start()
    
    const body = {
      marca_item,
      codigo_barras,
      data_homologacao: !data_homologacao ? null :  new Date(data_homologacao).toISOString(),
      quantidade,
      numero_contratacaoId,
      numero_licitacaoId,
      numero_loteId,
      numero_itemId,
      adjudicadoId,
      codigo_participanteId,
      valor,
      vencedor
    }
    let response: Response;

    if (isEditMode) {
      try{
          response = await fetch('/api/propostas/'+encodeURIComponent(initialData.id), {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body),
          });
      } catch(error) {
          console.log("erro no server")
      }
    } else {
      try{
          response = await fetch('/api/propostas', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body),
          });
      } catch(error) {
          console.log("erro no server")
      }
    }


    if (response?.ok) {
        setMessage({type:"success", text: `Item do grupo/lote ${isEditMode ? 'atualizado' : 'cadastrado'} com sucesso !`})
        // setIsEditMode(true);
        // setPessoaAtual(body);
    } else {
        const error = await response?.json()
        console.log(error)
        setMessage({type:"danger", text: `Ocorreu o seguinte erro ao processar a requisição "${error.error.message}"`})
    }
    NProgress.done()
    if (isEditMode) {
      Router.push('/propostas/create').then(() => Router.reload());
    }
    setBlocked(false)
    
  }

  return (
    <Layout>
      <PageTitle>Propostas</PageTitle>
      <SectionTitle>Pré-requisitos</SectionTitle>
      <Text>* Cadastro de licitação ou contratação direta</Text>
      <Text>* Item de licitação ou Grupo/Lote de Licitação</Text>
      <Text className="mb-4">* Pessoa proponente</Text>
      {
        message.text !== "" &&
        <Alert className="mb-4" type={message.type} onClose={() => setMessage({type: undefined, text:""})}>
          {message.text}
        </Alert>
      }
      
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="grid gap-6 mb-8 md:grid-cols-2">

          <SearchableSelect
            items={licitacoes}
            label="Número da licitação"
            setValue={(value) => setNumeroLicitacaoId(value)}
            textProp="numero_licitacao"
            valueProp="numero_licitacao"
            validation={validation.numero_licitacaoId}
            value={numero_licitacaoId}
          />

          <SearchableSelect
            items={contratacoes}
            label="Número da contratação direta"
            setValue={(value) => setNumeroContratacaoId(value)}
            textProp="numero_contratacao"
            valueProp="numero_contratacao"
            validation={validation.numero_contratacaoId}
            value={numero_contratacaoId}
          />

          <SearchableSelect
            items={items}
            label="Item"
            setValue={(value) => setNumeroItemId(value)}
            textProp="descricao"
            valueProp="numero_item"
            validation={validation.numero_itemId}
            value={numero_itemId}
          />

          <SearchableSelect
            items={itemsLotes}
            label="Lote/grupo"
            setValue={(value) => setNumeroItemId(value)}
            textProp="descricao"
            valueProp="numero_lote"
            validation={validation.numero_loteId}
            value={numero_loteId}
          />

          <SearchableSelect
            items={proponentes}
            label="Proponente*"
            setValue={(value) => setCodigoParticipanteId(value)}
            textProp="nome"
            valueProp="codigo"
            validation={validation.codigo_participanteId}
            value={codigo_participanteId}
          />

          <SelectField
            items={adjudicacoes}
            label="Adjudicado"
            setValue={(value) => setAdjudicadoId(parseInt(value))}
            textProp="descricao"
            valueProp="codigo"
            validation={validation.adjudicadoId}
            value={adjudicadoId}
          />

          <DefaultInput
            label={"Marca"}
            validation={validation.marca_item}
            setValue = {(value) => setMarcaItem(value)}
            value = {marca_item}
            maxLength = {255}
          />

          <DefaultInput
            label={"Código de barras"}
            validation={validation.codigo_barras}
            setValue = {(value) => setCodigoBarras(value)}
            value = {codigo_barras}
            maxLength = {32}
          />

          <DefaultInput
            label={"Quantidade"}
            validation={validation.quantidade}
            setValue = {(value) => setQuantidade(value)}
            value = {quantidade}
            maxLength = {16}
            type="number"
          />

          <DefaultInput
            label={"Valor unitário*"}
            validation={validation.valor}
            setValue = {(value) => setValor(value)}
            value = {valor}
            maxLength = {16}
            type="number"
          />

          <DefaultInput
            label={"Data da homologação"}
            validation={validation.data_homologacao}
            setValue = {(value) => setDataHomologacao(value)}
            value = {data_homologacao && data_homologacao.substring(0, 10)}
            maxLength = {16}
            type="date"
          />

          <Label className="mt-4" check>
            <span className="mr-2"> Vencedor?*</span>
            <Input type="checkbox" checked={vencedor} onChange={e => setVencedor(e.target.checked)}/>
          </Label>

          

        </div>
        <Button iconLeft={Save} className="mt-4" onClick = {handleSubmit}>Salvar</Button>
      </div>
    </Layout>
  )
}

export default Create;
