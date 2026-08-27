import { useAuthData } from "../../contexts/AuthProviderContext";
import { Alert } from "react-bootstrap";
import { useEffect } from "react";
import { ErrorType } from "../../types";
import { useWebsocketUpdate } from "../../contexts/WebSocketContextUpdate";

const HandleError = (): JSX.Element => {
    const { errorShow, updateIsTwoFa, errorMsg, errorCode, setError, userAuthentication } = useAuthData();
    const socket = useWebsocketUpdate();

    useEffect((): void => {
        const close = (): void => {
            setError(null);
        }
        setTimeout(close, 1800);
    }, [setError])

    useEffect(() => {
        const handleError = (error: ErrorType, auth_id: string) => {
            setError(error);
        }
        socket.on('error', handleError);
        return () => {
            socket.off('error', handleError);
        }
    }, [setError])

    const handleClose = (): void => {
        setError(null);
    }
    if (errorCode === 401) {
      userAuthentication(false);
      updateIsTwoFa(false);
    }

    return (
        <div>
            <Alert className="globalError" show={errorShow} onClose={handleClose} variant="warning" dismissible>{errorCode}: {errorMsg}</Alert>
        </div>
    )
}
export { HandleError };
