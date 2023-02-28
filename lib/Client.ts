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

type User = {
    id: string;
    slug: string;
    username: string;
    cScore: number;
    pictureUrl: string;
    fallbackUrl: string;
    certified: boolean;
    twitterUsername?: string;
    instagramUsername?: string;
    isDiscordVisible: boolean;
    discord: {
        username?: string;
        discriminator?: string;
        id?: string;
    }
    starknetWallet: {
        address: string;
        publicKey: string;
    }
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

    async getUser(slug: string) : Promise<User> {
        const query = getQuery("query", `user(slug: "${slug}")`, [
            "id",
            "slug",
            "username",
            "cScore",
            {
                starknetWallet: [
                    "address",
                    "publicKey"
                ]
            },
            {
                profile: [
                    "pictureUrl",
                    "customAvatarUrl",
                    "fallbackUrl",
                    "certified",
                    "twitterUsername",
                    "instagramUsername",
                    "isDiscordVisible",
                    {
                        discordMember: [
                            "username",
                            "discriminator",
                            "id"
                        ]
                    }
                ]
            }
        ]);
        const res = await this.sendQuery(query);

        return {
            id: res.id,
            slug: res.slug,
            username: res.username,
            cScore: res.cScore,
            pictureUrl: (
                res.profile.customAvatarUrl || res.profile.pictureUrl || res.profile.fallbackUrl
            ),
            fallbackUrl: res.profile.fallbackUrl,
            certified: res.profile.certified,
            twitterUsername: res.profile.twitterUsername,
            instagramUsername: res.profile.instagramUsername,
            isDiscordVisible: res.profile.isDiscordVisible,
            discord: {
                username: res.profile.discordMember.username,
                discriminator: res.profile.discordMember.discriminator,
                id: res.profile.discordMember.id
            },
            starknetWallet: {
                address: res.starknetWallet.address,
                publicKey: res.starknetWallet.publicKey
            }
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
