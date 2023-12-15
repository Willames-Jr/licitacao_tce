import prisma from "../../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Contratacao } from "utils/types";


export default async function handle(req: NextApiRequest,res: NextApiResponse<Contratacao>) {
    const numero_contratacao = req.query.id as string;
    const data: Contratacao = req.body;

    if (req.method === "DELETE") {
        const contratacao: Contratacao = await prisma.contratacaoDireta.delete({
            where: {numero_contratacao: numero_contratacao}
        })
        res.json(contratacao)
        return
    } else if (req.method === "PUT") {
        const contratacao = await prisma.contratacaoDireta.update({
            where: {numero_contratacao},
            data: data
        })
        res.json(contratacao);
        return;
    } else {
        throw new Error(
          `The HTTP ${req.method} method is not supported at this route.`,
        );
    }

} 