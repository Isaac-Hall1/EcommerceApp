import { trpc } from "@/utils/trpc";
import { useState } from "react";

type product = { 
  id: number; 
  createdAt: string; 
  updatedAt: string; 
  name: string; 
  description: string | null; 
  price: number; 
  sellLocation: string; 
  userName: string;
  photos: { 
    id: number; 
    imgData: string; 
    productId: number; 
  }[]; 
  Category: string;  
}

export default function Insperation() {
  const prod = trpc.products.addProductToObjectStore.useMutation()
  const mutation = trpc.tags.createTag.useMutation()

  const [tag, setTag] = useState(''); // State to hold the single tag
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(tag)
  };

  function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const handleButton = async () => {
    try{
      prod.mutateAsync()
      console.log(':)')
    } catch(error) {
      console.log(error)
    }
  }

  return (
    <main className='bg-gray-200 h-screen text-black'>

      <button onClick={handleButton}>But</button>

      <div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="tagInput">Create tag: </label>
          <input
            id="tagInput"
            type="text"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="Enter a tag"
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </main>
  )
}