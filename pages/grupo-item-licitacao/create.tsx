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
import { GrupoItemLicitacao, GrupoItemLicitacaoValidation, Message } from "utils/types";
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
    initialData: GrupoItemLicitacaoValidation,
    licitacoes: [Licitacao],
}

export async function getServerSideProps({ query }) {
    const { numero_item } = query;
    let initialData = null;
    if (numero_item) {
      initialData = await prisma.grupoLicitacaoItem.findUnique({
        where: { numero_item },
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
  const [validation, setValidation] = useState<GrupoItemLicitacaoValidation>({
      numero_licitacaoId:      [],
      numero_item:             [],
      descricao:               [],
      unidade_medida:          [],
      quantidade_estimada:     [],
      valor_unitario_estimado: [],
  });
  const [blocked, setBlocked] = useState(false);
  const [message, setMessage] = useState<Message>({
    type: undefined,
    text: ""
  })
  

  const [numero_licitacaoId, setNumeroLicitacaoId] = useState(null);
  const [numero_item, setNumeroItem] = useState("");
  const [descricao, setDescricao] = useState("");
  const [unidade_medida, setUnidadeMedida] = useState("");
  const [quantidade_estimada, setQuantidadeEstimada] = useState("");
  const [valor_unitario_estimado, setValorUnitario] = useState("");
  
  useEffect(() => {
    if (isEditMode) {
      setNumeroLicitacaoId(initialData.numero_licitacaoId)
      setNumeroItem(initialData.numero_item)
      setDescricao(initialData.descricao)
      setUnidadeMedida(initialData.unidade_medida)
      setQuantidadeEstimada(initialData.quantidade_estimada)
      setValorUnitario(initialData.valor_unitario_estimado)
    }
  },[])

  const validFields = () => {
    let errors: GrupoItemLicitacaoValidation = {
      numero_licitacaoId:      [],
      numero_item:             [],
      descricao:               [],
      unidade_medida:          [],
      quantidade_estimada:     [],
      valor_unitario_estimado: [],
    }
    let isValid = true;

    
    if (!numero_licitacaoId) {
        errors.numero_licitacaoId.push("O campo deve ser preenchido")
        isValid = false  
    }
    if (!descricao) {
        errors.descricao.push("O campo deve ser preenchido e ser maior que 0")
        isValid = false  
    }
    if (!unidade_medida) {
        errors.unidade_medida.push("O campo deve ser preenchido e ser maior que 0")
        isValid = false  
    }
    if (!quantidade_estimada || quantidade_estimada === 0) {
      errors.quantidade_estimada.push("O campo deve ser preenchido")
      isValid = false  
    }
    if (!valor_unitario_estimado || valor_unitario_estimado === 0) {
      errors.valor_unitario_estimado.push("O campo deve ser preenchido")
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
      numero_licitacaoId,
      unidade_medida,
      quantidade_estimada,
      valor_unitario_estimado
    }
    let response: Response;

    if (isEditMode) {
      try{
          response = await fetch('/api/grupo-item-licitacao/'+encodeURIComponent(initialData.numero_item), {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body),
          });
      } catch(error) {
          console.log("erro no server")
      }
    } else {
      try{
          response = await fetch('/api/grupo-item-licitacao', {
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
      Router.push('/grupo-item-licitacao/create').then(() => Router.reload());
    }
    setBlocked(false)
    
  }

  return (
    <Layout>
      <PageTitle>Item do grupo</PageTitle>
      <SectionTitle>Pré-requisitos</SectionTitle>
      <Text>* Cadastro de licitação</Text>
      <Text className="mb-4">* Cadastro de grupo/lote da licitação</Text>
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
            label={"Unidade de medida*"}
            validation={validation.unidade_medida}
            setValue = {(value) => setUnidadeMedida(value)}
            value = {unidade_medida}
            maxLength = {255}
          />

          <DefaultInput
            label={"Quantidade*"}
            validation={validation.quantidade_estimada}
            setValue = {(value) => setQuantidadeEstimada(parseFloat(value).toFixed(2))}
            value = {quantidade_estimada}
            maxLength = {32}
            type="number"
          />

          <DefaultInput
            label={"Valor unitário estimado*"}
            validation={validation.valor_unitario_estimado}
            setValue = {(value) => setValorUnitario(parseFloat(value).toFixed(2))}
            value = {valor_unitario_estimado}
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
