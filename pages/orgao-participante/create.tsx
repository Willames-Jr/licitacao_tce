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
import { OrgaoParticipante, OrgaoParticipanteValidation, Message } from "utils/types";
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
    initialData: OrgaoParticipante,
    licitacoes: [Licitacao],
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
    console.log(initialData)
    return {
      props: {
        initialData: JSON.parse(JSON.stringify(initialData)),
        licitacoes: JSON.parse(JSON.stringify(licitacoes)),
      },
    };
}  


const Create: React.FC<Props> = ({initialData, licitacoes}) => {
  
  const [isEditMode, setIsEditMode] = useState(!!initialData)
  const [validation, setValidation] = useState<OrgaoParticipanteValidation>({
      numero_licitacaoId:  [],
      cnpj:  [],
  });
  const [blocked, setBlocked] = useState(false);
  const [message, setMessage] = useState<Message>({
    type: undefined,
    text: ""
  })
  

  const [numero_licitacaoId, setNumeroLicitacaoId] = useState(null);
  const [cnpj, setCnpj] = useState("");
  
  useEffect(() => {
    if (isEditMode) {
      console.log(initialData.numero_licitacaoId)
      setNumeroLicitacaoId(initialData.numero_licitacaoId)
      setCnpj(initialData.cnpj)
    }
  },[])

  const cnpjMask = (value) => {
      return value
          .replace(/\D+/g, '') // não deixa ser digitado nenhuma letra
          .replace(/(\d{2})(\d)/, '$1.$2') // captura 2 grupos de número o primeiro com 2 digitos e o segundo de com 3 digitos, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de número
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1/$2') // captura 2 grupos de número o primeiro e o segundo com 3 digitos, separados por /
          .replace(/(\d{4})(\d)/, '$1-$2')
          .replace(/(-\d{2})\d+?$/, '$1') // captura os dois últimos 2 números, com um - antes dos dois números
  }

  const validFields = () => {
    let errors: OrgaoParticipanteValidation = {
      numero_licitacaoId:  [],
      cnpj:  [],
    }
    let isValid = true;

    
    if (!numero_licitacaoId) {
        errors.numero_licitacaoId.push("O campo deve ser preenchido")
        isValid = false  
    }
    if (!cnpj) {
        errors.cnpj.push(`O campo deve ser preenchido`)
        isValid = false
    } else if (cnpj.length != 18){
        errors.cnpj.push("O campo deve ser preenchido por completo")
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
      cnpj,
      numero_licitacaoId,
    }
    let response: Response;

    if (isEditMode) {
      try{
          response = await fetch('/api/orgao-participante/'+encodeURIComponent(initialData.id), {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body),
          });
      } catch(error) {
          console.log("erro no server")
      }
    } else {
      try{
          response = await fetch('/api/orgao-participante', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body),
          });
      } catch(error) {
          console.log("erro no server")
      }
    }


    if (response?.ok) {
        setMessage({type:"success", text: `Orgão da licitacão ${isEditMode ? 'atualizado' : 'cadastrado'} com sucesso !`})
        // setIsEditMode(true);
        // setPessoaAtual(body);
    } else {
        const error = await response?.json()
        console.log(error)
        setMessage({type:"danger", text: `Ocorreu o seguinte erro ao processar a requisição "${error.error.message}"`})
    }
    NProgress.done()
    if (isEditMode) {
      Router.push('/orgao-participante/create').then(() => Router.reload());
    }
    setBlocked(false)
    
  }

  return (
    <Layout>
      <PageTitle>Orgão participante</PageTitle>
      {/* <SectionTitle>Pré-requisitos</SectionTitle>
      <Text>* Cadastro de licitação</Text>
      <Text className="mb-4">* Cadastro de grupo/lote da licitação</Text> */}
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
            label={"CNPJ*"}
            validation={validation.cnpj}
            setValue = {(value) => setCnpj(cnpjMask(value))}
            value = {cnpj}
            maxLength = {18}
          />
        </div>
        <Button iconLeft={Save} className="mt-4" onClick = {handleSubmit}>Salvar</Button>
      </div>
    </Layout>
  )
}

export default Create;
