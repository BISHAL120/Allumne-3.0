import React from 'react'

const PageTittle = ({ title, description }: { title: string; description: string }) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>{description}</span>
      </div>
    </div>
  )
}

export default PageTittle