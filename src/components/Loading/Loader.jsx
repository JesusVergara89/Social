import React from 'react'
import { tailspin } from 'ldrs'
const Loader = () => {
    tailspin.register()
    return (
        <div className='loader'>
            <l-tailspin
                size="30"
                stroke="2"
                speed="1.3"
                color="#0095f6"
            ></l-tailspin>
        </div>
    )
}

export default Loader