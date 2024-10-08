import { useContext, useEffect, useState } from "react"
import searchIcon from '../../assets/searchIcon.png'
import SignIn from './SignInBox'
import AuthContext from "./AuthProvider";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false)
  const { user, authReady } = useContext(AuthContext)
  const [searchQuery, setSearchQuery] = useState('')

  const router = useRouter()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form submission behavior
    if (searchQuery.trim()) { // Only navigate if there's a valid search query
      router.push(`/Products/Search/${searchQuery}`);
    }
  };


  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768); // Adjust the pixel value as needed
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call it initially to set the state correctly

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
      <div>
        {isSmallScreen ? (
          <div> {
            <nav className="pt-4 pb-4 bg-orange-950 cursor-default mx-4">
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
                              <a className="pt-2 hover:text-lg hover:font-bold duration-100" href="/Products/Category/Kitchen Appliance">Kitchen Appliances</a>
                              <a className="pt-2 hover:text-lg hover:font-bold duration-100" href="/Products/Category/Furniture">Furniture</a>
                              <a className="pt-2 hover:text-lg hover:font-bold duration-100" href="/Products/Category/Football Tickets">Football Tickets</a>
                              <a className="pt-2 hover:text-lg hover:font-bold duration-100" href="/Products/Category/School Supplies">School Supplies</a>
                              <a className="pt-2 hover:text-lg hover:font-bold duration-100" href="/Products/Category/Apartment-Living">Apartment/Living</a>
                              <a className="pt-2 hover:text-lg hover:font-bold duration-100" href="/Products/Category/Art">Art</a>
                              <a className="pt-2 hover:text-lg hover:font-bold duration-100" href="/Products/Category/Apperal">Apperal</a>
                              <a className="py-2 hover:text-lg hover:font-bold duration-100" href="/Products/Category/Other">Other</a>
                            </div>
                          </div>
                        </div>
                      </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="basis-3/12 flex items-center justify-center space-x-4">
                    <div className="px-4 ">
                    {authReady && (
                      <>
                      {user ? (
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
                <div className="basis-6/12 flex justify-center">
                  <form className="flex items-center w-full border-2 border-solid border-white rounded-2xl" onSubmit={handleSubmit}>
                    <input
                      className="bg-transparent flex-grow p-2 focus:outline-none"
                      type="text"
                      placeholder="Search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className="p-1 text-white"><img className="h-10 w-10 py-2 hover:bg-white duration-150 rounded-full" src={searchIcon.src} alt="S"></img></button>
                  </form>
                </div>
            </nav>
            } </div>
        ) : (
          <div> {
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
                              <a className="pt-2 hover:text-lg hover:font-bold duration-100" href="/Products/Category/Kitchen Appliance">Kitchen Appliances</a>
                              <a className="pt-2 hover:text-lg hover:font-bold duration-100" href="/Products/Category/Furniture">Furniture</a>
                              <a className="pt-2 hover:text-lg hover:font-bold duration-100" href="/Products/Category/Football Tickets">Football Tickets</a>
                              <a className="pt-2 hover:text-lg hover:font-bold duration-100" href="/Products/Category/School Supplies">School Supplies</a>
                              <a className="pt-2 hover:text-lg hover:font-bold duration-100" href="/Products/Category/Apartment-Living">Apartment/Living</a>
                              <a className="pt-2 hover:text-lg hover:font-bold duration-100" href="/Products/Category/Art">Art</a>
                              <a className="pt-2 hover:text-lg hover:font-bold duration-100" href="/Products/Category/Apperal">Apperal</a>
                              <a className="py-2 hover:text-lg hover:font-bold duration-100" href="/Products/Category/Other">Other</a>
                            </div>
                          </div>
                        </div>
                      </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="basis-6/12 flex justify-center">
                  <form className="flex items-center w-full border-2 border-solid border-white rounded-2xl" onSubmit={handleSubmit}>
                    <input
                      className="bg-transparent flex-grow p-2 focus:outline-none"
                      type="text"
                      placeholder="Search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className="p-1 text-white"><img className="h-10 w-10 py-2 hover:bg-white duration-150 rounded-full" src={searchIcon.src} alt="S"></img></button>
                  </form>
                </div>
                <div className="basis-3/12 flex items-center justify-center space-x-4">
                  <div className="px-4 ">
                  {authReady && (
                    <>
                    {user ? (
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
          } </div>
        )}
      </div>
    );
}
export default Navbar