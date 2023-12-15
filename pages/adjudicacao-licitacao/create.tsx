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
import { GrupoItemLicitacao, AdjudicacaoLicitacaoValidation, Message } from "utils/types";
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
    initialData: AdjudicacaoLicitacaoValidation,
    veiculos: [VeiculoPublicacao],
    licitacoes: [Licitacao]
}

export async function getServerSideProps({ query }) {
    const { id } = query;
    let initialData = null;
    if (id) {
      initialData = await prisma.adjudicacaoLicitacao.findUnique({
        where: { id: parseInt(id) },
      });
    }
    console.log(initialData)
    let veiculos = await prisma.veiculoPublicacao.findMany();
    let licitacoes = await prisma.licitacao.findMany();
    return {
      props: {
        initialData: JSON.parse(JSON.stringify(initialData)),
        veiculos: JSON.parse(JSON.stringify(veiculos)),
        licitacoes: JSON.parse(JSON.stringify(licitacoes)),
      },
    };
}  


const Create: React.FC<Props> = ({initialData, veiculos, licitacoes}) => {
  
  const [isEditMode, setIsEditMode] = useState(!!initialData)
  const [validation, setValidation] = useState<AdjudicacaoLicitacaoValidation>({
      id: [],
      data_adjudicacao: [],
      data_homologacao: [],
      data_publicacao_resultado: [],
      homologacao_parcial: [],
      data_anulacao: [],
      motivo_anulacao: [],
      data_publicacao_anulacao: [],
      data_revogacao: [],
      motivo_revogacao: [],
      data_publicacao_revogacao: [],
      data_vigencia: [],
      fracassada: [],
      veiculo_publicacaoId: [],
      numero_licitacaoId: [],
  });
  const [blocked, setBlocked] = useState(false);
  const [message, setMessage] = useState<Message>({
    type: undefined,
    text: ""
  })
  

  const [data_adjudicacao, setDataAdjudicacao] = useState("");
  const [data_homologacao, setDataHomologacao] = useState("");
  const [data_publicacao_resultado, setDataPublicacaoResultado] = useState("");
  const [homologacao_parcial, setHomologacaoParcial] = useState(false);
  const [data_anulacao, setDataAnulacao] = useState("");
  const [motivo_anulacao, setMotivoAnulacao] = useState("");
  const [data_publicacao_anulacao, setDataPublicacaoAnulacao] = useState("");
  const [data_revogacao, setDataRevogacao] = useState("");
  const [motivo_revogacao, setMotivoRevogacao] = useState("");
  const [data_publicacao_revogacao, setDataPublicacaoRevogacao] = useState("");
  const [data_vigencia, setDataVigencia] = useState("");
  const [fracassada, setFracassada] = useState(false);
  const [veiculo_publicacaoId, setVeiculoPublicacaoId] = useState("");
  const [numero_licitacaoId, setNumeroLicitacaoId] = useState("");
  
  useEffect(() => {
    if (isEditMode) {
      console.log(initialData)
      setDataAdjudicacao(initialData.data_adjudicacao)
      setDataHomologacao(initialData.data_homologacao)
      setDataPublicacaoResultado(initialData.data_publicacao_resultado)
      setHomologacaoParcial(initialData.homologacao_parcial)
      setDataAnulacao(initialData.data_anulacao)
      setMotivoAnulacao(initialData.motivo_anulacao)
      setDataPublicacaoAnulacao(initialData.data_publicacao_anulacao)
      setDataRevogacao(initialData.data_revogacao)
      setMotivoRevogacao(initialData.motivo_revogacao)
      setDataPublicacaoRevogacao(initialData.data_publicacao_revogacao)
      setDataVigencia(initialData.data_vigencia)
      setFracassada(initialData.fracassada)
      setVeiculoPublicacaoId(initialData.veiculo_publicacaoId)
      setNumeroLicitacaoId(initialData.numero_licitacaoId)
    }
  },[])

  const validFields = () => {
    let errors: AdjudicacaoLicitacaoValidation = {
      id: [],
      data_adjudicacao: [],
      data_homologacao: [],
      data_publicacao_resultado: [],
      homologacao_parcial: [],
      data_anulacao: [],
      motivo_anulacao: [],
      data_publicacao_anulacao: [],
      data_revogacao: [],
      motivo_revogacao: [],
      data_publicacao_revogacao: [],
      data_vigencia: [],
      fracassada: [],
      veiculo_publicacaoId: [],
      numero_licitacaoId: [],
  }
    let isValid = true;
    let actualLicitacao = null;
    const dataAnulacao = new Date(data_anulacao)
    const dataPublicacaoAnulacao = new Date(data_publicacao_anulacao)
    const dataRevogacao = new Date(data_revogacao)
    const dataPublicacaoRevogacao = new Date(data_publicacao_revogacao)

    if (!numero_licitacaoId) {
        errors.numero_licitacaoId.push("O campo deve ser preenchido")
        isValid = false  
    } else {
      actualLicitacao = licitacoes.find(lict => lict.numero_licitacao === numero_licitacaoId)
    }

    if (!veiculo_publicacaoId) {
      errors.veiculo_publicacaoId.push("O campo deve ser preenchido")
      isValid = false  
    }

    if (!data_adjudicacao) {
        errors.data_adjudicacao.push("O campo deve ser preenchido")
        isValid = false  
    }

    if (!data_homologacao) {
        errors.data_homologacao.push("O campo deve ser preenchido")
        isValid = false  
    }

    if (!data_publicacao_resultado) {
        errors.data_publicacao_resultado.push("O campo deve ser preenchido")
        isValid = false  
    }
    if (actualLicitacao) {
      const dataAdjudicacao = new Date(data_adjudicacao)
      const dataHomologacao = new Date(data_homologacao)
      const dataResultado = new Date(data_publicacao_resultado)
      const dataEdital = new Date(actualLicitacao.data_publicacao_edital)

      if (dataAdjudicacao < dataEdital) {
        errors.data_adjudicacao.push("A data informada é anterior a data de publicação do edital informada na licitação")
        isValid = false  
      }
      if (dataHomologacao < dataEdital) {
        errors.data_homologacao.push("A data informada é anterior a data de publicação do edital informada na licitação")
        isValid = false  
      }
      if (dataResultado < dataEdital) {
        errors.data_publicacao_resultado.push("A data informada é anterior a data de publicação do edital informada na licitação")
        isValid = false  
      }

      if (actualLicitacao.registro_preco && !data_vigencia) {
        errors.data_vigencia.push("Quando a licitação possui registro de preços é necessário informar a data da vigência")
        isValid = false  
      }
    }

    if(data_anulacao && !motivo_anulacao) {
      errors.motivo_anulacao.push("Existe data de anulação, portanto esse campo é obrigatório")
      isValid = false  
    }
      
    if (dataPublicacaoAnulacao < dataAnulacao) {
      errors.data_publicacao_anulacao.push("A data de publicação não pode ser anterior a data da anulação")
      isValid = false  
    }

    if (dataPublicacaoRevogacao < dataRevogacao || dataPublicacaoRevogacao > dataRevogacao) {
      errors.data_publicacao_revogacao.push("A data da revogação deve ser igual a data da publicação da revogação")
      isValid = false  
    }
    
    if(data_revogacao && !motivo_revogacao) {
      errors.motivo_revogacao.push("Existe data de revogação, portanto esse campo é obrigatório")
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
      data_adjudicacao:  new Date(data_adjudicacao).toISOString(),
      data_homologacao:  new Date(data_homologacao).toISOString(),
      data_publicacao_resultado:  new Date(data_publicacao_resultado).toISOString(),
      homologacao_parcial,
      data_anulacao: !data_anulacao ? null :  new Date(data_anulacao).toISOString(),
      motivo_anulacao,
      data_publicacao_anulacao: !data_publicacao_anulacao ? null :  new Date(data_publicacao_anulacao).toISOString(),
      data_revogacao: !data_revogacao ? null :  new Date(data_revogacao).toISOString(),
      motivo_revogacao,
      data_publicacao_revogacao: !data_publicacao_revogacao ? null :  new Date(data_publicacao_revogacao).toISOString(),
      data_vigencia: !data_vigencia ? null :  new Date(data_vigencia).toISOString(),
      fracassada,
      veiculo_publicacaoId,
      numero_licitacaoId,
    }
    let response: Response;

    if (isEditMode) {
      try{
          response = await fetch('/api/adjudicacao-licitacao/'+encodeURIComponent(initialData.id), {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body),
          });
      } catch(error) {
          console.log("erro no server")
      }
    } else {
      try{
          response = await fetch('/api/adjudicacao-licitacao', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body),
          });
      } catch(error) {
          console.log("erro no server")
      }
    }


    if (response?.ok) {
        setMessage({type:"success", text: `Adjudicacao da licitação ${isEditMode ? 'atualizado' : 'cadastrado'} com sucesso !`})
        // setIsEditMode(true);
        // setPessoaAtual(body);
    } else {
        const error = await response?.json()
        console.log(error)
        setMessage({type:"danger", text: `Ocorreu o seguinte erro ao processar a requisição "${error.error.message}"`})
    }
    NProgress.done()
    if (isEditMode) {
      Router.push('/adjudicacao-licitacao/create').then(() => Router.reload());
    }
    setBlocked(false)
    
  }

  return (
    <Layout>
      <PageTitle>Adjudicação da Licitação</PageTitle>
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

          <SearchableSelect
            items={veiculos}
            label="Veículo de publicação*"
            setValue={(value) => setVeiculoPublicacaoId(parseInt(value))}
            textProp="descricao"
            valueProp="codigo"
            validation={validation.veiculo_publicacaoId}
            value={veiculo_publicacaoId}
          />

          <DefaultInput
            label={"Data da adjudicação*"}
            validation={validation.data_adjudicacao}
            setValue = {(value) => setDataAdjudicacao(value)}
            value = {data_adjudicacao.substring(0, 10)}
            maxLength = {16}
            type="date"
          />

          <DefaultInput
            label={"Data da homologação*"}
            validation={validation.data_homologacao}
            setValue = {(value) => setDataHomologacao(value)}
            value = {data_homologacao.substring(0, 10)}
            maxLength = {16}
            type="date"
          />

          <DefaultInput
            label={"Data da publicação do resultado*"}
            validation={validation.data_publicacao_resultado}
            setValue = {(value) => setDataPublicacaoResultado(value)}
            value = {data_publicacao_resultado.substring(0, 10)}
            maxLength = {16}
            type="date"
          />

          <Label className="mt-4" check>
            <span className="mr-2"> Homologação parcial?*</span>
            <Input type="checkbox" checked={homologacao_parcial} onChange={e => setHomologacaoParcial(e.target.checked)}/>
          </Label>

          <DefaultInput
            label={"Data da anulação"}
            validation={validation.data_anulacao}
            setValue = {(value) => setDataAnulacao(value)}
            value = {data_anulacao && data_anulacao.substring(0, 10)}
            maxLength = {16}
            type="date"
          />

          <DefaultInput
            label={"Data da publicação da anulação"}
            validation={validation.data_publicacao_anulacao}
            setValue = {(value) => setDataPublicacaoAnulacao(value)}
            value = {data_publicacao_anulacao && data_publicacao_anulacao.substring(0, 10)}
            maxLength = {16}
            type="date"
          />

          <DefaultInput
            label={"Data da revogação"}
            validation={validation.data_revogacao}
            setValue = {(value) => setDataRevogacao(value)}
            value = {data_revogacao && data_revogacao.substring(0, 10)}
            maxLength = {16}
            type="date"
          />

          <DefaultInput
            label={"Data da publicação da revogação"}
            validation={validation.data_publicacao_revogacao}
            setValue = {(value) => setDataPublicacaoRevogacao(value)}
            value = {data_publicacao_revogacao && data_publicacao_revogacao.substring(0, 10)}
            maxLength = {16}
            type="date"
          />

          <DefaultInput
            label={"Data da vigência"}
            validation={validation.data_vigencia}
            setValue = {(value) => setDataVigencia(value)}
            value = {data_vigencia && data_vigencia.substring(0, 10)}
            maxLength = {16}
            type="date"
          />

          <Label className="mt-4" check>
            <span className="mr-2"> Fracassada?*</span>
            <Input type="checkbox" checked={fracassada} onChange={e => setFracassada(e.target.checked)}/>
          </Label>

        </div>

        <Label className="mt-4">
          <span>Motivo anulação</span>
          <Textarea rows={3} value = {motivo_anulacao} maxLength={1024} onChange={(e) => setMotivoAnulacao(e.target.value)} className="mt-1" valid={validation.motivo_anulacao.length === 0}  />
          {
            validation.motivo_anulacao &&
            <HelperText valid={false}>{validation.motivo_anulacao.map((v) => {return <p>*{v}</p>})}</HelperText>
          }
        </Label>

        <Label className="mt-4">
          <span>Motivo revogação</span>
          <Textarea rows={3} value = {motivo_revogacao} maxLength={1024} onChange={(e) => setMotivoRevogacao(e.target.value)} className="mt-1" valid={validation.motivo_revogacao.length === 0}  />
          {
            validation.motivo_revogacao &&
            <HelperText valid={false}>{validation.motivo_revogacao.map((v) => {return <p>*{v}</p>})}</HelperText>
          }
        </Label>

        <Button iconLeft={Save} className="mt-4" onClick = {handleSubmit}>Salvar</Button>
      </div>
    </Layout>
  )
}

export default Create;
