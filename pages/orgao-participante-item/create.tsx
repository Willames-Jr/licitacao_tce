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
import { OrgaoParticipanteItem, OrgaoParticipanteItemValidation, Message } from "utils/types";
import { GetStaticProps } from "next";
import { Agrupamento, ContratacaoDireta, CpNaturezaObjeto, CriterioTipoJulgamento, Enquadramento, GrupoLicitacao, GrupoLicitacaoItem, ItemLicitacao, Licitacao, LicitacaoNaturezaObjeto, Modalidade, NaturezaObra, OrgaoParticipante, Proponente, ReferenciaLegal, RegimeExecucaoObra, VeiculoPublicacao } from "@prisma/client";
import enquadramento from "prisma/data/enquadramento";
import referencialegal from "prisma/data/referencialegal";
import cpnaturezaobjeto from "prisma/data/cpnaturezaobjeto";
import veiculopublicacao from "prisma/data/veiculopublicacao";
import SelectField from "example/components/SelectField";
import DefaultInput from "example/components/DefaultInput";
import SearchableSelect from "example/components/SearchableSelect";
import CTA from "example/components/CTA";

NProgress.configure({
    minimum: 0.3,
    easing: 'ease',
    speed: 500,
    showSpinner: false,
});

type Props = {
    initialData: OrgaoParticipanteItem,
    licitacoes: [Licitacao],
    items: [ItemLicitacao],
    grupos: [GrupoLicitacaoItem],
    orgaos: [OrgaoParticipante]
}

export async function getServerSideProps({ query }) {
    const { id } = query;
    let initialData = null;
    if (id) {
      initialData = await prisma.orgaoParticipante.findUnique({
        where: { id: parseInt(id) },
      });
    }
    
    let licitacoes = await prisma.licitacao.findMany();
    let items = await prisma.itemLicitacao.findMany();
    let grupos = await prisma.grupoLicitacaoItem.findMany();
    let orgaos = await prisma.orgaoParticipante.findMany();
    
    return {
      props: {
        initialData: JSON.parse(JSON.stringify(initialData)),
        licitacoes: JSON.parse(JSON.stringify(licitacoes)),
        items: JSON.parse(JSON.stringify(items)),
        grupos: JSON.parse(JSON.stringify(grupos)),
        orgaos: JSON.parse(JSON.stringify(orgaos)),
      },
    };
}  


