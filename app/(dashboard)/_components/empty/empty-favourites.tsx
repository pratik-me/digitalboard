import Image from 'next/image'

const EmptyFavourites = () => {
  return (
    <div className='flex flex-col items-center justify-center h-full'>
        <Image src={"./no-favourites.svg"} alt='No favourites' height={300} width={300} />
        <h2 className='font-semibold text-2xl'>No favourite boards found!</h2>
        <p className='text-md text-muted-foreground mt-2'>Favourite a board to add it here</p>
    </div>
  )
}

export default EmptyFavourites