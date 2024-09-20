import { trpc } from "@/utils/trpc";
import { useState } from "react";

export default function Insperation() {

  const mutation = trpc.tags.createTag.useMutation()

  const [tag, setTag] = useState(''); // State to hold the single tag
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(tag)
  };

  return (
    <main className='bg-cover h-screen' style={{backgroundImage: `url('https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/278458740_360154352821770_4906019428737952204_n.jpg?stp=dst-jpg_p960x960&_nc_cat=108&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=uXjLNqUtb2oQ7kNvgEBEMob&_nc_ht=scontent-lax3-1.xx&oh=00_AYCXfZqLhwgLPLJVbH5ES61RiMEvzgRVySOY99EdIMGKrA&oe=66DDD964')`}}>
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