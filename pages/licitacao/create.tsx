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
import { Licitacao, Message } from "utils/types";
import { GetStaticProps } from "next";
import { Agrupamento, CriterioTipoJulgamento, LicitacaoNaturezaObjeto, Modalidade, NaturezaObra, Proponente, RegimeExecucaoObra, VeiculoPublicacao } from "@prisma/client";
import modalidades from '../../prisma/data/modalidades';
import criterio_tipo_julgamento from "../../prisma/data/criteriotipojulgamento";
import licitacao_natureza_objeto from "../../prisma/data/licitacaonaturezaobjeto";
import agrupamento from '../../prisma/data/agrupamento';
import regime_execucao_obra from "../../prisma/data/regimeexecucaoobra";
import natureza_obra from "../../prisma/data/naturezaobra";
import veiculo_publicacao from "../../prisma/data/veiculopublicacao";
import SelectField from "example/components/SelectField";

NProgress.configure({
    minimum: 0.3,
    easing: 'ease',
    speed: 500,
    showSpinner: false,
});

type Props = {
    initialData: Licitacao,
    pessoas: [Proponente],
    modalidades: [Modalidade],
    criterioJulgamento: [CriterioTipoJulgamento],
    licitacaoNatureza: [LicitacaoNaturezaObjeto],
    agrupamento: [Agrupamento],
    regimeExecucao: [RegimeExecucaoObra],
    naturezaObra: [NaturezaObra],
    veiculoPublicacao: [VeiculoPublicacao]
}

export async function getServerSideProps({ query }) {
    const { numero_licitacao } = query;
    let initialData = null;
    if (numero_licitacao) {
      initialData = await prisma.licitacao.findUnique({
        where: { numero_licitacao},
      });
    }
    const mods = [{codigo:0,descricao:""}].concat(modalidades)
    const julg = [{codigo:0,descricao:""}].concat(criterio_tipo_julgamento)
    const lict = [{codigo:0,descricao:""}].concat(licitacao_natureza_objeto)
    const agrup = [{codigo:0,descricao:""}].concat(agrupamento)
    const reg = [{codigo:0,descricao:""}].concat(regime_execucao_obra)
    const nat = [{codigo:0,descricao:""}].concat(natureza_obra)
    const veic = [{codigo:0,descricao:""}].concat(veiculo_publicacao)
    console.log(initialData)
    return {
      props: {
        initialData: JSON.parse(JSON.stringify(initialData)),
        modalidades: mods,
        criterioJulgamento: julg,
        licitacaoNatureza: lict,
        agrupamento: agrup,
        regimeExecucao: reg,
        naturezaObra: nat,
        veiculoPublicacao: veic,
      },
    };
}  

type Validation = {
  numero_licitacao: [string?],
  cnpj:[string?],
  numero_processo:[string?],
  modalidadeId:[string?],
  criterio_tipo_julgamentoId:[string?],
  natureza_objetoId:[string?],
  agrupamentoId:[string?],
  justificativa_grupo_lote:[string?],
  registro_preco:[string?],
  possui_participantes:[string?],
  objeto:[string?],
  regime_execucao_obraId:[string?],
  natureza_obraId:[string?],
  valor_previsto:[string?],
  valor_maximo:[string?],
  codigo_programa:[string?],
  orcamento_proprio:[string?],
  veiculo_publicacaoId:[string?],
  data_publicacao_edital:[string?],
  garantia:[string?],
}

