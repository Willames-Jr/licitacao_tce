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
import { GrupoLicitacao, GrupoLicitacaoValidation, Message } from "utils/types";
import { GetStaticProps } from "next";
import { Agrupamento, ContratacaoDireta, CpNaturezaObjeto, CriterioTipoJulgamento, Enquadramento, Licitacao, LicitacaoNaturezaObjeto, Modalidade, NaturezaObra, Proponente, ReferenciaLegal, RegimeExecucaoObra, VeiculoPublicacao } from "@prisma/client";
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
    initialData: GrupoLicitacao,
    licitacoes: [Licitacao],
}

export async function getServerSideProps({ query }) {
    const { id } = query;
    let initialData = null;
    if (id) {
      initialData = await prisma.grupoLicitacao.findUnique({
        where: { id },
      });
    }
    
    let licitacoes = await prisma.licitacao.findMany();
    return {
      props: {
        initialData: JSON.parse(JSON.stringify(initialData)),
        licitacoes: JSON.parse(JSON.stringify(licitacoes)),
      },
    };
}  


const Create: React.FC<Props> = ({initialData, licitacoes}) => {
  
  const [isEditMode, setIsEditMode] = useState(!!initialData)
  const [validation, setValidation] = useState<GrupoLicitacaoValidation>({
      id: [],
      numero_licitacaoId: [],
      numero_lote: [],
      descricao: [],
  });
  const [blocked, setBlocked] = useState(false);
  const [message, setMessage] = useState<Message>({
    type: undefined,
    text: ""
  })
  

  const [id,setId] = useState("")
  const [numero_licitacaoId,setNumeroLicitacaoId] = useState(null)
  const [numero_lote,setNumeroLote] = useState("")
  const [descricao,setDescricao] = useState("")
  
  useEffect(() => {
    if (isEditMode) {
      setId(initialData.id)
      setNumeroLote(initialData.numero_lote)
      setNumeroLicitacaoId(initialData.numero_licitacaoId)
      setDescricao(initialData.descricao)
    }
  },[])

  const validFields = () => {
    let errors: GrupoLicitacaoValidation = {
      id: [],
      numero_licitacaoId: [],
      numero_lote: [],
      descricao: [],
    }
    let isValid = true;

    if (numero_licitacaoId === "" || !numero_licitacaoId || numero_licitacaoId === 0) {
        errors.numero_licitacaoId.push("O campo deve ser preenchido")
        isValid = false  
    }
    if (descricao === "") {
        errors.descricao.push("O campo deve ser preenchido")
        isValid = false  
    }
    if (numero_lote === "" || numero_lote === 0 ) {
        errors.descricao.push("O campo deve ser preenchido e ser maior que 0")
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
      descricao,
      numero_lote,
      numero_licitacaoId
    }
    let response: Response;

    if (isEditMode) {
      try{
          response = await fetch('/api/grupo-licitacao/'+encodeURIComponent(initialData.id), {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body),
          });
      } catch(error) {
          console.log("erro no server")
      }
    } else {
      try{
          response = await fetch('/api/grupo-licitacao', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body),
          });
      } catch(error) {
          console.log("erro no server")
      }
    }


    if (response?.ok) {
        setMessage({type:"success", text: `Grupo ${isEditMode ? 'atualizado' : 'cadastrado'} com sucesso !`})
        // setIsEditMode(true);
        // setPessoaAtual(body);
    } else {
        const error = await response?.json()
        console.log(error)
        setMessage({type:"danger", text: `Ocorreu o seguinte erro ao processar a requisição "${error.error.message}"`})
    }
    NProgress.done()
    if (isEditMode) {
      Router.push('/grupo-licitacao/create').then(() => Router.reload());
    }
    setBlocked(false)
    
  }

  return (
    <Layout>
      <PageTitle>Grupo</PageTitle>
      <SectionTitle>Pré-requisitos</SectionTitle>
      <Text className="mb-4">* Cadastro de licitação</Text>
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
            label="Número da licitação*"
            setValue={(value) => setNumeroLicitacaoId(value)}
            textProp="numero_licitacao"
            valueProp="numero_licitacao"
            validation={validation.numero_licitacaoId}
            value={numero_licitacaoId}
          />

          <DefaultInput
            label={"Descrição*"}
            validation={validation.descricao}
            setValue = {(value) => setDescricao(value)}
            value = {descricao}
            maxLength = {1024}
          />

          <DefaultInput
            label={"Lote*"}
            validation={validation.numero_lote}
            setValue = {(value) => setNumeroLote(parseInt(value))}
            value = {numero_lote}
            maxLength = {10}
            type="number"
          />

        </div>
        <Button iconLeft={Save} className="mt-4" onClick = {handleSubmit}>Salvar</Button>
      </div>
    </Layout>
  )
}

export default Create;
