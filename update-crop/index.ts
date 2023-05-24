import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest,
  crops: any[]
): Promise<void> {
  let response = {
    status: 404,
    message: "We can't find the crop.",
    crop: null,
  };
  const crop = crops && crops.length ? crops[0] : undefined;
  if (crop) {
    context.bindings.newCrop = crop;
    context.bindings.newCrop.name = req.body.name;
    context.bindings.newCrop.range = req.body.range;
    response = {
      status: 200,
      message: "The crop has been updated successfully.",
      crop: context.bindings.newCrop,
    };
  }
  context.res = {
    status: 200,
    body: response,
  };
};

export default httpTrigger;
