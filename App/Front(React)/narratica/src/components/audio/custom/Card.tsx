import React from 'react'

type Props = {
    children: React.ReactNode;
}

const Card = ({ children }: Props) => {
    return (
        <section className='rounded-2xl bg-amber-50 w-md h-100 shadow-lg'>
            {children}
        </section>
    )
}

export default Card