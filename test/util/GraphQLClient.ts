import ApolloClient from "apollo-boost";
import "cross-fetch/polyfill";

export const client = new ApolloClient({
    uri: process.env.API_URL,
    onError: (error) => { console.log(error) },
});

