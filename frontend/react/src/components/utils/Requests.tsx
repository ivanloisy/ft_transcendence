import { useAuthData } from "../../contexts/AuthProviderContext";
import { ErrorType } from "../../types";
import { BACKEND_URL, getApiUrl } from "../../config";

const Logout = async (): Promise<void> => {
  const { userAuthentication, updateIsTwoFa } = useAuthData();

  await fetch(`${BACKEND_URL}/auth/logout`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  })
      .then((res) => res.json())
      .then((data) => {
        userAuthentication(false);
        updateIsTwoFa(false);
        return ;
      })
      .catch((error) => {
        userAuthentication(false);
        updateIsTwoFa(false);
        return ;
      });
}

const Request = async (
    type: string,
    headers: any,
    body: any,
    url: string): Promise<any> =>
{
    const targetUrl = getApiUrl(url);
    if (type === "GET") {
      const response: Response = await fetch(targetUrl, {
        method: type,
        credentials: "include",
        headers: headers,
      });
      if (response.ok) {
        const res: any = await response.json();
        return res;
      } else {
        const err: ErrorType = await response.json();
        if (err.statusCode === 401) {
          await Logout();
        }
        throw err;
      }

    } else {
      const response: Response = await fetch(targetUrl, {
        method: type,
        headers: headers,
        credentials: "include",
        body: JSON.stringify(body),
      });
      if (response.ok) {
        const res: any = await response.json();
        return res;
      } else {
        const err: ErrorType = await response.json();
        if (err.statusCode === 401) {
          await Logout();
        }
        throw err;
      }
    }
}
export default Request;
