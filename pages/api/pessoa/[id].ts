import prisma from "../../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from 'next'
type Data = {
  codigo: string,
  tipo: string,
  nome: string
}

export default async function handle(req: NextApiRequest,res: NextApiResponse<Data>) {
    const proponenteId = req.query.id;
    const {codigo, tipo, nome} = req.body;

    if (req.method === "DELETE") {
        const proponente = await prisma.proponente.delete({
            where: {codigo: proponenteId}
        })
        res.json(proponente)
        return
    } else if (req.method === "PUT") {
        // TODO: Conferir o client
        console.log(proponenteId)
        console.log(req.body)
        const proponente = await prisma.proponente.update({
            where: {codigo: proponenteId},
            data: {codigo,nome, tipo}
        })
        res.json(proponente);
        return;
    } else {
        throw new Error(
          `The HTTP ${req.method} method is not supported at this route.`,
        );
    }

} 