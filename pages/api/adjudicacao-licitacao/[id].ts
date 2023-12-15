import prisma from "../../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from 'next'
import type { AdjudicacaoLicitacao } from "utils/types";


export default async function handle(req: NextApiRequest,res: NextApiResponse<AdjudicacaoLicitacao>) {
    const id = parseInt(req.query.id as string);
    const data: AdjudicacaoLicitacao = req.body;

    if (req.method === "DELETE") {
        const item: AdjudicacaoLicitacao = await prisma.adjudicacaoLicitacao.delete({
            where: {id}
        })
        res.json(item)
        return
    } else if (req.method === "PUT") {
        const item = await prisma.adjudicacaoLicitacao.update({
            where: {id},
            data: data
        })
        res.json(item);
        return;
    } else {
        throw new Error(
          `The HTTP ${req.method} method is not supported at this route.`,
        );
    }

} 