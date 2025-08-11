import Image from "next/image";
import React from "react";


export const Logo: React.FC = () => {
    return(
        <div className="flex items-center justify-center text-emerald-500 border-2 border-emerald-500 rounded-full px-2 py-1 ">
            <Image
            src={'/Group 15.svg'}
            alt=""
            width={50}
            height={50}
            className="h-8 w-8 rounded-full "
            />
             <span className="text-white">Grow</span><span className="text-emerald-500">Eazie</span>
        </div>
    )
}