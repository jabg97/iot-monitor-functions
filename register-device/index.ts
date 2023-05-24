import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.bindings.newDevice = {
    id: getGUID(),
    name: "Unknown Device",
    userId: "unregistered"
  };
  const response = {
    status: 200,
    message: "The device has been registered successfully.",
    device: context.bindings.newDevice,
  };
  context.res = {
    status: 200,
    body: response,
  };
};

const getGUID = function (): string {
  return `${getS4()}${getS4()}-${getS4()}-${getS4()}-${getS4()}-${getS4()}${getS4()}${getS4()}`;
};

const getS4 = function (): string {
  return Math.floor((1 + Math.random()) * 0x10000)
  .toString(16).substring(1);
};

export default httpTrigger;
