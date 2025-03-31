import React from 'react'

type Props = {
    children: React.ReactNode;
}

const Card = ({ children }: Props) => {
    return (
        <section className='rounded-2xl bg-amber-50 w-md h-100 shadow-[0_35px_35px_rgba(0,0,0,0.25)]'>
            {children}
        </section>
    )
}

export default Card