import prisma from "../../../lib/prisma";
import { Prisma } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { ItemLicitacao, HTTPError } from "utils/types";

export default async function handle(req: NextApiRequest,res: NextApiResponse<Error | ItemLicitacao>) {
    const data:ItemLicitacao = req.body;

    if (data.valor_unitario_estimado === "" || !data.valor_unitario_estimado) {
      data['valor_unitario_estimado'] = 0.0
    }
    
    if (data.quantidade === "" || !data.quantidade) {
      data['quantidade'] = 0.0
    }

    try {
        const result = await prisma.itemLicitacao.create({
            data,
            include:{
              numero_licitacao: true,
              numero_contratacao: true
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