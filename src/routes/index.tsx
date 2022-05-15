import { v4 as uuidv4 } from 'uuid';
import {
    Home,
    Collection,
    Meme,
    Notification,
    Plaza
} from '@/components/Common/Icon';
import Image from 'next/image';

const routes  = [
    {
        name: 'app.sidebar.home',
        path: '/home',
        cnName: 'app.sidebar.meme',
        icon: <Home />,
        key: uuidv4()
    },
    {
        name: 'app.sidebar.collection',
        path: '/collection',
        cnName: 'app.sidebar.meme',
        icon: <Collection />,
        key: uuidv4()
    },
    {
        name: 'app.sidebar.plaza',
        path: '/plaza',
        cnName: 'app.sidebar.plaza',
        icon: <Plaza width={32} height={32}/>,
        key: uuidv4()
    },
    {
        name: 'app.sidebar.meme',
        path: '/meme',
        cnName: 'app.sidebar.meme',
        icon: <Meme />,
        key: uuidv4()
    },
    {
        name: 'app.sidebar.article',
        path: '/stories',
        cnName: 'app.sidebar.article',
        icon: <Image
            src="https://cdn.sanity.io/images/oru63jca/production/a134e92212f07f0572d1222fe24568d98810a5e0-213x200.png"
            width={30}
            height={30}
        />,
        key: uuidv4()
    },
    {
        name: 'app.sidebar.notification',
        path: '/notification',
        cnName: 'app.sidebar.notification',
        icon: <Notification />,
        key: uuidv4()
    },
    {
        name: 'app.sidebar.about',
        path: '/about',
        cnName: 'app.sidebar.about',
        icon: <Image
            src="https://cdn.sanity.io/images/oru63jca/production/5cae162f86f0562a98dc32e18b55016135c60150-1182x1182.png?h=100"
            width={32}
            height={32}
        />,
        key: uuidv4()
    }
];

export default routes;