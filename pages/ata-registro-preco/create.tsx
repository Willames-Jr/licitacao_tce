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
import { Proposta, AtaRegistroPrecoValidation, Message } from "utils/types";
import { GetStaticProps } from "next";
import { AdjudicacaoLicitacao, Agrupamento, AtaRegistroDePreco, ContratacaoDireta, CpNaturezaObjeto, CriterioTipoJulgamento, Enquadramento, GrupoLicitacaoItem, ItemLicitacao, Licitacao, LicitacaoNaturezaObjeto, Modalidade, NaturezaObra, Proponente, ReferenciaLegal, RegimeExecucaoObra, VeiculoPublicacao } from "@prisma/client";
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
    initialData: AtaRegistroDePreco,
    licitacoes: [Licitacao],
    proponentes: [Proponente],
    adjudicacoes: [AdjudicacaoLicitacao]
    veiculos: [{codigo:string, descricao:string}]
}

export async function getServerSideProps({ query }) {
    const { numero_ata } = query;
    let initialData = null;
    if (numero_ata) {
      initialData = await prisma.ataRegistroDePreco.findUnique({
        where: { numero_ata },
      });
    }
    
    let licitacoes = await prisma.licitacao.findMany();
    let proponentes = await prisma.proponente.findMany();
    let adjudicacoes = await prisma.adjudicacaoLicitacao.findMany();
    const veiculos = [{codigo:"",descricao:""}].concat(veiculopublicacao);

    return {
      props: {
        initialData: JSON.parse(JSON.stringify(initialData)),
        licitacoes: JSON.parse(JSON.stringify(licitacoes)),
        proponentes: JSON.parse(JSON.stringify(proponentes)),
        adjudicacoes: JSON.parse(JSON.stringify(adjudicacoes)),
        veiculos
      },
    };
}  


