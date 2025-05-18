import { motion as Motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

export default function Blog() {
  const posts = [
    {
      title: "Sales Tips, Insights, and Trends",
      date: "12 Aug 2024",
      image: "/placeholder.svg?height=200&width=300",
      description: "Stay updated with the latest sales strategies and market insights.",
      slug: "sales-tips-insights-trends-1",
    },
    {
      title: "Sales Tips, Insights, and Trends",
      date: "15 Sep 2024",
      image: "/placeholder.svg?height=200&width=300",
      description: "Stay updated with the latest sales strategies and market insights.",
      slug: "sales-tips-insights-trends-2",
    },
  ]

  return (
    <div className="bg-gray-50 py-24">
      <div className="container mx-auto px-4">
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Sales Tips, Insights, and Trends</h2>
          <Link href="/blog" className="text-emerald-500 hover:text-emerald-600 transition-colors">
            View all →
          </Link>
        </Motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {posts.map((post, index) => (
            <Motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg overflow-hidden shadow-sm"
            >
              <Image
                src={post.image || "/placeholder.svg"}
                alt={post.title}
                width={600}
                height={300}
                className="w-full object-cover h-48"
              />
              <div className="p-6">
                <div className="text-sm text-gray-500 mb-2">{post.date}</div>
                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-4">{post.description}</p>
                <Link href={`/blog/${post.slug}`} className="text-emerald-500 hover:text-emerald-600 transition-colors">
                  Read more →
                </Link>
              </div>
            </Motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
