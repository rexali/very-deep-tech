import { BASE_URL, SERVER_URL } from "@/constants/url";
import { saveToken } from "@/utils/saveToken";

/**
 * Sign in user with provided input
 * @param email 
 * @param password 
 * @returns boolean value
 */
export async function handleLogin(email: any, password: any) {
    try {
        // fetch data with email and password
        const resp = await fetch(SERVER_URL + "/auth/login", {
            method: 'POST',
            mode: "cors",
            // header
            headers: {
                'Content-Type': 'application/json'
            },
            // user entered data
            body: JSON.stringify({
                email, 
                password
            }), 
        });
        // get the token and result
        const result = await resp.json();
        console.log(result.data);
        
        // check if login is success
        if (result.status === "success" && result.data.token) {
            // save token
            saveToken("token", result.data.token);

            return result;
        } else {

            return null;
        }

    } catch (error) {
        console.log(error);
    }

}
