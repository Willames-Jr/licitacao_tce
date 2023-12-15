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
import { Contratacao } from "utils/types";

NProgress.configure({
    minimum: 0.3,
    easing: 'ease',
    speed: 500,
    showSpinner: false,
});

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const contratacoes = await prisma.contratacaoDireta.findMany();    
  return {
    props: { contratacoes: JSON.parse(JSON.stringify(contratacoes))  },
  };
};
  
type Props = {
    contratacoes: [Contratacao];
};

const Licitacao: React.FC<Props> = ({contratacoes}) => {
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  const tableColumns = [
      {
          field: "numero_contratacao",
          title: "Número Contratação",
      },
      {
          field: "numero_processo",
          title: "Número processo",
      },
      {
          field: "objeto",
          title: "Objeto",
      },
  ]

  const handleEdit = (event,rowData) => {
    Router.push({pathname: '/contratacao/create', query: {numero_contratacao: rowData.numero_contratacao}})
  }

  const handleDelete = async () => {
    NProgress.start()
    let response;
    try{
        response = await fetch('/api/contratacao/'+encodeURIComponent(selectedItem ?? ""), {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });
    } catch(error) {
        console.log("erro no server")
    }
    NProgress.done();
    if (response?.ok) {
        Router.push('/contratacao/').then(() => {
          Router.reload();
        });
    }
  }

  return (
    <Layout>
      <PageTitle>Contratações diretas</PageTitle>
      <div className="flex flex-col flex-wrap mb-8 space-y-4 md:flex-row md:items-end md:space-x-4">
        <Button iconLeft={Add} onClick={() => Router.push("/contratacao/create")} size="regular">Adicionar</Button>
      </div>

      <div className="mb-8">
                    
      <MaterialTable
        title="Contratações diretas"
        icons={MaterialTableIcons}
        columns={tableColumns}
        data={contratacoes}
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
            tooltip: 'Editar contratação',
            onClick:  handleEdit
          },
          {
            icon: DeleteOutlined,
            tooltip: 'Deletar contratação',
            onClick: (e,rowData) => {setSelectedItem(rowData.numero_contratacao); setIsModalOpen(true);}
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