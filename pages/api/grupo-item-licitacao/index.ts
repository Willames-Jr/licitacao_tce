import prisma from "../../../lib/prisma";
import { Prisma } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { GrupoItemLicitacao, HTTPError } from "utils/types";

export default async function handle(req: NextApiRequest,res: NextApiResponse<Error | GrupoItemLicitacao>) {
    const data:GrupoItemLicitacao = req.body;
    
    try {
        const result = await prisma.grupoLicitacaoItem.create({
            data,
            include:{
              numero_licitacao: true,
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