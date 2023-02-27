import axios from "axios";
import packageDetails from "./utils/package";

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

    private async query(query: string, variables?: object) {
        const res = await this.axiosClient.post("", {
            query,
            variables
        });
        if (res.data.errors) {
            throw new Error(res.data.errors[0].message);
        }
    }
}
