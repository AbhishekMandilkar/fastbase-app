import React from 'react'
import peerlist from '../resources/Launch_SVG_Light.svg'
import Image from 'next/image'

const HeroBanner = () => {
  return (
    <div className='flex space-x-2'>
      <Image src={peerlist} alt='launched_on_peerlist' />
    </div>
  )
}

export default HeroBanner