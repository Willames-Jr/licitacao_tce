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
import { AdjudicacaoLicitacao } from "utils/types";

NProgress.configure({
    minimum: 0.3,
    easing: 'ease',
    speed: 500,
    showSpinner: false,
});

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  let grupos = await prisma.adjudicacaoLicitacao.findMany({
    include:{
      veiculo_publicacao: true
    }
  });    

  grupos = grupos.map(g => {
    g.data_adjudicacao = `${g.data_adjudicacao.getDay()}/${g.data_adjudicacao.getMonth()}/${g.data_adjudicacao.getFullYear()}`
    g.data_homologacao = `${g.data_homologacao.getDay()}/${g.data_homologacao.getMonth()}/${g.data_homologacao.getFullYear()}`
    return g
  })

  return {
    props: { grupos: JSON.parse(JSON.stringify(grupos))  },
  };
};
  
type Props = {
    items: [AdjudicacaoLicitacao];
};

const Licitacao: React.FC<Props> = ({grupos}) => {
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  const tableColumns = [
      {
          field: "id",
          title: "ID",
      },
      {
          field: "numero_licitacaoId",
          title: "Número da licitação",
      },
      {
          field: "veiculo_publicacao.descricao",
          title: "Veículo de publicação",
      },
      {
          field: "data_adjudicacao",
          title: "Data de adjudicação",
      },
      {
          field: "data_homologacao",
          title: "Data de homologação",
      }
  ]

  const handleEdit = (event,rowData) => {
    Router.push({pathname: '/adjudicacao-licitacao/create', query: {id: rowData.id}})
  }

  const handleDelete = async () => {
    NProgress.start()
    let response;
    try{
        response = await fetch('/api/adjudicacao-licitacao/'+encodeURIComponent(selectedItem ?? ""), {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });
    } catch(error) {
        console.log("erro no server")
    }
    NProgress.done();
    if (response?.ok) {
        Router.push('/adjudicacao-licitacao/').then(() => {
          Router.reload();
        });
    }
  }

  return (
    <Layout>
      <PageTitle>Adjudicação de licitação</PageTitle>
      <div className="flex flex-col flex-wrap mb-8 space-y-4 md:flex-row md:items-end md:space-x-4">
        <Button iconLeft={Add} onClick={() => Router.push("/adjudicacao-licitacao/create")} size="regular">Adicionar</Button>
      </div>

      <div className="mb-8">
                    
      <MaterialTable
        title="Adjudicação de licitação"
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
            tooltip: 'Editar adjudicação',
            onClick:  handleEdit
          },
          {
            icon: DeleteOutlined,
            tooltip: 'Deletar adjudicação',
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