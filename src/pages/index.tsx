import Card from "./components/CategoryCard"


export default function IndexPage() {
  return (
    <main>
      <div className="min-h-screen max-w-screen-xl mx-auto text-white flex flex-col">
        <div className="py-20 bg-[#BE0000]">
          <h1 className="text-5xl font-bold text-center">
            Popular Categories
          </h1>
        </div>
        <div className="flex flex-row">
          <Card/>
          <Card/>
          <Card/>
          <Card/>
        </div>
      </div>
      <div className="min-h-screen">
        Two
      </div>
    </main>
  )
}
  