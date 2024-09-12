import { useEffect, useState } from "react"
import searchIcon from '../../assets/searchIcon.png'
import SignIn from './SignInBox'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [signInOpen, setSignInOpen] = useState(false)
  const [isSignedIn, setIsSignedIn] = useState(false)
  useEffect(() => {
    if(document.cookie)
      setIsSignedIn(true)
  })

  return (
    <nav className="pt-4 pb-4 bg-orange-950 cursor-default">
      <div className="flex flex-row items-center justify-between max-w-screen-2xl mx-auto px-2">
        <div className="basis-3/12 flex items-center justify-center space-x-4">
          <div className="basis-1/2">
            <a href="/" className="relative after:content-[''] after:bg-white after:h-[3px] after:w-[0%] after:left-4 after:-bottom-[5px]
             after:rounded-xl after:absolute after:duration-300 hover:after:w-[80%] pl-4">Ute Market</a>
          </div>
          <div className="basis-1/2">
            <div>
              <a className="hover:cursor-pointer" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>Categories</a>
              {open && (
                <div onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
                  <div
                  className="absolute z-50 -translate-x-[88px] top-[96px] border-solid border-[3px]
                            border-orange-950 text-black shadow-2xl animate-fadeIn bg-white">
                  <div className="absolute h-14 -top-14 left-0 right-0 cursor-default"></div>
                  <div
                    className="absolute z-50 -top-[10px] h-0 w-0 translate-x-[118px] border-l-transparent
                              border-r-transparent border-b-[10px] border-l-[7px] border-r-[7px] border-orange-950">
                  </div>
                  <div className="w-64 z-50">
                    <div className="flex flex-col pl-4">
                      <a className="pt-2 hover:text-lg hover:font-bold duration-100" href="#">Kitchen Appliances</a>
                      <a className="pt-2 hover:text-lg hover:font-bold duration-100" href="#">Furniture</a>
                      <a className="pt-2 hover:text-lg hover:font-bold duration-100" href="#">Football Tickets</a>
                      <a className="pt-2 hover:text-lg hover:font-bold duration-100" href="#">School Supplies</a>
                      <a className="pt-2 hover:text-lg hover:font-bold duration-100" href="#">Apartment/Living</a>
                      <a className="py-2 hover:text-lg hover:font-bold duration-100" href="#">Art</a>
                    </div>
                  </div>
                </div>
              </div>
              )}
            </div>
          </div>
        </div>
        <div className="basis-6/12 flex justify-center">
          <form className="flex items-center w-full border-2 border-solid border-white rounded-2xl">
            <input
              className="bg-transparent flex-grow p-2 focus:outline-none"
              type="text"
              placeholder="Search"
            />
            <button type="submit" className="p-1 text-white"><img className="h-10 w-10 py-2 hover:bg-white duration-150 rounded-full" src={searchIcon.src} alt="S"></img></button>
          </form>
        </div>
        <div className="basis-3/12 flex items-center justify-center space-x-4">
          <div className="px-4 ">
            {isSignedIn ? (
              <a href="/Profile" className="relative after:content-[''] after:bg-white after:h-[3px] after:w-[0%] after:left-0 after:-bottom-[5px]
              after:rounded-xl after:absolute after:duration-300 hover:after:w-[100%]">Profile</a>
            ):(
              <>
                <button onClick={() => setSignInOpen(true)} className="relative after:content-[''] after:bg-white after:h-[3px] after:w-[0%] after:left-0 after:-bottom-[5px]
                after:rounded-xl after:absolute after:duration-300 hover:after:w-[100%]">Sign In</button>
                {signInOpen && (
                  <SignIn setSignInOpen={setSignInOpen}/>
                )}
              </>
            )}
          </div>
             <div>
               <button className="hover:text-black hover:bg-gray-100 duration-300 rounded-2xl p-2">
                 <a href="/Insperation">Insperation</a>
               </button>
             </div>
          <div>
            <button className="hover:text-black hover:bg-gray-100 duration-300 rounded-2xl p-2">
              <span>Favorites</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}