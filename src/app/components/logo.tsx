import Image from "next/image";
import React from "react";


export const Logo: React.FC = () => {
    return(
        <div className="flex items-center justify-center  rounded-full ">
            <Image
            src={'/Group 15.svg'}
            alt=""
            width={50}
            height={50}
            className="h-8 w-8 rounded-full "

            />
        </div>
    )
}