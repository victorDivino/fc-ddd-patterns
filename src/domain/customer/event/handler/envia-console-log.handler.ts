import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerAdressChangedEvent from "../customer-adress-changed";

export default class EnviaConsoleLogHandler implements EventHandlerInterface<CustomerAdressChangedEvent> {
    handle(event: CustomerAdressChangedEvent): void {
        console.log(`Endereço do cliente: ${event.eventData.id}, ${event.eventData.name} alterado para: ${event.eventData.address}`);
    }
}