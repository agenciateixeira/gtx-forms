// src/pages/api/enviar-lead.js
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
    await doc.loadInfo();

    // Pegar a primeira aba da planilha
    const sheet = doc.sheetsByIndex[0];
    
    if (!sheet) {
      return res.status(500).json({ error: 'Planilha não encontrada' });
    }

    // Adicionar linha
    await sheet.addRow({
      'Data/Hora': new Date().toLocaleString('pt-BR'),
      'Nome': req.body.nome,
      'Email': req.body.email,
      'Telefone': req.body.telefone,
      'Empresa': req.body.empresa,
      'CNPJ': req.body.cnpj,
      'Cargo': req.body.cargo,
      'Faturamento': req.body.faturamento,
      'Investe em Anúncios': req.body.investeEmAnuncios,
      'Valor Investimento': req.body.valorInvestimento || 'R$ 0',
      'Tempo para Início': req.body.tempoInicio,
      'Expectativa': req.body.expectativa,
      'NPS (Dificuldade)': req.body.nps,
      'Data Agendamento': req.body.dataAgendamento,
      'Horário Agendamento': req.body.horarioAgendamento
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Erro completo:', error);
    return res.status(500).json({ 
      error: 'Erro ao enviar dados', 
      details: error.message 
    });
  }
}