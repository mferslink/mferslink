import sanityClient from '@sanity/client'
const writeClient = sanityClient(
    {
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        apiVersion: 'v1', // Learn more: https://www.sanity.io/docs/api-versioning
        token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN_WRITE,
        /**
         * Set useCdn to `false` if your application require the freshest possible
         * data always (potentially slightly slower and a bit more expensive).
         * Authenticated request (like preview) will always bypass the CDN
         **/
        useCdn: false
    }
)

const readClient = (useCdn: boolean = false) => {
    return sanityClient(
    {
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        apiVersion: 'v1', // Learn more: https://www.sanity.io/docs/api-versioning
        token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN_READ,
        /**
         * Set useCdn to `false` if your application require the freshest possible
         * data always (potentially slightly slower and a bit more expensive).
         * Authenticated request (like preview) will always bypass the CDN
         **/
        useCdn: useCdn
    })
}

// @ts-ignore
const readOnlyDBClient = (useCdn: boolean = false) => {
    return sanityClient(
    {
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID_READ,
        apiVersion: 'v1', // Learn more: https://www.sanity.io/docs/api-versioning
        token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN_READONLY,
        /**
         * Set useCdn to `false` if your application require the freshest possible
         * data always (potentially slightly slower and a bit more expensive).
         * Authenticated request (like preview) will always bypass the CDN
         **/
        useCdn: useCdn
    })
}

export {
    writeClient,
    readClient,
    readOnlyDBClient,
};
