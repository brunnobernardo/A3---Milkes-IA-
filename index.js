// Código teste básico sobre a skill

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

// Handler para configurar o lembrete sem horário
const SetMedicationReminderIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
               Alexa.getIntentName(handlerInput.requestEnvelope) === 'SetMedicationReminderIntent';
    },
    async handle(handlerInput) {
        const medication = handlerInput.requestEnvelope.request.intent.slots.Medication.value;

        if (!medication) {
            return handlerInput.responseBuilder
                .speak('Desculpe, não entendi o nome do medicamento. Pode repetir?')
                .reprompt('Por favor, diga o nome do remédio.')
                .getResponse();
        }

        const speechText = `Perfeito! Vou te lembrar de tomar seu ${medication}.`;

        // Aqui você pode configurar um lembrete genérico, como por exemplo, diariamente em um horário fixo
        const reminderRequest = {
            trigger: {
                type: 'SCHEDULED_RELATIVE',
                offsetInSeconds: 60, // Lembrete para daqui a 1 minuto como exemplo
            },
            alertInfo: {
                spokenInfo: {
                    content: [{
                        locale: 'pt-BR',
                        text: `Está na hora de tomar seu ${medication}. Lembre-se de cuidar da sua saúde!`
                    }]
                }
            },
            pushNotification: {
                status: 'ENABLED'
            }
        };

        try {
            const client = handlerInput.serviceClientFactory.getReminderManagementServiceClient();
            await client.createReminder(reminderRequest);
        } catch (error) {
            console.log(`Erro ao configurar o lembrete: ${error}`);
            return handlerInput.responseBuilder
                .speak('Desculpe, algo deu errado ao configurar o lembrete. Tente novamente.')
                .getResponse();
        }

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
        const speechText = 'Desculpe, ocorreu um erro. Tente novamente.';
        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};

// Configuração do Lambda
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        SetMedicationReminderIntentHandler
    )
    .withApiClient(new Alexa.DefaultApiClient())
    .addErrorHandlers(ErrorHandler)
    .lambda();
