import { getServerSideSitemap } from 'next-sitemap';
export const getServerSideProps = async (ctx: any) => {
  const fields = [
    {
      loc: 'https://mfers.link', // Absolute url
      lastmod: new Date().toISOString()
    },
    {
      loc: 'https://mfers.link/home', // Absolute url
      lastmod: new Date().toISOString()
    },
  ]
  return getServerSideSitemap(ctx, fields)
}
export default () => {};