export function execute(serviceControl, command) {
    return serviceControl[command.action] &&
        serviceControl[command.action](...command.parameters);
}