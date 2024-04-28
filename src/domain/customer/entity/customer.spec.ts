import EventDispatcher from "../../@shared/event/event-dispatcher";
import CustomerAdressChangedEvent from "../event/customer-adress-changed";
import CustomerCreatedEvent from "../event/customer-created.event";
import EnviaConsoleLogHandler from "../event/handler/envia-console-log.handler";
import EnviaConsoleLog1Handler from "../event/handler/envia-console-log1.handler";
import EnviaConsoleLog2Handler from "../event/handler/envia-console-log2.handler";
import Address from "../value-object/address";
import Customer from "./customer";

describe("Customer unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => {
      let customer = new Customer("", "John");
    }).toThrowError("Id is required");
  });

  it("should throw error when name is empty", () => {
    expect(() => {
      let customer = new Customer("123", "");
    }).toThrowError("Name is required");
  });

  it("should change name", () => {
    // Arrange
    const customer = new Customer("123", "John");

    // Act
    customer.changeName("Jane");

    // Assert
    expect(customer.name).toBe("Jane");
  });

  it("should activate customer", () => {
    const customer = new Customer("1", "Customer 1");
    const address = new Address("Street 1", 123, "13330-250", "São Paulo");
    customer.Address = address;

    customer.activate();

    expect(customer.isActive()).toBe(true);
  });

  it("should throw error when address is undefined when you activate a customer", () => {
    expect(() => {
      const customer = new Customer("1", "Customer 1");
      customer.activate();
    }).toThrowError("Address is mandatory to activate a customer");
  });

  it("should deactivate customer", () => {
    const customer = new Customer("1", "Customer 1");

    customer.deactivate();

    expect(customer.isActive()).toBe(false);
  });

  it("should add reward points", () => {
    const customer = new Customer("1", "Customer 1");
    expect(customer.rewardPoints).toBe(0);

    customer.addRewardPoints(10);
    expect(customer.rewardPoints).toBe(10);

    customer.addRewardPoints(10);
    expect(customer.rewardPoints).toBe(20);
  });

  it("should notify all customer created event handlers", () => {
    const eventHandler1 = new EnviaConsoleLog1Handler();
    const eventHandler2 = new EnviaConsoleLog2Handler();
    const dispacher = new EventDispatcher();
    const spyEventHandler1 = jest.spyOn(eventHandler1, 'handle');
    const spyEventHandler2 = jest.spyOn(eventHandler2, 'handle');

    dispacher.register(CustomerCreatedEvent.name, eventHandler1);
    dispacher.register(CustomerCreatedEvent.name, eventHandler2);

    new Customer("1", "Customer 1", dispacher);

    expect(spyEventHandler1).toHaveBeenCalled()
    expect(spyEventHandler2).toHaveBeenCalled()
  });

  it("should notify customer address changed event handler", () => {
    
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-04-27'));

    const handler = new EnviaConsoleLogHandler();
    const dispacher = new EventDispatcher();
    const spyHandler = jest.spyOn(handler, 'handle');

    dispacher.register(CustomerAdressChangedEvent.name, handler);

    const customer = new Customer("1", "Customer 1", dispacher);
    const address = new Address("Street 1", 1, "01", "City 1");
    customer.changeAddress(address);

    expect(spyHandler).toHaveBeenCalledWith({
      dataTimeOccurred: new Date('2024-04-27'),
      eventData: {
        id: customer.id,
        name: customer.name,
        address
      }
    })
  });
});
