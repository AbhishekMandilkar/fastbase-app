import React from 'react'
import { DatabaseZapIcon } from 'lucide-react'

const Brand = (props: {
    showText?: boolean
}) => {
    const {showText = true} = props;
  return (
    <>
      <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <DatabaseZapIcon className="size-5" />
      </div>
      {showText && (
        <div className="flex flex-col gap-0.5 leading-none">
          <span className="font-semibold font-mono">fastbase</span>
        </div>
      )}
    </>
  )
}

export default Brand
