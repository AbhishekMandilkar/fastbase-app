import {cn} from '@/lib/utils';
import React from 'react'

const AppHeader = (props: { title: string | React.ReactNode; right?: React.ReactNode, titleClassName?: string }) => {
  return (
    <div className="flex justify-between items-center space-x-2 px-4 py-2 border-b">
      <h2 className={cn("text-lg font-semibold", props.titleClassName)}>{props.title}</h2>
      <div className="ml-auto flex space-x-2 sm:justify-end">{props.right}</div>
    </div>
  )
}

export default React.memo(AppHeader)