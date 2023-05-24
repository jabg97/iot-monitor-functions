import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {

  context.bindings.newCrop = {
    id: getGUID(),
    name: req.body.name,
    range: req.body.range
  };
  
  const response = {
    status: 200,
    message: "The crop has been registered successfully.",
    crop: context.bindings.newCrop,
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

