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
    handlerInput.attributesManager.setSessionAttributes({ "medication": medication });
	
        const speechText = `Perfeito! Vou te lembrar de tomar ${medication}. Qual a dosagem de ${medication}?`;

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt()
            .getResponse();
    }
};

const InformDosageMedicationIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
               Alexa.getIntentName(handlerInput.requestEnvelope) === 'InformDosageMedicationIntent';
    },
    handle(handlerInput) {
    
    const dosage = handlerInput.requestEnvelope.request.intent.slots.dosage.value;
    
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    const medication = sessionAttributes.medication;
    
        const speechText = `Ok! Dosagem de ${medication} ajustada para ${dosage}. Qual a frequência que você irá tomar ${medication}? `;

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt()
            .getResponse();
    }
};

const MedicationFrequencyIntentHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'MedicationFrequencyIntent';
    },
    async handle(handlerInput) {
        const frequency = handlerInput.requestEnvelope.request.intent.slots.frequency.value;
        
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const medication = sessionAttributes.medication;
        
            const speakOutput = `Ok, vou te lembrar de tomar ${medication} ${frequency}. Qual horário te lembrar?`;
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt()
            .getResponse();
    }
};


// Handler para criar o lembrete do medicamento 
const CreateReminderIntentHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'CreateReminderIntent';
    },
    async handle(handlerInput) {
        const time = handlerInput.requestEnvelope.request.intent.slots.time.value;
        const timeTwo = handlerInput.requestEnvelope.request.intent.slots.timeTwo.value;
        const timeThree = handlerInput.requestEnvelope.request.intent.slots.timeThree.value;
        
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const medication = sessionAttributes.medication;
        
            const speakOutput = `Agendado, vou te lembrar de tomar ${medication} na frequência e horário solicitado.`;
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
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
        SetMedicationReminderIntentHandler,
        InformDosageMedicationIntentHandler,
        MedicationFrequencyIntentHandler
    )
    .withApiClient(new Alexa.DefaultApiClient())
    .addErrorHandlers(ErrorHandler)
    .lambda();
