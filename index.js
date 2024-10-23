const Alexa = require('ask-sdk-core');

// Handler para iniciar a interação

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speechText = 'Olá! Vou te ajudar a lembrar de tomar seu remédio. Qual o nome do remédio que você está tomando?';
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};


// Handler para configurar o medicamento
const SetMedicationReminderIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
               Alexa.getIntentName(handlerInput.requestEnvelope) === 'SetMedicationReminderIntent';
    },
    handle(handlerInput) {
    const medication = handlerInput.requestEnvelope.request.intent.slots.medication.value;
	
        const speechText = `Perfeito! Vou te lembrar de tomar ${medication}. Qual o horário você quer ser lembrado de tomar ${medication}`;

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt()
            .getResponse();
    }
};

// Handler para criar o lembrete do medicamento 
const CreateReminderIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
               Alexa.getIntentName(handlerInput.requestEnvelope) === 'CreateReminderIntent';
    },
    handle(handlerInput) {
    const time = handlerInput.requestEnvelope.request.intent.slots.time.value;

        const speechText = `Ok, lembrete criado para ${time}`;

        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};


// Handler para erros
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`Erro encontrado: ${error.message}`);
        
        const speechText = 'Ocorreu um erro, diga novamente o nome do seu remédio';
    
        return handlerInput.responseBuilder
            .speak(speechText)           // Fala que informa o erro
            .reprompt()       // Reprompt para manter a sessão ativa
            .getResponse();
    }
};


// Configuração do Lambda
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        CreateReminderIntentHandler,
        SetMedicationReminderIntentHandler
    )
    .withApiClient(new Alexa.DefaultApiClient())
    .addErrorHandlers(ErrorHandler)
    .lambda();
