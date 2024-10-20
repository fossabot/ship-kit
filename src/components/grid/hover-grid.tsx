'use client'

import { useEffect } from 'react'
import styles from './hover-grid.module.css'

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
}

interface HoverGridProps {
  title?: string
  subtitle?: string
  description?: string
  content: Feature[]
  columns?: 1 | 2 | 3 | 4
  bgColor?: string
  textColor?: string
  accentColor?: string
}

const HoverGridContainer = ({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <div className={`${styles.card} ${className}`}>
    {children}
  </div>
}

export function HoverGrid({
  title = "Everything you need to manage your projects",
  subtitle = "Boost productivity",
  description = "Our SaaS platform provides all the tools you need to streamline your workflow and boost team productivity.",
  content,
  columns = 3,
  bgColor = "slategray",
  textColor = "black",
  accentColor = "indigo"
}: HoverGridProps) {

  useEffect(() => {
    const cards = document.getElementById("cards")
    if(cards) {
      cards.onmousemove = e => {
        for(const card of cards.getElementsByClassName("card")) {
          const rect = card.getBoundingClientRect(),
          x = e.clientX - rect.left,
          y = e.clientY - rect.top;

          card.style.setProperty("--mouse-x", `${x}px`);
          card.style.setProperty("--mouse-y", `${y}px`);
        }
      };
    }
    return () => {
      if(cards) {
        cards.onmousemove = null;
      }
    }
  }, [])

  return (
    <div className="py-24 sm:py-32" style={{ backgroundColor: bgColor }}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className={`text-base font-semibold leading-7`} style={{ color: accentColor }}>{subtitle}</h2>
          <p className={`mt-2 text-3xl font-bold tracking-tight sm:text-4xl`} style={{ color: textColor }}>
            {title}
          </p>
          <p className={`mt-6 text-lg leading-8 opacity-80`} style={{ color: textColor }}>
            {description}
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl id="cards" className={`grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-${columns}`}>
            {content.map((feature) => (
              <HoverGridContainer key={feature.title} className="flex flex-col">
                <dt className={`flex items-center gap-x-3 text-base font-semibold leading-7`} style={{ color: textColor }}>
                  <div className={`h-10 w-10 flex items-center justify-center rounded-lg`} style={{ backgroundColor: accentColor }}>
                    {feature.icon}
                  </div>
                  {feature.title}
                </dt>
                <dd className={`mt-4 flex flex-auto flex-col text-base leading-7 opacity-80`} style={{ color: textColor }}>
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </HoverGridContainer>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
