import { formatDate } from "@components/utils.ts"

export const BlogCard = () => {
  const { title, excerpt, thumbnail, id, publishedAt } = {
    id: '01',
    title: 'React Tailwind Newsletter Component',
    excerpt: 'Learn how to build a responsive newsletter component using React and Tailwind CSS.',
    thumbnail:
      'https://plus.unsplash.com/premium_photo-1673984261110-d1d931e062c0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    
    publishedAt: '2024-07-14',
    
  }

  return (
    <div key={id} className="flex flex-col gap-3 rounded-lg border bg-[#F4F4F5] p-3 lg:flex-row">
      <figure className="relative mt-1 h-24 min-w-40 overflow-hidden bg-gray-200">
        <img
          className="absolute inset-0 h-full w-full rounded-md object-cover transition-transform duration-300 hover:scale-125"
          src={thumbnail}
          alt="demo"
        />
      </figure>

      <a href="javascript:void(0)">
        <h3 className="mb-2 text-xl font-bold text-gray-600 transition-colors duration-200 hover:text-blue-600">
          {title}
        </h3>
        <p className="text-gray-700">{excerpt}</p>
        <p className="mt-4 text-sm font-semibold text-gray-600">
          {formatDate(publishedAt)}
        </p>
      </a>
    </div>
  )
}

export default BlogCard