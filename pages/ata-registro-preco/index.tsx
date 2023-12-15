import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Table, TableBody, TableCell, TableContainer, TableHeader, TableRow } from "@roketid/windmill-react-ui";
import PageTitle from "example/components/Typography/PageTitle";
import Layout from "example/containers/Layout";
import { Add } from "icons";
import prisma from "lib/prisma";
import MaterialTable from "material-table";
import { GetServerSideProps } from "next";
import Router from "next/router";
import React, { useEffect, useState } from "react";
import MaterialTableIcons from 'example/components/MaterialTableIcons';
import { Delete, DeleteOutline, DeleteOutlined, Edit, EditOutlined, Save } from "@mui/icons-material";
import NProgress from 'nprogress';
import "nprogress/nprogress.css";
import { AtaRegistroPreco } from "utils/types";

NProgress.configure({
    minimum: 0.3,
    easing: 'ease',
    speed: 500,
    showSpinner: false,
});

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const grupos = await prisma.ataRegistroDePreco.findMany({
    include: {
      codigo_beneficiario: true,
      veiculo_publicacao: true
    }
  });    
  return {
    props: { grupos: JSON.parse(JSON.stringify(grupos))  },
  };
};
  
type Props = {
    grupos: [AtaRegistroPreco];
};

const Licitacao: React.FC<Props> = ({grupos}) => {
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  const tableColumns = [
      {
          field: "numero_ata",
          title: "Número da ata",
      },
      {
          field: "numero_licitacaoId",
          title: "Número da Licitação",
      },
      {
          field: "valor",
          title: "Valor",
      },
      {
          field: "descricao",
          title: "Objeto",
      },
      {
          field: "veiculo_publicacao.descricao",
          title: "Veículo de publicação",
      },
      {
          field: "codigo_beneficiario.nome",
          title: "Beneficiário",
      }
  ]

  const handleEdit = (event,rowData) => {
    Router.push({pathname: '/ata-registro-preco/create', query: {numero_ata: rowData.numero_ata}})
  }

  const handleDelete = async () => {
    NProgress.start()
    let response;
    try{
        response = await fetch('/api/ata-registro-preco/'+encodeURIComponent(selectedItem ?? ""), {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });
    } catch(error) {
        console.log("erro no server")
    }
    NProgress.done();
    if (response?.ok) {
        Router.push('/ata-registro-preco/').then(() => {
          Router.reload();
        });
    }
  }

  return (
    <Layout>
      <PageTitle>Atas de registro de preço</PageTitle>
      <div className="flex flex-col flex-wrap mb-8 space-y-4 md:flex-row md:items-end md:space-x-4">
        <Button iconLeft={Add} onClick={() => Router.push("/ata-registro-preco/create")} size="regular">Adicionar</Button>
      </div>

      <div className="mb-8">
                    
      <MaterialTable
        title="Atas de registro de preço"
        icons={MaterialTableIcons}
        columns={tableColumns}
        data={grupos}
        localization={{
          header: {
            actions: "Ações"
          }
        }}
        options={{
          pageSize: 10,
          pageSizeOptions: [5, 10, 20]

        }}
        actions={[
          {
            icon: EditOutlined,
            tooltip: 'Editar ata',
            onClick:  handleEdit
          },
          {
            icon: DeleteOutlined,
            tooltip: 'Deletar ata',
            onClick: (e,rowData) => {setSelectedItem(rowData.numero_item); setIsModalOpen(true);}
          }
        ]}
      />
      </div>      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalHeader>Aviso</ModalHeader>
        <ModalBody>
          Ao deletar o item ele não pode ser recuperado!
        </ModalBody>
        <ModalFooter>
          <div className="hidden sm:block">
            <Button layout="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
          </div>
          <div className="hidden sm:block">
            <Button onClick={handleDelete}>Aceitar</Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large" layout="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button onClick={handleDelete} block size="large">
              Aceitar
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </Layout>
  )
}

export default Licitacao;