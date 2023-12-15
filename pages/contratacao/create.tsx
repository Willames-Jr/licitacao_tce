import React, { useEffect, useState } from "react";
import prisma from "lib/prisma";
import Layout from "example/containers/Layout";
import PageTitle from "example/components/Typography/PageTitle";
import { Alert, Button, HelperText, Input, Label, Select, Textarea } from "@roketid/windmill-react-ui";
import SectionTitle from "example/components/Typography/SectionTitle";
import NProgress from 'nprogress';
import "nprogress/nprogress.css";
import { Save } from "@mui/icons-material";
import Router from "next/router";
import { Contratacao, ContratacaoValidation, Message } from "utils/types";
import { GetStaticProps } from "next";
import { Agrupamento, CpNaturezaObjeto, CriterioTipoJulgamento, Enquadramento, LicitacaoNaturezaObjeto, Modalidade, NaturezaObra, Proponente, ReferenciaLegal, RegimeExecucaoObra, VeiculoPublicacao } from "@prisma/client";
import enquadramento from "prisma/data/enquadramento";
import referencialegal from "prisma/data/referencialegal";
import cpnaturezaobjeto from "prisma/data/cpnaturezaobjeto";
import veiculopublicacao from "prisma/data/veiculopublicacao";
import SelectField from "example/components/SelectField";
import DefaultInput from "example/components/DefaultInput";

NProgress.configure({
    minimum: 0.3,
    easing: 'ease',
    speed: 500,
    showSpinner: false,
});

type Props = {
    initialData: Contratacao,
    enquadramento: [Enquadramento],
    referenciaLegal: [ReferenciaLegal],
    cpNaturezaObjeto: [CpNaturezaObjeto],
    veiculoPublicacao: [VeiculoPublicacao]
}

export async function getServerSideProps({ query }) {
    const { numero_contratacao } = query;
    let initialData = null;
    if (numero_contratacao) {
      initialData = await prisma.contratacaoDireta.findUnique({
        where: { numero_contratacao },
      });
    }
    
    const vei = [{codigo:0,descricao:""}].concat(veiculopublicacao)
    const enq = [{codigo:0,descricao:""}].concat(enquadramento)
    const ref = [{codigo:0,descricao:""}].concat(referencialegal)
    const cpn = [{codigo:0,descricao:""}].concat(cpnaturezaobjeto)
  
    return {
      props: {
        initialData: JSON.parse(JSON.stringify(initialData)),
        veiculoPublicacao: vei,
        enquadramento: enq,
        referenciaLegal: ref,
        cpNaturezaObjeto: cpn
      },
    };
}  


