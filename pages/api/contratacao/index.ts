import prisma from "../../../lib/prisma";
import { Prisma } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Contratacao, HTTPError } from "utils/types";

export default async function handle(req: NextApiRequest,res: NextApiResponse<Error | Contratacao>) {
    const data:Contratacao = req.body;

    if (data.valor_previsto=== "" || !data.valor_previsto) {
      data['valor_previsto'] = 0.0
    }
    try {
        const result = await prisma.contratacaoDireta.create({
            data,
            include:{
              enquadramento: true,
              referencia_legal: true,
              natureza_objeto: true,
              veiculo_publicacao: true
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