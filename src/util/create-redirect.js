export default function createRedirectURL(basePath, reqURL, paramKey) {
    const url = new URL(basePath, reqURL);
    url.searchParams.set(paramKey, reqURL);
    return url;
}