import { useState } from "react";

export default function ProductsPage() {
  const [sortOption, setSortOption] = useState('Newest');
  
  return (
    <main>
      <div className="min-h-screen bg-gray-200">
        <div className="max-w-screen-xl bg-black mx-auto flex flex-col">
          <div>
            <form className="flex justify-center">
              <label htmlFor="Sort" className="mr-8">Sort By: </label>
              <select
                name="Sort"
                id="Sort"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="ml-8 text-black"
                >
                <option value="low-to-high">Low to High</option>
                <option value="high-to-low">High to Low</option>
                <option value="relevant">Relevant</option>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </form>
          </div>
          <div>

          </div>
        </div>
      </div>
    </main>
  )
}