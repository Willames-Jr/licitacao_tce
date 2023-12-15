import prisma from "../../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from 'next'
import type { AtaRegistroPreco } from "utils/types";


export default async function handle(req: NextApiRequest,res: NextApiResponse<AtaRegistroPreco>) {
    const id = parseInt(req.query.id.toString());
    const data: AtaRegistroPreco = req.body;

    if (req.method === "DELETE") {
        const ata: AtaRegistroPreco = await prisma.ataRegistroDePreco.delete({
            where: {numero_ata}
        })
        res.json(ata)
        return
    } else if (req.method === "PUT") {
        const ata = await prisma.ataRegistroDePreco.update({
            where: {numero_ata},
            data: data
        })
        res.json(ata);
        return;
    } else {
        throw new Error(
          `The HTTP ${req.method} method is not supported at this route.`,
        );
    }

} 