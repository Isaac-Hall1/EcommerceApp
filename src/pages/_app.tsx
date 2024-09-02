import type { AppType } from 'next/app'
import { trpc } from '@/utils/trpc'
import Navbar from './components/navbar'
import './globals.css'

const MyApp: AppType = ({Component, pageProps}) => {
  return (
    <div className='bg-gray-200'>
      <Navbar/>
      <Component {...pageProps}/>
    </div>
)
}
export default trpc.withTRPC(MyApp)