const Create: React.FC<Props> = ({initialData, modalidades,criterioJulgamento, licitacaoNatureza,agrupamento,regimeExecucao,naturezaObra,veiculoPublicacao}) => {
  
  const [isEditMode, setIsEditMode] = useState(!!initialData)
  const [validation, setValidation] = useState<Validation>({
    numero_licitacao: [],
    cnpj:[],
    numero_processo:[],
    modalidadeId:[],
    criterio_tipo_julgamentoId:[],
    natureza_objetoId:[],
    agrupamentoId:[],
    justificativa_grupo_lote:[],
    registro_preco:[],
    possui_participantes:[],
    objeto:[],
    regime_execucao_obraId:[],
    natureza_obraId:[],
    valor_previsto:[],
    valor_maximo:[],
    codigo_programa:[],
    orcamento_proprio:[],
    veiculo_publicacaoId:[],
    data_publicacao_edital:[],
    garantia:[],
  });
  const [blocked, setBlocked] = useState(false);
  const [message, setMessage] = useState<Message>({
    type: undefined,
    text: ""
  })

  
  const [numero_licitacao, setNumeroLicitacao] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [numero_processo, setNumeroProcesso] = useState("");  
  const [modalidadeId, setModalidadeId] = useState(null);
  const [criterio_tipo_julgamentoId, setCriterioTipoJulgamentoId] = useState("");
  const [natureza_objetoId, setNaturezaObjetoId] = useState(null);
  const [agrupamentoId, setAgrupamentoId] = useState(null);
  const [justificativa_grupo_lote, setJustificativaGrupoLote] = useState("");
  const [registro_preco, setRegistroPreco] = useState(false);
  const [possui_participantes, setPossuiParticipantes] = useState(false);
  const [objeto, setObjeto] = useState("");
  const [regime_execucao_obraId, setRegimeExecucaoObraId] = useState(undefined);
  const [natureza_obraId, setNaturezaObraId] = useState(undefined);
  const [valor_previsto, setValorPrevisto] = useState("");
  const [valor_maximo, setValorMaximo] = useState("");
  const [codigo_programa, setCodigoPrograma] = useState("");
  const [orcamento_proprio, setOrcamentoProprio] = useState(false);
  const [veiculo_publicacaoId, setVeiculoPublicacaoId] = useState(null);
  const [data_publicacao_edital, setDataPublicacaoEdital] = useState("");
  const [garantia, setGarantia] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      setNumeroLicitacao(initialData.numero_licitacao)
      setCnpj(initialData.cnpj)
      setNumeroProcesso(initialData.numero_processo)
      setModalidadeId(initialData.modalidadeId)
      setCriterioTipoJulgamentoId(initialData.criterio_tipo_julgamentoId)
      setNaturezaObjetoId(initialData.natureza_objetoId)
      setAgrupamentoId(initialData.agrupamentoId)
      setJustificativaGrupoLote(initialData.justificativa_grupo_lote)
      setRegistroPreco(initialData.registro_preco)
      setPossuiParticipantes(initialData.possui_participantes)
      setObjeto(initialData.objeto)
      setRegimeExecucaoObraId(initialData.regime_execucao_obraId)
      setNaturezaObraId(initialData.natureza_obraId)
      setValorPrevisto(initialData.valor_previsto)
      setValorMaximo(initialData.valor_maximo)
      setCodigoPrograma(initialData.codigo_programa)
      setOrcamentoProprio(initialData.orcamento_proprio)
      setVeiculoPublicacaoId(initialData.veiculo_publicacaoId)
      setDataPublicacaoEdital(initialData.data_publicacao_edital)
      setGarantia(initialData.garantia)
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
    let errors: Validation = {
      numero_licitacao: [],
      cnpj:[],
      numero_processo:[],
      modalidadeId:[],
      criterio_tipo_julgamentoId:[],
      natureza_objetoId:[],
      agrupamentoId:[],
      justificativa_grupo_lote:[],
      registro_preco:[],
      possui_participantes:[],
      objeto:[],
      regime_execucao_obraId:[],
      natureza_obraId:[],
      valor_previsto:[],
      valor_maximo:[],
      codigo_programa:[],
      orcamento_proprio:[],
      veiculo_publicacaoId:[],
      data_publicacao_edital:[],
      garantia:[],
    }
    let isValid = true;

    if (numero_licitacao === "") {
        errors.numero_licitacao.push("O campo deve ser preenchido")
        isValid = false  
    }
    if (cnpj === "") {
        errors.cnpj.push(`O campo deve ser preenchido`)
        isValid = false
    } else if (cnpj.length != 18){
        errors.cnpj.push("O campo deve ser preenchido por completo")
        isValid = false
    }
    if (numero_processo === "") {
        errors.numero_processo.push("O campo deve ser preenchido")
        isValid = false  
    }
    if (!modalidadeId || modalidadeId === 0) {
        errors.modalidadeId.push("O campo deve ser preenchido")
        isValid = false  
    }
    if (!criterio_tipo_julgamentoId || criterio_tipo_julgamentoId === 0) {
        errors.criterio_tipo_julgamentoId.push("O campo deve ser preenchido")
        isValid = false  
    }
    if (!natureza_objetoId || natureza_objetoId === 0) {
        errors.natureza_objetoId.push("O campo deve ser preenchido")
        isValid = false  
    }
    if (!agrupamentoId || agrupamentoId === 0) {
        errors.agrupamentoId.push("O campo deve ser preenchido")
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
    if (codigo_programa === "") {
        errors.codigo_programa.push("O campo deve ser preenchido")
        isValid = false  
    }
    if (!veiculo_publicacaoId || veiculo_publicacaoId === 0) {
        errors.veiculo_publicacaoId.push("O campo deve ser preenchido")
        isValid = false  
    }
    let date = new Date(data_publicacao_edital)
    
    if (date.getFullYear() < 2000) {
      errors.data_publicacao_edital.push("O campo deve ser preenchido")
    }
    if (agrupamentoId === 2 && !justificativa_grupo_lote) {
        errors.justificativa_grupo_lote.push("A licitação é por Grupo/Lote, portanto deve ter justificativa")
        isValid = false  
    }

    if (registro_preco && (([5,6,7].indexOf(modalidadeId) === -1) || [3,4].indexOf(natureza_objetoId) === -1)) {
        errors.modalidadeId.push("O campo é incompatível com a opção Registro de Preços. As Modalidades permitidas são do tipo 4, Concorrência, 5, Pregão Presencial e 6, Pregão Eletrônico")
        errors.natureza_objetoId.push("O campo é incompatível com a opção Registro de Preços. A Natureza do Objeto deve ser 3, Compras ou 4, Serviços - exceto engenharia.")
        isValid = false  
    }

    if (possui_participantes && !registro_preco){
      errors.registro_preco.push("O processo de compra possui participantes, mas não se trata de um Registro de preços.")
      isValid = false
    }
    if([1,2].indexOf(natureza_objetoId) !== -1 && (!regime_execucao_obraId || regime_execucao_obraId === 0)) {
      errors.regime_execucao_obraId.push("O campo é obrigatório quando a natureza do objeto é 1 - Obras ou 2 - Serviços");
      isValid = false
    }

    if([1,2].indexOf(natureza_objetoId) !== -1 && (!natureza_obraId|| natureza_obraId === 0)) {
      errors.natureza_obraId.push("O campo é obrigatório quando a natureza do objeto é 1 - Obras ou 2 - Serviços");
      isValid = false
    }
    
    if (!valor_maximo){
      setValorMaximo(0.00)
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
    const body = {numero_licitacao,cnpj,numero_processo,modalidadeId,criterio_tipo_julgamentoId,natureza_objetoId,agrupamentoId,justificativa_grupo_lote,registro_preco,possui_participantes,objeto,regime_execucao_obraId,natureza_obraId,valor_previsto,valor_maximo,codigo_programa,orcamento_proprio,veiculo_publicacaoId,data_publicacao_edital: new Date(data_publicacao_edital).toISOString(),garantia}
    let response: Response;

    if (isEditMode) {
      try{
          response = await fetch('/api/licitacao/'+encodeURIComponent(initialData.numero_licitacao), {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body),
          });
      } catch(error) {
          console.log("erro no server")
      }
    } else {
      try{
          response = await fetch('/api/licitacao', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body),
          });
      } catch(error) {
          console.log("erro no server")
      }
    }

    

    if (response?.ok) {
        setMessage({type:"success", text: `Licitação ${isEditMode ? 'atualizada' : 'cadastrada'} com sucesso !`})
        // setIsEditMode(true);
        // setPessoaAtual(body);
    } else {
        const error = await response?.json()
        console.log(error)
        setMessage({type:"danger", text: `Ocorreu o seguinte erro ao processar a requisição "${error.error.message}"`})
    }
    NProgress.done()
    if (isEditMode) {
      Router.push('/licitacao/create').then(() => Router.reload());
    }
    setBlocked(false)
    
  }

  return (
    <Layout>
      <PageTitle>Licitação</PageTitle>
      {
        message.text !== "" &&
        <Alert className="mb-4" type={message.type} onClose={() => setMessage({type: undefined, text:""})}>
          {message.text}
        </Alert>
      }
      
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="grid gap-6 mb-8 md:grid-cols-2">
          <Label className="mt-4">
            <span>Número da Licitação*</span>
            <Input value = {numero_licitacao} maxLength={16} onChange={(e) => setNumeroLicitacao(e.target.value)} className="mt-1" valid={validation.numero_licitacao.length === 0}  />
            {
              validation.numero_licitacao &&
              <HelperText valid={false}>{validation.numero_licitacao.map((v) => {return <p key={v}>*{v}</p>})}</HelperText>
            }
          
          </Label>
          <Label className="mt-4">
            <span>Número do Processo*</span>
            <Input value = {numero_processo} maxLength={32} onChange={(e) => setNumeroProcesso(e.target.value)} className="mt-1" valid={validation.numero_processo.length === 0}  />
            {
              validation.numero_processo &&
              <HelperText valid={false}>{validation.numero_processo.map((v) => {return <p key={v}>*{v}</p>})}</HelperText>
            }
          
          </Label>

          <Label className="mt-4">
            <span>CNPJ*</span>
            <Input value = {cnpj} onChange={(e) => setCnpj(cnpjMask(e.target.value))} className="mt-1" valid={validation.cnpj.length === 0}  />
            {
              validation.cnpj &&
              <HelperText valid={false}>{validation.cnpj.map((v) => {return <p key={v}>*{v}</p>})}</HelperText>
            }
          
          </Label>

          <SelectField 
            label="Modalidade*" 
            items={modalidades} 
            value={modalidadeId}
            validation={validation.modalidadeId} 
            setValue={(value) => setModalidadeId(parseInt(value))}  
            valueProp="codigo" 
            textProp="descricao"
          />
          
          <SelectField 
            label="Criterio de Julgamento*" 
            items={criterioJulgamento} 
            value={criterio_tipo_julgamentoId}
            validation={validation.criterio_tipo_julgamentoId} 
            setValue={(value) => setCriterioTipoJulgamentoId(parseInt(value))}  
            valueProp="codigo" 
            textProp="descricao"
          />

          <SelectField 
            label="Natureza do Objeto*" 
            items={licitacaoNatureza} 
            value={natureza_objetoId}
            validation={validation.natureza_objetoId} 
            setValue={(value) => setNaturezaObjetoId(parseInt(value))}  
            valueProp="codigo" 
            textProp="descricao"
          />

          <SelectField 
            label="Agrupamento*" 
            items={agrupamento} 
            value = {agrupamentoId}
            validation={validation.agrupamentoId} 
            setValue={(value) => setAgrupamentoId(parseInt(value))}  
            valueProp="codigo" 
            textProp="descricao"
          />
          
          <Label className="mt-4">
            <span>Justificativa para Grupo/Lote</span>
            <Input value = {justificativa_grupo_lote} maxLength={255} onChange={(e) => setJustificativaGrupoLote(e.target.value)} className="mt-1" valid={validation.justificativa_grupo_lote.length === 0}  />
            {
              validation.justificativa_grupo_lote &&
              <HelperText valid={false}>{validation.justificativa_grupo_lote.map((v) => {return <p key={v}>*{v}</p>})}</HelperText>
            }
          </Label>

          <Label className="mt-4" check>
            <span className="mr-2"> Registro de Preços?*</span>
            <Input type="checkbox" checked={registro_preco} onChange={e => setRegistroPreco(e.target.checked)}/>
            {
              validation.registro_preco &&
              <div>
                <HelperText valid={false}>{validation.registro_preco.map((v) => {return <p key={v}>*{v}</p>})}</HelperText>
              </div>
            }
          </Label>

          <Label className="mt-4" check>
            <span className="mr-2"> Possui participantes?*</span>
            <Input type="checkbox" checked={possui_participantes} onChange={e => setPossuiParticipantes(e.target.checked)}/>
          </Label>
          
          <SelectField 
            label="Regime de Execução da Obra" 
            items={regimeExecucao} 
            value = {regime_execucao_obraId}
            validation={validation.regime_execucao_obraId} 
            setValue={(value) => setRegimeExecucaoObraId(parseInt(value))}  
            valueProp="codigo" 
            textProp="descricao"
          />

          <SelectField 
            label="Natureza da Obra" 
            items={naturezaObra} 
            value = {natureza_obraId}
            validation={validation.natureza_obraId} 
            setValue={(value) => setNaturezaObraId(parseInt(value))}  
            valueProp="codigo" 
            textProp="descricao"
          />

          <Label className="mt-4">
            <span>Valor Previsto (R$)*</span>
            <Input type="number" placeholder="0.00" value = {valor_previsto} onChange={(e) => setValorPrevisto(parseFloat(e.target.value).toFixed(2))} className="mt-1" valid={validation.valor_previsto.length === 0}  />
            {
              validation.valor_previsto &&
              <HelperText valid={false}>{validation.valor_previsto.map((v) => {return <p key={v}>*{v}</p>})}</HelperText>
            }
          
          </Label>

          <Label className="mt-4">
            <span>Valor Máximo(R$)*</span>
            <Input type="number" placeholder="0.00" value = {valor_maximo} onChange={(e) => setValorMaximo(parseFloat(e.target.value).toFixed(2))} className="mt-1" valid={validation.valor_maximo.length === 0}  />
            {
              validation.valor_maximo &&
              <HelperText valid={false}>{validation.valor_maximo.map((v) => {return <p key={v}>*{v}</p>})}</HelperText>
            }
          </Label>

          

          <Label className="mt-4" check>
            <span className="mr-2"> Orçamento próprio?*</span>
            <Input type="checkbox" checked={orcamento_proprio} onChange={e => setOrcamentoProprio(e.target.checked)}/>
          </Label>
          
          <Label className="mt-4" check>
            <span className="mr-2"> Garantia?*</span>
            <Input type="checkbox" checked={garantia} onChange={e => setGarantia(e.target.checked)}/>
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

          <Label className="mt-4">
            <span>Data de Publicação do Edital*</span>
            <Input type = "date" value = {data_publicacao_edital.substring(0, 10)} onChange={(e) => setDataPublicacaoEdital(e.target.value)} className="mt-1" valid={validation.data_publicacao_edital.length === 0}  />
            {
              validation.data_publicacao_edital &&
              <HelperText valid={false}>{validation.data_publicacao_edital.map((v) => {return <p key={v}>*{v}</p>})}</HelperText>
            }
          
          </Label>

          <Label className="mt-4">
            <span>Código Programa*</span>
            <Input value = {codigo_programa} maxLength={16} onChange={(e) => setCodigoPrograma(e.target.value)} className="mt-1" valid={validation.codigo_programa.length === 0}  />
            {
              validation.codigo_programa &&
              <HelperText valid={false}>{validation.codigo_programa.map((v) => {return <p key={v}>*{v}</p>})}</HelperText>
            }
          
          </Label>

        </div>
          <Label className="mt-4">
            <span>Objeto*</span>
            <Textarea rows={3} value = {objeto} maxLength={1024} onChange={(e) => setObjeto(e.target.value)} className="mt-1" valid={validation.objeto.length === 0}  />
            {
              validation.objeto &&
              <HelperText valid={false}>{validation.objeto.map((v) => {return <p key={v}>*{v}</p>})}</HelperText>
            }
          
          </Label>

        <Button iconLeft={Save} className="mt-4" onClick = {handleSubmit}>Salvar</Button>
      </div>
    </Layout>
  )
}

export default Create;
