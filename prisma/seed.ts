import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

import Adjudicado from "./data/adjudicado";
import Agrupamento from './data/agrupamento';
import CpNaturezaObjeto from "./data/cpnaturezaobjeto";
import CriterioTipoJulgamento from "./data/criteriotipojulgamento";
import Enquadramento from "./data/enquadramento";
import LicitacaoNaturezaObjeto from "./data/licitacaonaturezaobjeto";
import Modalidade from "./data/modalidades";
import NaturezaObra from "./data/naturezaobra";
import ReferenciaLegal from "./data/referencialegal";
import RegimeExecucaoObra from "./data/regimeexecucaoobra";
import VeiculoPublicacao from "./data/veiculopublicacao";


async function main() {

    await Promise.all(
        VeiculoPublicacao.map(async (veiculoPublicacao) => {
            await prisma.veiculoPublicacao.upsert({
                where: {codigo : veiculoPublicacao.codigo},
                update: {},
                create: veiculoPublicacao
            })
        })
    )

    await Promise.all(
        RegimeExecucaoObra.map(async (regimeObra) => {
            await prisma.regimeExecucaoObra.upsert({
                where: {codigo : regimeObra.codigo},
                update: {},
                create: regimeObra
            })
        })
    )

    await Promise.all(
        ReferenciaLegal.map(async (referenciaLegal) => {
            await prisma.referenciaLegal.upsert({
                where: {codigo : referenciaLegal.codigo},
                update: {},
                create: referenciaLegal
            })
        })
    )

    await Promise.all(
        NaturezaObra.map(async (naturezaObra) => {
            await prisma.naturezaObra.upsert({
                where: {codigo : naturezaObra.codigo},
                update: {},
                create: naturezaObra
            })
        })
    )
    
    await Promise.all(
        Modalidade.map(async (modalidade) => {
            await prisma.modalidade.upsert({
                where: {codigo : modalidade.codigo},
                update: {},
                create: modalidade
            })
        })
    )

    await Promise.all(
        LicitacaoNaturezaObjeto.map(async (naturezaOb) => {
            await prisma.licitacaoNaturezaObjeto.upsert({
                where: {codigo : naturezaOb.codigo},
                update: {},
                create: naturezaOb
            })
        })
    )

    await Promise.all(
        Enquadramento.map(async (enquadramento) => {
            await prisma.enquadramento.upsert({
                where: {codigo : enquadramento.codigo},
                update: {},
                create: enquadramento
            })
        })
    )

    await Promise.all(
        Adjudicado.map(async (adjudicado) => {
            await prisma.adjudicado.upsert({
                where: {codigo : adjudicado.codigo},
                update: {},
                create: adjudicado
            })
        })
    )

    await Promise.all(
        Agrupamento.map(async (agrupamento) => {
            await prisma.agrupamento.upsert({
                where: {codigo : agrupamento.codigo},
                update: {},
                create: agrupamento
            })
        })
    )

    await Promise.all(
        CpNaturezaObjeto.map(async (cpobjeto) => {
            await prisma.cpNaturezaObjeto.upsert({
                where: {codigo : cpobjeto.codigo},
                update: {},
                create: cpobjeto
            })
        })
    )

    await Promise.all(
        CriterioTipoJulgamento.map(async (tipo) => {
            await prisma.criterioTipoJulgamento.upsert({
                where: {codigo : tipo.codigo},
                update: {},
                create: tipo
            })
        })
    )
}

main()
  .catch((e) => {
    console.error(`There was an error while seeding: ${e}`);
    process.exit(1);
  })
  .finally(async () => {
    console.log('Successfully seeded database. Closing connection.');
    await prisma.$disconnect();
  });