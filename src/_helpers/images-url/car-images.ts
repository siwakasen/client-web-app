export const convertCarImageUrl = (image: string) => {
    return `${process.env.NEXT_PUBLIC_CARS_API_URL}/public/car-images/${image}`
}