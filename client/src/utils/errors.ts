import { AxiosError } from "axios";
import { toast } from 'sonner'

export const handleError = async (error: AxiosError) => {
    let message;
    const defaultMessage = 'something went wrong!🙄'
    switch (error.status) {

        case 500: message = 'Internal Server Error!🛠'
            break;
        case 401: message = 'you are not Authorize!🚫'
            break;

        default: message = defaultMessage
            break;
    }

    return toast.error(message || defaultMessage)
}