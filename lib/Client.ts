import axios from "axios";
import packageDetails from "./utils/package";
import * as crypto from "crypto";
import getQuery from "./utils/gqlQuery";

type LoginResponse = {
    token?: string;
    needs2FA: boolean;
    twoFactorSecret?: string;
    username?: string;
}

export default class Client {
    token?: string;
    baseURL: string;
    private axiosClient: any;
    userAgent: string;

    constructor(token?: string, baseURL: string = "https://api.rules.art/graphql", userAgent: string = `rules.art.js/${packageDetails.version}`) {
        this.token = token;
        this.baseURL = baseURL;
        this.userAgent = userAgent;
        this.axiosClient = axios.create({
            baseURL: this.baseURL,
            headers: {
                "User-Agent": this.userAgent
            }
        });
    }

    /**
     * Log the user in.
     * @param email
     * @param password
     */

    async login(email: string, password: string) : Promise<LoginResponse> {
        const hash = crypto.createHash("sha512");
        hash.update(password);
        const hashedPassword = hash.digest("hex");
        const query = getQuery("mutation", `signIn(input: {email: "${email}", password: "${hashedPassword}"})`, ["accessToken", "twoFactorAuthToken", {
            "user": [
                "slug",
                "username"
            ]
        }]);
        const res = await this.sendQuery(query);
        if (res.twoFactorAuthToken) {
            return {
                needs2FA: true,
                twoFactorSecret: res.signIn.twoFactorAuthToken
            }
        }
        this.token = res.accessToken;
        return {
            needs2FA: false,
            token: res.accessToken,
            username: res.user.username
        }
    }

    async twoFactorSignIn(twoFactorToken: string, code: string) : Promise<LoginResponse> {
        const query = getQuery("mutation", `twoFactorAuthSignIn(input: {token: "${twoFactorToken}", code: "${code}"})`, [
            "accessToken",
            {
                "user": [
                    "slug",
                    "username"
                ]
            }
        ]);
        const res = await this.sendQuery(query);
        this.token = res.accessToken;
        return {
            needs2FA: false,
            token: res.accessToken,
            username: res.user.username
        }
    }

    private async sendQuery(query: string, variables?: object) : Promise<any> {
        const res = await this.axiosClient.post("", {
            query,
            variables
        });
        if (res.data.errors) {
            throw new Error(res.data.errors[0].message);
        }
        const queryName = Object.keys(res.data.data)[0];
        return res.data.data[queryName];
    }
}
