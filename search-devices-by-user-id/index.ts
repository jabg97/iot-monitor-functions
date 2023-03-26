import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest, devices:any): Promise<void> {
    if(devices){
        context.res = {
            status: 200,
            body: devices
        }
    }else{
        context.res = {
            status: 404,
            body: "404 Not found: We can't find devices linked to your account."
        }
    }
};

export default httpTrigger;