const Create: React.FC<Props> = ({initialData, enquadramento, cpNaturezaObjeto, referenciaLegal, veiculoPublicacao}) => {
  
  const [isEditMode, setIsEditMode] = useState(!!initialData)
  const [validation, setValidation] = useState<ContratacaoValidation>({
      numero_contratacao:     [],
      cnpj:                   [],
      numero_processo:        [],
      enquadramentoId:        [],
      referencia_legalId:     [],
      natureza_objetoId:      [],
      objeto:                 [],
      valor_previsto:         [],
      codigo_programa:        [],
      orcamento_proprio:      [],
      veiculo_publicacaoId:   [],
      data_publicacao:        [],
      data_publicacao_edital: [],
      documento_juridico:     [],
  });
  const [blocked, setBlocked] = useState(false);
  const [message, setMessage] = useState<Message>({
    type: undefined,
    text: ""
  })
  
  
  const [numero_contratacao,setNumeroContratacao] = useState("");
  const [cnpj,setCnpj] = useState("");
  const [numero_processo,setNumeroProcesso] = useState("");
  const [enquadramentoId,setEnquadramentoId] = useState(null);
  const [referencia_legalId,setReferenciaLegalId] = useState(null);
  const [natureza_objetoId,setNaturezaObjetoId] = useState("");
  const [objeto,setObjeto] = useState("");
  const [valor_previsto,setValorPrevisto] = useState("");
  const [codigo_programa,setCodigoPrograma] = useState("");
  const [orcamento_proprio,setOrcamentoProprio] = useState(false);
  const [veiculo_publicacaoId,setVeiculoPublicacaoId] = useState("");
  const [data_publicacao,setDataPublicacao] = useState("");
  const [data_publicacao_edital,setDataPublicacaoEdital] = useState("");
  const [documento_juridico,setDocumentoJuridico] = useState("");
  
  useEffect(() => {
    if (isEditMode) {
      setNumeroContratacao(initialData.numero_contratacao)
      setCnpj(initialData.cnpj)
      setNumeroProcesso(initialData.numero_processo)
      setEnquadramentoId(initialData.enquadramentoId)
      setReferenciaLegalId(initialData.referencia_legalId)
      setNaturezaObjetoId(initialData.natureza_objetoId)
      setObjeto(initialData.objeto)
      setValorPrevisto(initialData.valor_previsto)
      setCodigoPrograma(initialData.codigo_programa)
      setOrcamentoProprio(initialData.orcamento_proprio)
      setVeiculoPublicacaoId(initialData.veiculo_publicacaoId)
      setDataPublicacao(initialData.data_publicacao)
      setDataPublicacaoEdital(initialData.data_publicacao_edital)
      setDocumentoJuridico(initialData.documento_juridico)
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
    let errors: ContratacaoValidation = {
      numero_contratacao:     [],
      cnpj:                   [],
      numero_processo:        [],
      enquadramentoId:        [],
      referencia_legalId:     [],
      natureza_objetoId:      [],
      objeto:                 [],
      valor_previsto:         [],
      codigo_programa:        [],
      orcamento_proprio:      [],
      veiculo_publicacaoId:   [],
      data_publicacao:        [],
      data_publicacao_edital: [],
      documento_juridico:     [],
    }
    let isValid = true;

    if (numero_contratacao === "") {
        errors.numero_contratacao.push("O campo deve ser preenchido")
        isValid = false  
    }
    if (cnpj === "") {
        errors.cnpj.push("O campo deve ser preenchido")
        isValid = false  
    } else if (cnpj.length != 18){
        errors.cnpj.push("O campo deve ser preenchido por completo")
        isValid = false
    }
    if (!enquadramentoId || enquadramentoId === 0) {
        errors.enquadramentoId.push("O campo deve ser preenchido")
        isValid = false  
    }
    if (!referencia_legalId || referencia_legalId === 0) {
        errors.referencia_legalId.push("O campo deve ser preenchido")
        isValid = false  
    }
    if (!natureza_objetoId || natureza_objetoId === 0) {
        errors.natureza_objetoId.push("O campo deve ser preenchido")
        isValid = false  
    }
    if (objeto === "") {
        errors.objeto.push("O campo deve ser preenchido")
        isValid = false  
    }
    if (valor_previsto === "" || valor_previsto === "0.00") {
        errors.valor_previsto.push("O campo deve ser preenchido")
        isValid = false  
    }
    if (!veiculo_publicacaoId || veiculo_publicacaoId === 0) {
        errors.veiculo_publicacaoId.push("O campo deve ser preenchido")
        isValid = false  
    }
    if (documento_juridico === "") {
        errors.documento_juridico.push("O campo deve ser preenchido")
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
      numero_contratacao,
      cnpj,
      numero_processo,
      enquadramentoId,
      referencia_legalId,
      natureza_objetoId,
      objeto,
      valor_previsto,
      codigo_programa,
      orcamento_proprio,
      veiculo_publicacaoId,
      data_publicacao:  new Date(data_publicacao).toISOString(),
      data_publicacao_edital: new Date(data_publicacao_edital).toISOString(),
      documento_juridico,
    }
    let response: Response;

    if (isEditMode) {
      try{
          response = await fetch('/api/contratacao/'+encodeURIComponent(initialData.numero_contratacao), {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body),
          });
      } catch(error) {
          console.log("erro no server")
      }
    } else {
      try{
          response = await fetch('/api/contratacao', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body),
          });
      } catch(error) {
          console.log("erro no server")
      }
    }


    if (response?.ok) {
        setMessage({type:"success", text: `Contratação direta ${isEditMode ? 'atualizada' : 'cadastrada'} com sucesso !`})
        // setIsEditMode(true);
        // setPessoaAtual(body);
    } else {
        const error = await response?.json()
        console.log(error)
        setMessage({type:"danger", text: `Ocorreu o seguinte erro ao processar a requisição "${error.error.message}"`})
    }
    NProgress.done()
    if (isEditMode) {
      Router.push('/contratacao/create').then(() => Router.reload());
    }
    setBlocked(false)
    
  }

  return (
    <Layout>
      <PageTitle>Contratação Direta</PageTitle>
      {
        message.text !== "" &&
        <Alert className="mb-4" type={message.type} onClose={() => setMessage({type: undefined, text:""})}>
          {message.text}
        </Alert>
      }
      
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="grid gap-6 mb-8 md:grid-cols-2">

          <DefaultInput
            label={"Número da contratação*"}
            validation={validation.numero_contratacao}
            setValue = {(value) => setNumeroContratacao(value)}
            value = {numero_contratacao}
            maxLength = {16}
          />

          <DefaultInput
            label={"CNPJ*"}
            validation={validation.cnpj}
            setValue = {(value) => setCnpj(cnpjMask(value))}
            value = {cnpj}
            maxLength = {19}
          />

          <DefaultInput
            label={"Número do processo*"}
            validation={validation.numero_processo}
            setValue = {(value) => setNumeroProcesso(value)}
            value = {numero_processo}
            maxLength = {32}
          />

          <SelectField 
            label="Enquadramento*" 
            items={enquadramento} 
            value = {enquadramentoId}
            validation={validation.enquadramentoId} 
            setValue={(value) => setEnquadramentoId(parseInt(value))}  
            valueProp="codigo" 
            textProp="descricao"
          />

          <SelectField 
            label="Referência legal*" 
            items={referenciaLegal} 
            value = {referencia_legalId}
            validation={validation.referencia_legalId} 
            setValue={(value) => setReferenciaLegalId(parseInt(value))}  
            valueProp="codigo" 
            textProp="descricao"
          />

          <SelectField 
            label="Natureza do objeto*" 
            items={cpNaturezaObjeto} 
            value = {natureza_objetoId}
            validation={validation.natureza_objetoId} 
            setValue={(value) => setNaturezaObjetoId(parseInt(value))}  
            valueProp="codigo" 
            textProp="descricao"
          />

          <DefaultInput
            label={"Valor previsto*"}
            validation={validation.valor_previsto}
            setValue = {(value) => setValorPrevisto(parseFloat(value).toFixed(2))}
            value = {valor_previsto}
            maxLength = {32}
            type="number"
          />

          <DefaultInput
            label={"Dotação"}
            validation={validation.codigo_programa}
            setValue = {(value) => setCodigoPrograma(value)}
            value = {codigo_programa}
            maxLength = {16}
          />

          <Label className="mt-4" check>
            <span className="mr-2"> Orçamento próprio?*</span>
            <Input type="checkbox" checked={orcamento_proprio} onChange={e => setOrcamentoProprio(e.target.checked)}/>
          </Label>

          <SelectField 
            label="Veiculo de Publicação do Edital*" 
            items={veiculoPublicacao} 
            value = {veiculo_publicacaoId}
            validation={validation.veiculo_publicacaoId} 
            setValue={(value) => setVeiculoPublicacaoId(parseInt(value))}  
            valueProp="codigo" 
            textProp="descricao"
          />

          <DefaultInput
            label={"Data de publicação"}
            validation={validation.data_publicacao_edital}
            setValue = {(value) => {setDataPublicacaoEdital(value);setDataPublicacao(value)}}
            value = {data_publicacao_edital}
            maxLength = {16}
            type="date"
          />
  
        </div>
          <Label className="mt-4">
            <span>Objeto*</span>
            <Textarea rows={3} value = {objeto} maxLength={1024} onChange={(e) => setObjeto(e.target.value)} className="mt-1" valid={validation.objeto.length === 0}  />
            {
              validation.objeto &&
              <HelperText valid={false}>{validation.objeto.map((v) => {return <p>*{v}</p>})}</HelperText>
            }
          
          </Label>
          
          <Label className="mt-4">
            <span>Parecer jurídico*</span>
            <Textarea rows={3} value = {documento_juridico} maxLength={1024} onChange={(e) => setDocumentoJuridico(e.target.value)} className="mt-1" valid={validation.objeto.length === 0}  />
            {
              validation.documento_juridico &&
              <HelperText valid={false}>{validation.documento_juridico.map((v) => {return <p>*{v}</p>})}</HelperText>
            }
          
          </Label>

        <Button iconLeft={Save} className="mt-4" onClick = {handleSubmit}>Salvar</Button>
      </div>
    </Layout>
  )
}

export default Create;
