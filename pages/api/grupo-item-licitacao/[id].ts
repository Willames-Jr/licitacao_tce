import prisma from "../../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from 'next'
import type { GrupoItemLicitacao } from "utils/types";


export default async function handle(req: NextApiRequest,res: NextApiResponse<GrupoItemLicitacao>) {
    const numero_item = parseInt(req.query.id);
    const data: GrupoItemLicitacao = req.body;

    if (req.method === "DELETE") {
        const item: GrupoItemLicitacao = await prisma.grupoLicitacaoItem.delete({
            where: {numero_item}
        })
        res.json(item)
        return
    } else if (req.method === "PUT") {
        const item = await prisma.grupoLicitacaoItem.update({
            where: {numero_item},
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