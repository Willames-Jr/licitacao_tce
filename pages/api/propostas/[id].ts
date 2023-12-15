import prisma from "../../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Proposta } from "utils/types";


export default async function handle(req: NextApiRequest,res: NextApiResponse<Proposta>) {
    const id = parseInt(req.query.id.toString());
    const data: Proposta = req.body;

    if (req.method === "DELETE") {
        const proposta: Proposta = await prisma.proposta.delete({
            where: {id}
        })
        res.json(proposta)
        return
    } else if (req.method === "PUT") {
        const proposta = await prisma.proposta.update({
            where: {id},
            data: data
        })
        res.json(proposta);
        return;
    } else {
        throw new Error(
          `The HTTP ${req.method} method is not supported at this route.`,
        );
    }

} 