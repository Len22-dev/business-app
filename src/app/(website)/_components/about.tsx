import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Value } from "@/types";

const values: Value[] = [
  {
    icon: "/icons/star.svg",
    title: "Simplicity",
    description: "No tech skills needed with our drag-and-drop dashboard.",
  },
  {
    icon: "/icons/piggy-bank.svg",
    title: "Affordability",
    description: "Free Plan and budget-friendly options for all SMBs.",
  },
  {
    icon: "/icons/chat-bubble.svg",
    title: "Support",
    description: "Always here with Eazie answers for your business.",
  },
];

export const metadata = {
  title: "About GrowEazie | SMB Business Software",
  description:
    "GrowEazie simplifies SMB growth with affordable, easy tools for inventory and sales.",
};

export default function About() {
  return (
    <div>
      <section className="bg-gradient-to-r from-grow-green to-grow-blue text-grow-white py-20 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <Image
            src="/logo.png"
            alt="GrowEazie Logo"
            width={150}
            height={150}
            className="mx-auto mb-6"
          />
          <h1 className="text-4xl font-bold mb-4">About GrowEazie</h1>
          <p className="text-lg mb-8">
            GrowEazie empowers small businesses with simple, affordable tools for sales,
            inventory, and finances. Our mission is to make growth stress-free, so you can
            focus on what matters.
          </p>
          <Button className="bg-grow-green text-grow-white hover:bg-opacity-90">
            Start Free Today
          </Button>
        </div>
      </section>
      <section className="py-16 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value) => (
              <Card key={value.title}>
                <CardHeader className="text-center">
                  <Image
                    src={value.icon}
                    alt={value.title}
                    width={48}
                    height={48}
                    className="mx-auto mb-4"
                  />
                  <CardTitle>{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Our Team</h2>
          <p className="text-gray-600 mb-8">
            Founded by a small team passionate about SMB success, we’re here to make
            your growth Eazie-peazie!
          </p>
        </div>
      </section>
    </div>
  );
}