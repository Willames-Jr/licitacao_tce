import prisma from "../../../lib/prisma";
import { Prisma } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { AdjudicacaoLicitacao, HTTPError } from "utils/types";
import LicitacaoModel from "utils/xml/models/licitacao";
import path from 'path'
import JSZip from 'jszip'; // For Node.js
import fs from 'fs';
import archiver from 'archiver';
import ContratacaoModel from "utils/xml/models/contratacao";
import ItemLicitacaoModel from "utils/xml/models/itemlicitacao";

export default async function handle(req: NextApiRequest,res: NextApiResponse<Error | AdjudicacaoLicitacao>) {
    const {mes, codigo, exercicio} = req.body;
    console.log(req.body)
    const dataFolderPath = path.join(process.cwd(), 'data')
    console.log("teste")

    try {
      const zip = new JSZip();

      const licitacoes = await prisma.licitacao.findMany({
        include:{
          agrupamento: true,
          veiculo_publicacao: true,
          modalidade: true,
          natureza_objeto: true,
          natureza_obra: true,
          criterio_tipo_julgamento: true,
          regime_execucao_obra:true
        }
      })
    
      const contratacoes = await prisma.contratacaoDireta.findMany({
        include:{
        }
      })

      const items = await prisma.itemLicitacao.findMany({
        include:{
        }
      })

      const licitacaoModel = new LicitacaoModel(licitacoes,codigo,exercicio,mes, dataFolderPath);
      const contratacaoModel = new ContratacaoModel(contratacoes,codigo,exercicio,mes, dataFolderPath);
      const itemLicitacaoModel = new ItemLicitacaoModel(items,codigo,exercicio,mes, dataFolderPath);
      contratacaoModel.createXml();
      licitacaoModel.createXml();
      itemLicitacaoModel.createXml();
      //const output = fs.createWriteStream(zipFilePath);
      const archive = archiver('zip', {
        zlib: { level: 9 }, // Compression level (0-9)
      });

      archive.on('error', (err) => {
        throw err;
      });

      res.setHeader('Content-Disposition', 'attachment; filename=xmlFiles.zip');
      res.setHeader('Content-Type', 'application/zip');
      archive.pipe(res);
      //archive.pipe(output);

      // Add all XML files from the "data" folder to the ZIP file
      fs.readdirSync(dataFolderPath).forEach((file) => {
        archive.file(path.join(dataFolderPath, file), { name: file });
      });

      archive.finalize();

      //res.status(201).json({ok:"ok"});
    } catch (e) {
      res.status(502).json({
        error: {
          code: "GENERIC_ERROR",
          message: "Ocorreu algum erro no servidor"
        }
      })
      throw e
    }

    

    
}