const Create: React.FC<Props> = ({initialData, licitacoes, orgaos, grupos, items}) => {
  
  const [isEditMode, setIsEditMode] = useState(!!initialData)
  const [validation, setValidation] = useState<OrgaoParticipanteItemValidation>({
      id: [],
      numero_licitacaoId:  [],
      numero_loteId: [],
      numero_itemId: [],
      quantidade: [],
      orgao_participanteId: [],
  });
  const [blocked, setBlocked] = useState(false);
  const [message, setMessage] = useState<Message>({
    type: undefined,
    text: ""
  })
  
  const [id, setId] = useState("");
  const [orgao_participanteId, setOrgaoParticipanteId] = useState("");
  const [numero_licitacaoId, setNumeroLicitacaoId] = useState("");
  const [numero_loteId, setNumeroLoteId] = useState("");
  const [numero_itemId, setNumeroItemId] = useState("");
  const [quantidade, setQuantidade] = useState("");
  
  useEffect(() => {
    if (isEditMode) {
      setId(intialData.id)
      setOrgaoParticipanteId(initialData.orgao_participanteId)
      setNumeroLicitacaoId(initialData.numero_licitacaoId)
      setNumeroLoteId(initialData.numero_loteId)
      setNumeroItemId(initialData.numero_itemId)
      setQuantidade(initialData.quantidade)
    }
  },[])

  const validFields = () => {
    let errors: OrgaoParticipanteItemValidation = {
      id:  [],
      orgao_participanteId:  [],
      numero_licitacaoId:  [],
      numero_loteId:  [],
      numero_itemId:  [],
      quantidade:  [],
    }
    let isValid = true;

    
    if (!numero_licitacaoId) {
        errors.numero_licitacaoId.push("O campo deve ser preenchido")
        isValid = false  
    }
    if (!orgao_participanteId) {
        errors.orgao_participanteId.push(`O campo deve ser preenchido`)
        isValid = false
    }
    console.log(orgao_participanteId)
    if (!numero_itemId  && !numero_loteId || numero_itemId && numero_loteId) {
        errors.numero_itemId.push("O campo Item ou Grupo deve ser preenchido")
        errors.numero_loteId.push("O campo Item ou Grupo deve ser preenchido")
        isValid = false  
    }
    if (quantidade === 0 || quantidade === "") {
      errors.quantidade.push(`O campo deve ser preenchido e o valor deve ser maior que 0`)
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
      numero_itemId: parseInt(numero_itemId),
      numero_loteId: parseInt(numero_loteId),
      quantidade: parseFloat(quantidade),
      orgao_participanteId: parseInt(orgao_participanteId),
      numero_licitacaoId,
    }
    let response: Response;

    if (isEditMode) {
      try{
          response = await fetch('/api/orgao-participante-item/'+encodeURIComponent(initialData.id), {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body),
          });
      } catch(error) {
          console.log("erro no server")
      }
    } else {
      try{
          response = await fetch('/api/orgao-participante-item', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body),
          });
      } catch(error) {
          console.log("erro no server")
      }
    }


    if (response?.ok) {
        setMessage({type:"success", text: `Item do Orgão participante ${isEditMode ? 'atualizado' : 'cadastrado'} com sucesso !`})
        // setIsEditMode(true);
        // setPessoaAtual(body);
    } else {
        const error = await response?.json()
        console.log(error)
        setMessage({type:"danger", text: `Ocorreu o seguinte erro ao processar a requisição "${error.error.message}"`})
    }
    NProgress.done()
    if (isEditMode) {
      Router.push('/orgao-participante-item/create').then(() => Router.reload());
    }
    setBlocked(false)
    
  }

  return (
    <Layout>
      <PageTitle>Item do Orgão participante</PageTitle>
      <SectionTitle>Pré-requisitos</SectionTitle>
      <Text>* Cadastro de licitação</Text>
      <Text>* Cadastro de Item da licitação ou Grupo/Lote da licitação</Text>
      <Text className="mb-4">* Cadastro do Orgão participante de licitação</Text>
      {
        message.text !== "" &&
        <Alert className="mb-4" type={message.type} onClose={() => setMessage({type: undefined, text:""})}>
          {message.text}
        </Alert>
      }
      
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="grid gap-6 mb-8 md:grid-cols-2">

          <SearchableSelect
            items={orgaos}
            label="Orgão participante*"
            setValue={(value) => setOrgaoParticipanteId(value)}
            textProp="cnpj"
            valueProp="id"
            validation={validation.orgao_participanteId}
            value={orgao_participanteId}
          />

          <SearchableSelect
            items={licitacoes}
            label="Número da licitação*"
            setValue={(value) => setNumeroLicitacaoId(value)}
            textProp="numero_licitacao"
            valueProp="numero_licitacao"
            validation={validation.numero_licitacaoId}
            value={numero_licitacaoId}
          />

          <SearchableSelect
            items={grupos}
            label="Número do item do grupo/lote da licitação*"
            setValue={(value) => setNumeroLoteId(value)}
            textProp="descricao"
            valueProp="numero_item"
            validation={validation.numero_loteId}
            value={numero_loteId}
          />

          <SearchableSelect
            items={items}
            label="Número do item da licitação*"
            setValue={(value) => setNumeroItemId(value)}
            textProp="descricao"
            valueProp="numero_item"
            validation={validation.numero_itemId}
            value={numero_itemId}
          />

          <DefaultInput
            label={"Quantidade*"}
            validation={validation.quantidade}
            setValue = {(value) => setQuantidade(parseFloat(value).toFixed(2))}
            value = {quantidade}
            maxLength = {32}
            type="number"
          />
        </div>
        <Button iconLeft={Save} className="mt-4" onClick = {handleSubmit}>Salvar</Button>
      </div>
    </Layout>
  )
}

export default Create;
