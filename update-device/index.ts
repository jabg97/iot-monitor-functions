import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest,
  devices: any[]
): Promise<void> {
  let response = {
    status: 404,
    message: "We can't find the device.",
    device: null,
  };
  const device = devices && devices.length ? devices[0] : undefined;
  if (device) {
    context.bindings.newDevice = device;
    context.bindings.newDevice.name = req.body.name;
    context.bindings.newDevice.range = req.body.range;
    context.bindings.newDevice.cropId = req.body.cropId;
    response = {
      status: 200,
      message: "The device has been updated successfully.",
      device: context.bindings.newDevice,
    };
  }
  context.res = {
    status: 200,
    body: response,
  };
};

export default httpTrigger;
