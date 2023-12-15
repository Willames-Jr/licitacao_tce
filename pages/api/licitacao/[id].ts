import prisma from "../../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Licitacao } from "utils/types";


export default async function handle(req: NextApiRequest,res: NextApiResponse<Licitacao>) {
    const numero_licitacao = req.query.id as string;
    const data: Licitacao = req.body;

    if (req.method === "DELETE") {
        const licitacao: Licitacao = await prisma.licitacao.delete({
            where: {numero_licitacao: numero_licitacao}
        })
        res.json(licitacao)
        return
    } else if (req.method === "PUT") {
        const licitacao = await prisma.licitacao.update({
            where: {numero_licitacao},
            data: data
        })
        res.json(licitacao);
        return;
    } else {
        throw new Error(
          `The HTTP ${req.method} method is not supported at this route.`,
        );
    }

} 