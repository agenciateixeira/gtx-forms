import React, { useState } from 'react';
import { Calendar, Clock, User, Mail, Phone, Building2, DollarSign, Target, ArrowRight, CheckCircle, FileText, BarChart, Briefcase, Star } from 'lucide-react';

const FormConsultoria = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    empresa: '',
    cnpj: '',
    cargo: '',
    faturamento: '',
    investeEmAnuncios: '',
    valorInvestimento: '',
    tempoInicio: '',
    expectativa: '',
    nps: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatCNPJ = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 18);
  };

  const handleCNPJChange = (e) => {
    const formatted = formatCNPJ(e.target.value);
    setFormData(prev => ({ ...prev, cnpj: formatted }));
  };

  const formatPhone = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 15);
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    setFormData(prev => ({ ...prev, telefone: formatted }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    setLoading(true);

    const dataToSend = {
      ...formData,
      dataAgendamento: selectedDate,
      horarioAgendamento: selectedTime,
      dataPreenchimento: new Date().toISOString()
    };

    try {
      // Enviar para API do Google Sheets
      const response = await fetch('/api/enviar-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });

      if (response.ok) {
        // Tracking
        if (typeof window !== 'undefined' && window.fbq) {
          window.fbq('track', 'Lead', {
            content_name: 'Formulário Consultoria Completo',
            value: 1000,
            currency: 'BRL'
          });
        }
        
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'conversion', {
            send_to: 'AW-16834266345',
            value: 1000,
            currency: 'BRL'
          });
        }

        setLoading(false);
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Erro ao enviar:', error);
      setLoading(false);
      alert('Erro ao enviar formulário. Por favor, tente novamente.');
    }
  };

  const isStepValid = () => {
    switch(step) {
      case 1: return formData.nome && formData.email && formData.telefone;
      case 2: return formData.empresa && formData.cnpj && formData.cargo && formData.faturamento;
      case 3: return formData.investeEmAnuncios && (formData.investeEmAnuncios === 'nao' || formData.valorInvestimento);
      case 4: return formData.tempoInicio && formData.expectativa;
      case 5: return formData.nps > 0;
      case 6: return selectedDate && selectedTime;
      default: return true;
    }
  };

  // Gerar dias da semana (próximos 14 dias úteis)
  const getAvailableDates = () => {
    const dates = [];
    let current = new Date();
    
    while (dates.length < 14) {
      current.setDate(current.getDate() + 1);
      const day = current.getDay();
      if (day !== 0 && day !== 6) { // Não é sábado nem domingo
        dates.push(new Date(current));
      }
    }
    return dates;
  };

  const availableDates = getAvailableDates();
  const availableTimes = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Agendamento Confirmado!
          </h2>
          <p className="text-gray-600 mb-6">
            Sua consultoria foi agendada para <strong>{selectedDate}</strong> às <strong>{selectedTime}</strong>.
          </p>
          <p className="text-gray-600 mb-8">
            Você receberá um e-mail de confirmação em breve e entraremos em contato via WhatsApp.
          </p>
          <a 
            href="https://agenciagtx.com.br" 
            className="inline-block bg-green-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-600 transition-all"
          >
            Voltar ao Site
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <img 
            src="/images/logo.png" 
            alt="GTX Marketing" 
            className="h-12 mx-auto mb-6"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <div style={{display: 'none'}} className="text-3xl font-bold text-green-600 mb-6">GTX</div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Consultoria Gratuita
          </h1>
          <p className="text-xl text-gray-600">
            Preencha o formulário e agende sua análise completa
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <div
                key={num}
                className={`h-2 rounded-full transition-all ${
                  step >= num ? 'bg-green-500 w-12' : 'bg-gray-200 w-8'
                }`}
              />
            ))}
          </div>
          <p className="text-center text-sm text-gray-600">
            Etapa {step} de 6
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          
          {/* Step 1 - Dados Pessoais */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Dados Pessoais</h2>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                    placeholder="João Silva"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  E-mail *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                    placeholder="joao@empresa.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  WhatsApp *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handlePhoneChange}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                    placeholder="(19) 99999-9999"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2 - Empresa */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Informações da Empresa</h2>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome da Empresa *
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="empresa"
                    value={formData.empresa}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                    placeholder="Minha Empresa Ltda"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  CNPJ *
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="cnpj"
                    value={formData.cnpj}
                    onChange={handleCNPJChange}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                    placeholder="00.000.000/0000-00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Seu Cargo *
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="cargo"
                    value={formData.cargo}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                    placeholder="CEO, Diretor, Gerente..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Faturamento Mensal *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    name="faturamento"
                    value={formData.faturamento}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors appearance-none"
                  >
                    <option value="">Selecione</option>
                    <option value="50k-100k">R$ 50.000 até R$ 100.000/mês</option>
                    <option value="100k-500k">R$ 100.000 até R$ 500.000/mês</option>
                    <option value="500k+">Acima de R$ 500.000/mês</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3 - Investimento em Anúncios */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Investimento em Marketing</h2>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Já investe em anúncios online? *
                </label>
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, investeEmAnuncios: 'sim' }))}
                    className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                      formData.investeEmAnuncios === 'sim'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        formData.investeEmAnuncios === 'sim' ? 'border-green-500' : 'border-gray-300'
                      }`}>
                        {formData.investeEmAnuncios === 'sim' && (
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        )}
                      </div>
                      <span className="font-semibold">Sim, já invisto em anúncios</span>
                    </div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, investeEmAnuncios: 'nao', valorInvestimento: '0' }))}
                    className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                      formData.investeEmAnuncios === 'nao'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        formData.investeEmAnuncios === 'nao' ? 'border-green-500' : 'border-gray-300'
                      }`}>
                        {formData.investeEmAnuncios === 'nao' && (
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        )}
                      </div>
                      <span className="font-semibold">Não, ainda não invisto</span>
                    </div>
                  </button>
                </div>
              </div>

              {formData.investeEmAnuncios === 'sim' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Quanto investe por mês? *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="valorInvestimento"
                      value={formData.valorInvestimento}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                      placeholder="Ex: 5000"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Digite apenas números (ex: 5000 para R$ 5.000)</p>
                </div>
              )}
            </div>
          )}

          {/* Step 4 - Expectativas */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Sobre o Projeto</h2>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quando pretende iniciar? *
                </label>
                <select
                  name="tempoInicio"
                  value={formData.tempoInicio}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                >
                  <option value="">Selecione</option>
                  <option value="imediato">Imediatamente</option>
                  <option value="15dias">Até 15 dias</option>
                  <option value="30dias">Até 30 dias</option>
                  <option value="60dias">Até 60 dias</option>
                  <option value="depois">Mais de 60 dias</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  O que espera da consultoria gratuita? *
                </label>
                <div className="relative">
                  <Target className="absolute left-3 top-4 text-gray-400 w-5 h-5" />
                  <textarea
                    name="expectativa"
                    value={formData.expectativa}
                    onChange={handleChange}
                    rows="4"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                    placeholder="Descreva seus objetivos, desafios e o que espera alcançar..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5 - NPS */}
          {step === 5 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Avaliação do Formulário</h2>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Qual foi o nível de dificuldade para preencher este formulário? *
                </label>
                <p className="text-sm text-gray-600 mb-6">
                  De 1 (muito difícil) a 5 (muito fácil)
                </p>
                <div className="flex justify-between gap-3">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, nps: num }))}
                      className={`flex-1 p-6 border-2 rounded-lg transition-all hover:scale-105 ${
                        formData.nps === num
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Star 
                          className={`w-8 h-8 ${
                            formData.nps === num ? 'fill-green-500 text-green-500' : 'text-gray-400'
                          }`}
                        />
                        <span className="text-2xl font-bold">{num}</span>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>Muito Difícil</span>
                  <span>Muito Fácil</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 6 - Agendamento */}
          {step === 6 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Escolha Data e Horário</h2>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Selecione um dia *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                  {availableDates.map((date, index) => {
                    const dateStr = date.toLocaleDateString('pt-BR', { 
                      weekday: 'short', 
                      day: '2-digit', 
                      month: 'short' 
                    });
                    const fullDate = date.toLocaleDateString('pt-BR');
                    
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setSelectedDate(fullDate)}
                        className={`p-3 border-2 rounded-lg text-sm transition-all ${
                          selectedDate === fullDate
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-green-300'
                        }`}
                      >
                        <div className="font-semibold capitalize">{dateStr}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedDate && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Selecione um horário *
                  </label>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {availableTimes.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={`p-3 border-2 rounded-lg transition-all ${
                          selectedTime === time
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-green-300'
                        }`}
                      >
                        <Clock className="w-4 h-4 mx-auto mb-1 text-gray-400" />
                        <div className="text-sm font-semibold">{time}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedDate && selectedTime && (
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mt-4">
                  <p className="text-center text-gray-700">
                    <strong>Agendamento:</strong> {selectedDate} às {selectedTime}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-4 mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
              >
                Voltar
              </button>
            )}
            
            {step < 6 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={!isStepValid()}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                  isStepValid()
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Próximo
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isStepValid() || loading}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                  isStepValid() && !loading
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    Confirmar Agendamento
                    <CheckCircle className="w-5 h-5" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormConsultoria;