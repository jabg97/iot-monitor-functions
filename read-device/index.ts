import { AzureFunction, Context, HttpRequest } from "@azure/functions";

interface ClimateVariables {
  currentAirTemperature: number;
  currentAirHumidity: number;
  currentSoilMoisture: number;
}

interface ClimateRange {
  minAirTemperature: number;
  maxAirTemperature: number;
  minAirHumidity: number;
  maxAirHumidity: number;
  minSoilMoisture: number;
  maxSoilMoisture: number;
}

interface History {
  dateTime: string;
  state: string;
  cropId?: string | null;
  sensor?: ClimateVariables | null;
}

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
    context.bindings.newDevice.sensor = {
      currentAirTemperature: parseInt(req.body.currentAirTemperature),
      currentAirHumidity: parseInt(req.body.currentAirHumidity),
      currentSoilMoisture: parseInt(req.body.currentSoilMoisture),
    } as ClimateVariables;
    const date = new Date();
    date.setSeconds(0);
    date.setMilliseconds(0);
    const data = {
      dateTime: date.toISOString(),
      state: getState(
        context.bindings.newDevice.sensor,
        context.bindings.newDevice.range
      ),
      cropId: context.bindings.newDevice.cropId,
      sensor: context.bindings.newDevice.sensor,
    } as History;
    if (context.bindings.newDevice.history) {
      const array = context.bindings.newDevice.history as Array<History>;
      array.unshift(data);
      context.bindings.newDevice.history = array;
    } else {
      context.bindings.newDevice.history = [data];
    }
    response = {
      status: 200,
      message: "The device has been readed successfully.",
      device: context.bindings.newDevice,
    };
  }
  context.res = {
    status: 200,
    body: response,
  };
};

const getState = function (
  sensor: ClimateVariables,
  range: ClimateRange
): string {
  let state = "";

  if (sensor.currentAirTemperature < range.minAirTemperature) {
    state = `Low air temperature ${sensor.currentAirTemperature}° -:- `;
  } else if (sensor.currentAirTemperature > range.maxAirTemperature) {
    state = `High air temperature ${sensor.currentAirTemperature}° -:- `;
  } else {
    state = `Normal air temperature ${sensor.currentAirTemperature}° -:- `;
  }

  if (sensor.currentAirHumidity < range.minAirHumidity) {
    state = `Low air humidity ${sensor.currentAirHumidity}% -:- `;
  } else if (sensor.currentAirHumidity > range.maxAirHumidity) {
    state = `High air humidity ${sensor.currentAirHumidity}% -:- `;
  } else {
    state = `Normal air humidity ${sensor.currentAirHumidity}% -:- `;
  }

  if (sensor.currentSoilMoisture < range.minSoilMoisture) {
    state = `Low soil moisture ${sensor.currentSoilMoisture}%`;
  } else if (sensor.currentSoilMoisture > range.maxSoilMoisture) {
    state = `High soil moisture ${sensor.currentSoilMoisture}%`;
  } else {
    state = `Normal soil moisture ${sensor.currentSoilMoisture}%`;
  }

  return state;
};

export default httpTrigger;
