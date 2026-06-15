import Image from 'next/image'
import React from 'react'

const EmptyBoards = () => {
  return (
    <div className='h-full flex flex-col items-center justify-center'>
        <Image src={"./folder.svg"} alt='Empty Boards' height={250} width={250} loading='lazy' />
        <h2 className='text-3xl font-semibold mt-4'>Create your first board!</h2>
        <p className='text-muted-foreground text-sm mt-2'>Start by creating a board for your organization</p>
    </div>
  )
}

export default EmptyBoards