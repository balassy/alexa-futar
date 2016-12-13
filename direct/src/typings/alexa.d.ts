interface AlexaHandler {
    emit(event: string, speechOutput: string): boolean;
    emit(event: string, speechOutput: string, cardTitle: string, cardContent: string): boolean;
}