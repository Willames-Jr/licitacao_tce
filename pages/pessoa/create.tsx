import React, { useEffect, useState } from "react";
import prisma from "lib/prisma";
import Layout from "example/containers/Layout";
import PageTitle from "example/components/Typography/PageTitle";
import { Alert, Button, HelperText, Input, Label } from "@roketid/windmill-react-ui";
import SectionTitle from "example/components/Typography/SectionTitle";
import NProgress from 'nprogress';
import "nprogress/nprogress.css";
import { Save } from "@mui/icons-material";
import Router from "next/router";

NProgress.configure({
    minimum: 0.3,
    easing: 'ease',
    speed: 500,
    showSpinner: false,
});

type Props = {
    initialData: {
        nome: string,
        tipo: string,
        codigo: string
    }
}

export async function getServerSideProps({ query }) {
    const { codigo } = query;
    let initialData = null;
    if (codigo) {
      initialData = await prisma.proponente.findUnique({
        where: { codigo: codigo },
      });
    }
  
    return {
      props: {
        initialData,
      },
    };
}  

type Validation = {
  nome: [string?],
  codigo: [string?]
}

type Message = {
  type: "info" | "success" | "danger" | "warning" | "neutral" | undefined,
  text: string
}

const Create: React.FC<Props> = ({initialData}) => {
  
  const [isEditMode, setIsEditMode] = useState(!!initialData)
  const [tipo, setTipo] = useState("física")
  const [codigo, setCodigo] = useState("");
  const [nome, setNome] = useState("");
  const [blocked, setBlocked] = useState(false);
  const [validation, setValidation] = useState<Validation>({
    nome: [],
    codigo: []
  });
  const [message, setMessage] = useState<Message>({
    type: undefined,
    text: ""
  })
  
  useEffect(() => {
    if (isEditMode) {
      setTipo(initialData.tipo)
      setNome(initialData.nome)
      setCodigo(initialData.codigo)
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
  const formatCPF = (value) => {
      // Remove all non-digit characters from the input
      return value
          .replace(/\D/g, '')
          .slice(0, 11)
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

  }

  const handleCodigoChange = (value) => {
      if (tipo === "física") {
          setCodigo(formatCPF(value))
      } else {
          setCodigo(cnpjMask(value))
      }        
  };

  const validFields = () => {
    let errors: Validation = {
      codigo: [],
      nome: []
    }
    let isValid = true;

    if (nome === "") {
        errors.nome.push("O campo nome deve ser preenchido")
        isValid = false  
    }
    if (codigo === "") {
        errors.codigo.push(`O campo CNPJ ou CPF deve ser preenchido`)
        isValid = false
    } else if (codigo.length != 14  && tipo === "física" || codigo.length != 18  && tipo === "juridica"){
        console.log(codigo.length)
        errors.codigo.push("O campo codigo deve ser preenchido por completo")
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
    const body = {codigo, tipo, nome}
    let response: Response;

    if (isEditMode) {
      try{
          response = await fetch('/api/pessoa/'+encodeURIComponent(initialData.codigo), {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body),
          });
      } catch(error) {
          console.log("erro no server")
      }
    } else {
      try{
          response = await fetch('/api/pessoa', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body),
          });
      } catch(error) {
          console.log("erro no server")
      }
    }

    

    if (response?.ok) {
        setMessage({type:"success", text: `Pessoa ${isEditMode ? 'atualizada' : 'cadastrada'} com sucesso !`})
        // setIsEditMode(true);
        // setPessoaAtual(body);
    } else {
        const error = await response?.json()
        console.log(error)
        setMessage({type:"danger", text: `Ocorreu o seguinte erro ao processar a requisição "${error.error.message}"`})
    }
    NProgress.done()
    if (isEditMode) {
      Router.push('/pessoa/create').then(() => Router.reload());
    }
    setBlocked(false)
    
  }

  return (
    <Layout>
      <PageTitle>Pessoa</PageTitle>
      {
        message.text !== "" &&
        <Alert className="mb-4" type={message.type} onClose={() => setMessage({type: undefined, text:""})}>
          {message.text}
        </Alert>
      }
      
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <Label className="mt-4">
          <span>Nome</span>
          <Input value = {nome} onChange={(e) => setNome(e.target.value)} className="mt-1" valid={validation.nome.length === 0}  />
          {
            validation.nome &&
            <HelperText valid={false}>{validation.nome}</HelperText>
          }
          
        </Label>

        <div className="mt-4">
          {/* TODO: Check if this label is accessible, or fallback */}
          {/* <span className="text-sm text-gray-700 dark:text-gray-400">Account Type</span> */}
          <Label>Tipo</Label>
          <div className="mt-2">
            <Label radio>
              <Input defaultChecked = {tipo === "física"} type="radio" value="física" name="tipo" onClick={() => {setTipo("física"); setCodigo("")}}/>
              <span className="ml-2">Física</span>
            </Label>
            <Label className="ml-6" radio>
              <Input defaultChecked = {tipo === "jurídica"} type="radio" value="jurídica" name="tipo" onClick={() => {setTipo("jurídica"); setCodigo("")}}/>
              <span className="ml-2">Jurídica</span>
            </Label>
          </div>
        </div>

        <Label className="mt-4">
          <span>
            {
              tipo === "física" ?
              "CPF" : "CNPJ"
            }
          </span>
          <Input valid = {validation.codigo.length === 0} value={codigo} onChange={(e) => handleCodigoChange(e.target.value)} className="mt-1"/>
          {
            validation.codigo &&
            <HelperText valid={false}>{validation.codigo}</HelperText>      
          }
        </Label>  

        <Button iconLeft={Save} className="mt-4" onClick = {handleSubmit}>Salvar</Button>
      </div>
    </Layout>
  )
}

export default Create;
