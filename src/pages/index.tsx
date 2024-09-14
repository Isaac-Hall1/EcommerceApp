import Card from "./components/CategoryCard"


export default function IndexPage() {
  return (
    <main className='bg-cover h-screen' style={{backgroundImage: `url('https://utemarketbucket.s3.amazonaws.com/Uni_of_Utah_-_banner.jpg')`}}>
      <div className="min-h-screen max-w-screen-xl mx-auto text-white flex flex-col">
        <div className="py-20 bg-[#BE0000]">
            <h1 className="text-5xl font-bold text-center">
              Popular Categories
            </h1>
        </div>
        <div className="flex flex-col md:flex-row mt-6">
          <div className="md:mr-[2.5%] min-w-[22.5%] hover:-translate-y-2 duration-150"><Card Category='Football Tickets'/></div>
          <div className="md:mx-[1.25%] min-w-[22.5%] hover:-translate-y-2 duration-150"><Card Category='Furniture'/></div>
          <div className="md:mx-[1.25%] min-w-[22.5%] hover:-translate-y-2 duration-150"><Card Category='School Supplies'/></div>
          <div className="md:ml-[2.5%] min-w-[22.5%] hover:-translate-y-2 duration-150"><Card Category='Aparment/Living'/></div>
        </div>
        <div className="mt-6 min-h-72 pt-8 bg-white text-black">
          <h2 className="text-black text-5xl text-center font-bold">
            How to Post a Product
          </h2>
          <ul className="pt-10 text-2xl text-center">
            <li>1st: Log in to your Account with an Authentic Umail</li>
            <li>2nd: Click on profile</li>
            <li>3rd: Choose the "Create Product" option</li>
            <li>4th: Fill out required fields</li>
          </ul>
        </div>
      </div>
      <div className="py-10 bg-orange-950">

      </div>
    </main>
  )
}
  