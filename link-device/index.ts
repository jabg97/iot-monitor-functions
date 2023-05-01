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
    if (!device.userId != !req.body.userId) {
      context.bindings.newDevice = device;
      context.bindings.newDevice.userId = req.body.userId;
      response = {
        status: 200,
        message: `The device has been ${
          req.body.userId == null ? "unlinked" : "linked"
        } successfully.`,
        device: context.bindings.newDevice,
      };
    } else {
      response = {
        status: 403,
        message: `You can't ${
          req.body.userId == null ? "unlink" : "link"
        } this device.`,
        device: null,
      };
    }
  }

  context.res = {
    status: 200,
    body: response,
  };
};

export default httpTrigger;
