import { useEffect, useState } from "react";
import Card from "./components/CategoryCard"
import { useRouter } from 'next/router';


export default function IndexPage() {
  const [backgroundImage, setBackgroundImage] = useState<string|null>(null);
  const router = useRouter()

  useEffect(() => {
    const loadImage = async () => {
      const cachedImage = localStorage.getItem('cachedImage');

      if (cachedImage) {
        // Use the cached image
        setBackgroundImage(cachedImage);
      } else {
        // Fetch the image, convert to Base64, and store in localStorage
        try {
          const response = await fetch('https://utemarketbucket.s3.amazonaws.com/Uni_of_Utah_-_banner.jpg');
          const blob = await response.blob();
          const reader = new FileReader();

          reader.onloadend = () => {
            const base64Data = reader.result;
            if (typeof base64Data === 'string') {
              // Store the Base64 string in localStorage
              localStorage.setItem('cachedImage', base64Data);
              setBackgroundImage(base64Data);
            }
          };

          reader.readAsDataURL(blob);
        } catch (error) {
          console.error('Failed to load image:', error);
        }
      }
    };

    loadImage();
  }, []);

  return (
    <main className='bg-cover h-screen' style={{backgroundImage:`url(${backgroundImage || 
          "https://utemarketbucket.s3.amazonaws.com/Uni_of_Utah_-_banner.jpg"})`}}>
      <div className="min-h-screen max-w-screen-xl mx-auto text-white flex flex-col">
        <div className="py-20 bg-[#BE0000]">
            <h1 className="text-5xl font-bold text-center">
              Popular Categories
            </h1>
        </div>
        <div className="flex flex-col md:flex-row mt-6">
          <div className="md:mr-[2.5%] min-w-[22.5%] hover:-translate-y-2 duration-150" onClick={() => {router.push('/Products/Category/Football Tickets')}}><Card Category='Football Tickets'/></div>
          <div className="md:mx-[1.25%] min-w-[22.5%] hover:-translate-y-2 duration-150" onClick={() => {router.push('/Products/Category/Furniture')}}><Card Category='Furniture'/></div>
          <div className="md:mx-[1.25%] min-w-[22.5%] hover:-translate-y-2 duration-150" onClick={() => {router.push('/Products/Category/School Supplies')}}><Card Category='School Supplies'/></div>
          <div className="md:ml-[2.5%] min-w-[22.5%] hover:-translate-y-2 duration-150" onClick={() => {router.push('/Products/Category/Apartment-Living')}}><Card Category='Aparment/Living'/></div>
        </div>
        <div className="mt-6 min-h-80 pt-8 bg-white text-black">
          <h2 className="text-black text-5xl text-center font-bold">
            How to Post a Product
          </h2>
          <ul className="pt-10 text-2xl text-center">
            <li>1st: Log in to your Account with an Authentic Umail</li>
            <li>2nd: Click on profile</li>
            <li>3rd: Choose the "Create Product" option</li>
            <li>4th: Fill out required fields</li>
            <li>Tip: The more detailed the title, description, and tags, the more likely it is for your product to be seen!</li>
          </ul>
        </div>
      </div>
      <div className="py-10 bg-orange-950">

      </div>
    </main>
  )
}
  