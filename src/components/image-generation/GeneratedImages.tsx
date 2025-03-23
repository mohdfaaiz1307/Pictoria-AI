'use client'
import React from 'react'
import { Card, CardContent } from '../ui/card'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
import Image from 'next/image'
import useGeneratedStore from '@/store/useGeneratedStore'
  

/*const images=[
    {
        src: '/hero-images/Charismatic Young Man with a Warm Smile and Stylish Tousled Hair.jpeg',
        alt: 'some alt text'
    },
    {
        src: '/hero-images/Confident Businesswoman on Turquoise Backdrop.jpeg',
        alt: 'some alt text'
    },
    {
        src: '/hero-images/Confident Woman in Red Outfit.jpeg',
        alt: 'some alt text'
    },
    {
        src: '/hero-images/Futuristic Helmet Portrait.jpeg',
        alt: 'some alt text'
    }
]*/

const GeneratedImages = () => {

  const images = useGeneratedStore((state) => state.images);
  const loading = useGeneratedStore((state) => state.loading)

  console.log(images);

    if(images.length === 0){
        return <Card className='w-full max-w-2xl bg-muted'>
            <CardContent className='flex aspect-square items-center justify-center p-6'>
                <span className='text-2xl'>
                    No images generated
                </span>
            </CardContent>
            </Card>
    }
  return (
    <Carousel
      className="w-full max-w-2xl"
    >
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index} >
            <div className="flex relative items-center justify-center rounded-lg overflow-hidden aspect-square">
                <Image src={image.url} alt={'Generated images using AI'} fill className='w-full h-full object-cover' />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

export default GeneratedImages