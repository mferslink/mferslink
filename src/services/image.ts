import { readClient } from './index';
import imageUrlBuilder from '@sanity/image-url';

export function urlFor(source: string, useCdn: boolean = false) {
    const builder = imageUrlBuilder(readClient(useCdn));
    return builder.image(source)
}
