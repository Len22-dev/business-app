import { Logo } from "@/app/shared/logo"
import Link from "next/link"

export default function Footer() {
  const footerLinks = {
    "About Us": [
      { title: "Our Story", href: "/about" },
      { title: "Team", href: "/team" },
      { title: "Careers", href: "/careers" },
      { title: "Press", href: "/press" },
      { title: "News", href: "/news" },
    ],
    Resources: [
      { title: "Blog", href: "/blog" },
      { title: "Help Center", href: "/help" },
      { title: "Guides", href: "/guides" },
      { title: "Documentation", href: "/docs" },
      { title: "Webinars", href: "/webinars" },
    ],
    Solutions: [
      { title: "Sales", href: "/solutions/sales" },
      { title: "Marketing", href: "/solutions/marketing" },
      { title: "Product", href: "/solutions/product" },
      { title: "Engineering", href: "/solutions/engineering" },
      { title: "Customer Success", href: "/solutions/customer-success" },
    ],
  }

  return (
    <footer className="bg-[#002b3d] py-16 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <Link href="/" className="flex text-white text-2xl font-bold">
              <Logo/>
            </Link>
            <p className="text-gray-400 text-sm">
              Transform the way you manage projects and boost your team's productivity with our innovative solutions.
            </p>
          </div>
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-semibold mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.title}>
                    <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
          © 2024 SalesFiv. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
