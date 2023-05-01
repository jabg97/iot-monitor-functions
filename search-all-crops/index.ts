import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest,
  crops: any
): Promise<void> {
  if (crops) {
    context.res = {
      status: 200,
      body: crops,
    };
  } else {
    context.res = {
      status: 404,
      body: "We can't find crops to monitorize.",
    };
  }
};

export default httpTrigger;
