import prisma from "../../../lib/prisma";
import { Prisma } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Licitacao, HTTPError } from "utils/types";

export default async function handle(req: NextApiRequest,res: NextApiResponse<Error | Licitacao>) {
    const data:Licitacao = req.body;
    let isObra = false;

    if (data.valor_maximo === "" || !data.valor_maximo) {
      data['valor_maximo'] = 0.0
    }
    if (data.natureza_obraId === 0 || data.natureza_obraId === "" || !data.natureza_obraId) { 
      data.natureza_obraId = null;
      isObra = true;
    }
    if (data.regime_execucao_obraId === 0 || data.regime_execucao_obraId === "" || !data.regime_execucao_obraId) { 
      data.regime_execucao_obraId = null
      isObra = true;
    }
    try {
        const result = await prisma.licitacao.create({
            data,
            include:{
              agrupamento: true,
              modalidade: true,
              criterio_tipo_julgamento: true,
              natureza_objeto: true,
              regime_execucao_obra: true,
              natureza_obra: true,
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
                message: "O numero de licitação já está sendo utilizado"
            }})
          }
        }
        throw e
    }

    

    
}