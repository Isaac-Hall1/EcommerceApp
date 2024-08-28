import type { AppType } from 'next/app'
import { trpc } from '@/utils/trpc'
import Navbar from './components/navbar'

const MyApp: AppType = ({Component, pageProps}) => {
  return (
    <div>
      <Navbar/>
      <Component {...pageProps}/>
    </div>
)
}
export default trpc.withTRPC(MyApp)