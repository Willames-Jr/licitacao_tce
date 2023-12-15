import prisma from "../../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from 'next'
import type { GrupoLicitacao } from "utils/types";


export default async function handle(req: NextApiRequest,res: NextApiResponse<GrupoLicitacao>) {
    const id = parseInt(req.query.id);
    const data: GrupoLicitacao = req.body;

    if (req.method === "DELETE") {
        const grupo: GrupoLicitacao = await prisma.grupoLicitacao.delete({
            where: {id}
        })
        res.json(grupo)
        return
    } else if (req.method === "PUT") {
        const grupo = await prisma.grupoLicitacao.update({
            where: {id},
            data: data
        })
        res.json(grupo);
        return;
    } else {
        throw new Error(
          `The HTTP ${req.method} method is not supported at this route.`,
        );
    }

} 