import prisma from "../../../lib/prisma";
import { Prisma } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { AtaRegistroPreco, HTTPError } from "utils/types";

export default async function handle(req: NextApiRequest,res: NextApiResponse<Error | AtaRegistroPreco>) {
    const data:AtaRegistroPreco = req.body;

    if (!data.valor) {
      data['valor'] = 0.0
    }
    try {
        const result = await prisma.ataRegistroDePreco.create({
            data,
            include:{
              numero_licitacao: true,
              codigo_beneficiario: true,
              veiculo_publicacao: true,
            }
        });
        res.status(201).json(result);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          // The .code property can be accessed in a type-safe manner
          if (e.code === 'P2002') {
            res.status(409).json({error: {
                code: "VALIDATION_FAILED",
                message: "O numero de contrato direto já está sendo utilizado"
            }})
          }
        }
        throw e
    }

    

    
}