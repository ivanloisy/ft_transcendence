import { useEffect, useState } from "react";
import { useAuthData } from "../../contexts/AuthProviderContext";
import Request from './Requests';
import { useWebsocketUpdate } from "../../contexts/WebSocketContextUpdate";
import {FriendUserReceiveDto} from "../../dtos/friend-user.dto";
import { BACKEND_URL } from "../../config";

const FriendUnFriend = ({ auth_id }:{ auth_id: string }): JSX.Element => {
    const [status, setStatus] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const { user, friendsList, setError } = useAuthData();
    const socket = useWebsocketUpdate();

    useEffect((): void => {
        const updateStatus = async (): Promise<void> => {
            if (auth_id !== undefined) {
                setLoading(true);
                try {
                    const res: boolean = await Request(
                        "GET",
                        {},
                        {},
                        `${BACKEND_URL}/user/` + auth_id + "/isfriend",
                    )
                    setStatus(res);
                    setLoading(false);
                    return ;
                } catch (error) {
                    setLoading(false)
                    setError(error);
                }
            }
        }
        updateStatus();
    }, [setError, auth_id, friendsList])

    const friendunfriendUser = async (): Promise<void> => {
        const res: FriendUserReceiveDto = {
            "curid": user.auth_id,
            "frid": auth_id,
            "action": !status,
        }
        socket.emit('updateFriend', res)
    }

    return (
        <div>
            { loading? <p></p> :
            <button onClick={() => friendunfriendUser()} >
                {status ?
                    <p>UNFRIEND</p>
                    :
                    <p>FRIEND</p>
                }
            </button>
            }
        </div>
    )
}
export default FriendUnFriend;