const Create: React.FC<Props> = ({initialData, licitacoes, veiculos, proponentes, adjudicacoes}) => {
  
  const [isEditMode, setIsEditMode] = useState(!!initialData)
  const [validation, setValidation] = useState<AtaRegistroPrecoValidation>({
      numero_ata: [],
      valor: [],
      descricao: [],
      inicio_vigencia: [],
      fim_vigencia: [],
      data_publicacao: [],
      link_publicacao: [],
      numero_licitacaoId: [],
      codigo_beneficiarioId: [],
      veiculo_publicacaoId: [],
  });
  const [blocked, setBlocked] = useState(false);
  const [message, setMessage] = useState<Message>({
    type: undefined,
    text: ""
  })
  
  const [numero_ata, setNumeroAta] = useState(null);
  const [valor, setValor] = useState(null);
  const [descricao, setDescricao] = useState(null);
  const [inicio_vigencia, setInicioVigencia] = useState(null);
  const [fim_vigencia, setFimVigencia] = useState(null);
  const [data_publicacao, setDataPublicacao] = useState(null);
  const [link_publicacao, setLinkPublicacao] = useState(null);
  const [numero_licitacaoId, setNumeroLicitacaoId] = useState(null);
  const [codigo_beneficiarioId, setCodigoBeneficiarioId] = useState(null);
  const [veiculo_publicacaoId, setVeiculoPublicacaoId] = useState(null);
  
  useEffect(() => {
    if (isEditMode) {
      setNumeroAta(initialData.numero_ata)
      setValor(initialData.valor)
      setDescricao(initialData.descricao)
      setInicioVigencia(initialData.inicio_vigencia)
      setFimVigencia(initialData.fim_vigencia)
      setDataPublicacao(initialData.data_publicacao)
      setLinkPublicacao(initialData.link_publicacao)
      setNumeroLicitacaoId(initialData.numero_licitacaoId)
      setCodigoBeneficiarioId(initialData.codigo_beneficiarioId)
      setVeiculoPublicacaoId(initialData.veiculo_publicacaoId)
    }
  },[])

  const validFields = () => {
    let errors: AtaRegistroPrecoValidation = {
      numero_ata: [],
      valor: [],
      descricao: [],
      inicio_vigencia: [],
      fim_vigencia: [],
      data_publicacao: [],
      link_publicacao: [],
      numero_licitacaoId: [],
      codigo_beneficiarioId: [],
      veiculo_publicacaoId: [],
    }
    let isValid = true;

    if (!numero_licitacaoId) {
      errors.numero_licitacaoId.push("O campo deve ser preenchido")
      isValid = false  
    }

    if (!numero_ata) {
      errors.numero_ata.push("O campo deve ser preenchido")
      isValid = false  
    }
    
    if (!valor || parseFloat(valor) === 0) {
      errors.valor.push("O campo deve ser preenchido e ser maior que 0")
      isValid = false  
    }

    if (!descricao) {
      errors.descricao.push("O campo deve ser preenchido")
      isValid = false  
    }

    if (!codigo_beneficiarioId) {
      errors.codigo_beneficiarioId.push("O campo deve ser preenchido")
      isValid = false  
    }

    if (!numero_licitacaoId) {
      errors.numero_licitacaoId.push("O campo deve ser preenchido")
      isValid = false  
    }

    if (!inicio_vigencia) {
      errors.inicio_vigencia.push("O campo deve ser preenchido")
      isValid = false  
    }

    if (!fim_vigencia) {
      errors.fim_vigencia.push("O campo deve ser preenchido")
      isValid = false  
    }

    if (numero_licitacaoId && inicio_vigencia && fim_vigencia) {
      const data_inicio = new Date(inicio_vigencia)
      const data_fim = new Date(fim_vigencia)
      const adjudicacao: AdjudicacaoLicitacao = adjudicacoes.find(adj => adj.numero_licitacaoId === numero_licitacaoId)
      
      if (data_fim < data_inicio) {
        errors.fim_vigencia.push("A data de fim da vigência não pode ser menor que a data de início da vigência")
        errors.inicio_vigencia.push("data de fim da vigência não pode ser menor que a data de início da vigência")
        isValid = false 
      }

      if (data_publicacao) {
        const publicacao = new Date(data_publicacao)
        if (publicacao < data_inicio) {
          errors.data_publicacao.push("A data da publicação não pode ser anterior a data do inicío da vigência")
          errors.inicio_vigencia.push("A data da publicação não pode ser anterior a data do inicío da vigência")
          isValid = false
        }
      }


      if (adjudicacao) {
        const data_homologacao = new Date(adjudicacao.data_homologacao)
        

        if (data_inicio < data_homologacao) {
          errors.inicio_vigencia.push("A data não pode ser inferior a data informada na Data de Homologação do Leiaute Adjudicação Licitação")
          isValid = false  
        }
      }
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
      numero_ata,
      valor: !valor ? null : parseFloat(valor),
      descricao,
      inicio_vigencia: !inicio_vigencia ? null : new Date(inicio_vigencia).toISOString(),
      fim_vigencia: !fim_vigencia ? null : new Date(fim_vigencia).toISOString(),
      data_publicacao: !data_publicacao ? null :  new Date(data_publicacao).toISOString(),
      link_publicacao,
      numero_licitacaoId,
      codigo_beneficiarioId,
      veiculo_publicacaoId: parseInt(veiculo_publicacaoId as any as string),
    }
    let response: Response;

    if (isEditMode) {
      try{
          response = await fetch('/api/ata-registro-preco/'+encodeURIComponent(initialData.numero_ata), {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body),
          });
      } catch(error) {
          console.log("erro no server")
      }
    } else {
      try{
          response = await fetch('/api/ata-registro-preco', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body),
          });
      } catch(error) {
          console.log("erro no server")
      }
    }


    if (response?.ok) {
        setMessage({type:"success", text: `Ata de registro de preços ${isEditMode ? 'atualizada' : 'cadastrada'} com sucesso !`})
        // setIsEditMode(true);
        // setPessoaAtual(body);
    } else {
        const error = await response?.json()
        console.log(error)
        setMessage({type:"danger", text: `Ocorreu o seguinte erro ao processar a requisição "${error.error.message}"`})
    }
    NProgress.done()
    if (isEditMode) {
      Router.push('/ata-registro-preco/create').then(() => Router.reload());
    }
    setBlocked(false)
    
  }

  return (
    <Layout>
      <PageTitle>Ata de registro de preço</PageTitle>
      <SectionTitle>Pré-requisitos</SectionTitle>
      <Text>* Cadastro de licitação</Text>
      <Text>* Cadastro de pessoa proponente</Text>
      <Text className="mb-4">* Cadastro de Adjudicação de Licitação</Text>
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

          <SearchableSelect
            items={proponentes}
            label="Proponente*"
            setValue={(value) => setCodigoBeneficiarioId(value)}
            textProp="nome"
            valueProp="codigo"
            validation={validation.codigo_beneficiarioId}
            value={codigo_beneficiarioId}
          />

          <DefaultInput
            label={"Número da ata*"}
            validation={validation.numero_ata}
            setValue = {(value) => setNumeroAta(value)}
            value = {numero_ata}
            maxLength = {16}
            type="text"
          />

          <DefaultInput
            label={"Valor global*"}
            validation={validation.valor}
            setValue = {(value) => setValor(value)}
            value = {valor}
            maxLength = {16}
            type="number"
          />

          <DefaultInput
            label={"Início da vigência*"}
            validation={validation.inicio_vigencia}
            setValue = {(value) => setInicioVigencia(value)}
            value = {inicio_vigencia && inicio_vigencia.substring(0, 10)}
            maxLength = {16}
            type="date"
          />

          <DefaultInput
            label={"Fim da vigência*"}
            validation={validation.fim_vigencia}
            setValue = {(value) => setFimVigencia(value)}
            value = {fim_vigencia && fim_vigencia.substring(0, 10)}
            maxLength = {16}
            type="date"
          />

          <SearchableSelect
            items={veiculos}
            label="Veículo de publicação*"
            setValue={(value) => setVeiculoPublicacaoId(value)}
            textProp="descricao"
            valueProp="codigo"
            validation={validation.veiculo_publicacaoId}
            value={veiculo_publicacaoId}
          />


          

        </div>
        <Label className="mt-4">
          <span>Objeto*</span>
          <Textarea rows={3} value = {descricao} maxLength={1024} onChange={(e) => setDescricao(e.target.value)} className="mt-1" valid={validation.descricao.length === 0}  />
          {
            validation.descricao &&
            <HelperText valid={false}>{validation.descricao.map((v) => {return <p key={v}>*{v}</p>})}</HelperText>
          }
        
        </Label>
        <Label className="mt-4">
          <span>Link da publicação</span>
          <Textarea rows={3} value = {link_publicacao} maxLength={1024} onChange={(e) => setLinkPublicacao(e.target.value)} className="mt-1" valid={validation.link_publicacao.length === 0}  />
          {
            validation.link_publicacao &&
            <HelperText valid={false}>{validation.link_publicacao.map((v) => {return <p key={v}>*{v}</p>})}</HelperText>
          }
        </Label>

        <Button iconLeft={Save} className="mt-4" onClick = {handleSubmit}>Salvar</Button>
      </div>
    </Layout>
  )
}

export default Create;
